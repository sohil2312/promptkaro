"""Photoreal renders with Blender Cycles (bpy) from the open-licensed glTF models in ../models.

Usage (bpy 5.x as a Python module, see README):
  python render.py specs.json outDir [name,name]

A spec composes models in one of three set-ups:
  cutout  transparent PNG with real contact shadows (shadow catcher), for product cards
  sweep   a photographer's seamless backdrop in one colour
  room    an interior corner: wood floor, plaster walls, window light from the side
Coordinates are Blender's: x right, y away from the camera, z up. Heights are in metres.
"""
import json
import math
import os
import sys

import bpy
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
MODELS = os.path.join(HERE, '..', 'models')


def hex_rgb(h, a=1.0):
    h = h.lstrip('#')
    srgb = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    lin = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in srgb]
    return (*lin, a)


def reset(spec):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    sc.cycles.device = 'CPU'
    sc.cycles.samples = spec.get('samples', 96)
    sc.cycles.use_denoising = True
    sc.cycles.denoiser = 'OPENIMAGEDENOISE'
    sc.cycles.max_bounces = 8
    sc.cycles.transmission_bounces = 8
    sc.cycles.transparent_max_bounces = 8
    sc.cycles.caustics_reflective = False
    sc.cycles.caustics_refractive = False
    sc.render.resolution_x = spec.get('w', 1200)
    sc.render.resolution_y = spec.get('h', 900)
    sc.render.resolution_percentage = 100
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_mode = 'RGBA'
    sc.render.film_transparent = spec.get('mode', 'cutout') == 'cutout'
    sc.view_settings.view_transform = 'AgX'
    sc.view_settings.look = spec.get('look', 'AgX - Medium High Contrast')
    sc.view_settings.exposure = spec.get('exposure', 0.0)
    world = bpy.data.worlds.new('World')
    sc.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes['Background']
    bg.inputs[0].default_value = hex_rgb(spec.get('sky', '#F2EEE8'))
    bg.inputs[1].default_value = spec.get('ambient', 0.25)
    return sc


def material(name, color, rough=0.85, spec_=0.3):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    p = m.node_tree.nodes['Principled BSDF']
    p.inputs['Base Color'].default_value = hex_rgb(color)
    p.inputs['Roughness'].default_value = rough
    p.inputs['Specular IOR Level'].default_value = spec_
    return m


def wood_material(base='#8A6142'):
    """Oak-like planks: wave texture grain, noise variation, plank seams from a brick texture."""
    m = bpy.data.materials.new('Wood')
    m.use_nodes = True
    nt = m.node_tree
    p = nt.nodes['Principled BSDF']
    tc = nt.nodes.new('ShaderNodeTexCoord')
    mp = nt.nodes.new('ShaderNodeMapping')
    mp.inputs['Scale'].default_value = (0.6, 9.0, 1.0)
    nt.links.new(tc.outputs['Object'], mp.inputs['Vector'])
    wave = nt.nodes.new('ShaderNodeTexWave')
    wave.inputs['Scale'].default_value = 2.2
    wave.inputs['Distortion'].default_value = 6.0
    wave.inputs['Detail'].default_value = 3.0
    nt.links.new(mp.outputs['Vector'], wave.inputs['Vector'])
    brick = nt.nodes.new('ShaderNodeTexBrick')
    brick.inputs['Scale'].default_value = 1.3
    brick.inputs['Mortar Size'].default_value = 0.004
    brick.inputs['Color1'].default_value = hex_rgb(base)
    brick.inputs['Color2'].default_value = hex_rgb('#6E4C31')
    brick.inputs['Mortar'].default_value = hex_rgb('#4A3524')
    brick.offset = 0.37
    brick.squash = 12.0
    nt.links.new(tc.outputs['Object'], brick.inputs['Vector'])
    mix = nt.nodes.new('ShaderNodeMix')
    mix.data_type = 'RGBA'
    mix.blend_type = 'MULTIPLY'
    mix.inputs['Factor'].default_value = 0.35
    nt.links.new(brick.outputs['Color'], mix.inputs[6])
    nt.links.new(wave.outputs['Color'], mix.inputs[7])
    nt.links.new(mix.outputs[2], p.inputs['Base Color'])
    p.inputs['Roughness'].default_value = 0.42
    p.inputs['Coat Weight'].default_value = 0.25
    p.inputs['Coat Roughness'].default_value = 0.2
    return m


def plane(name, size, loc, rot=(0, 0, 0), mat=None):
    bpy.ops.mesh.primitive_plane_add(size=size, location=loc, rotation=rot)
    o = bpy.context.active_object
    o.name = name
    if mat:
        o.data.materials.append(mat)
    return o


def sweep(color, floor_color=None):
    """Floor and wall joined by a large rounded fillet: no visible horizon."""
    import bmesh
    mesh = bpy.data.meshes.new('Sweep')
    bm = bmesh.new()
    R, W, D, Hh = 1.5, 40, 30, 20
    verts = []
    prof = [(-D, 0)]  # (y, z) profile: floor from far in front to the curve, up the wall
    for i in range(0, 17):
        a = math.pi / 2 * i / 16
        prof.append((8 - R + R * math.sin(a), R - R * math.cos(a)))
    prof.append((8, Hh))
    for x in (-W / 2, W / 2):
        verts.append([bm.verts.new((x, y, z)) for y, z in prof])
    for i in range(len(prof) - 1):
        bm.faces.new((verts[0][i], verts[0][i + 1], verts[1][i + 1], verts[1][i]))
    bm.to_mesh(mesh)
    bm.free()
    o = bpy.data.objects.new('Sweep', mesh)
    bpy.context.collection.objects.link(o)
    for f in o.data.polygons:
        f.use_smooth = True
    o.data.materials.append(material('Backdrop', color, 0.9, 0.2))
    return o


def room(wall, floor, side=None):
    plane('Floor', 40, (0, 0, 0), mat=wood_material() if floor == 'wood' else material('FloorM', floor, 0.6))
    back = plane('Back', 40, (0, 2.2, 20), rot=(math.pi / 2, 0, 0), mat=material('Wall', wall, 0.95, 0.1))
    skirt_m = material('Skirt', '#F4F1EA', 0.5)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 2.19, 0.05))
    sk = bpy.context.active_object
    sk.scale = (40, 0.02, 0.1)
    sk.data.materials.append(skirt_m)
    if side:
        plane('Side', 40, (-3.4, 0, 20), rot=(math.pi / 2, 0, math.pi / 2), mat=material('SideWall', side, 0.95, 0.1))


def image_material(path):
    m = bpy.data.materials.new('Art')
    m.use_nodes = True
    nt = m.node_tree
    tex = nt.nodes.new('ShaderNodeTexImage')
    tex.image = bpy.data.images.load(path)
    nt.links.new(tex.outputs['Color'], nt.nodes['Principled BSDF'].inputs['Base Color'])
    nt.nodes['Principled BSDF'].inputs['Roughness'].default_value = 0.7
    return m


def fabric_material(color):
    m = material('Rug', color, 1.0, 0.1)
    nt = m.node_tree
    p = nt.nodes['Principled BSDF']
    noise = nt.nodes.new('ShaderNodeTexNoise')
    noise.inputs['Scale'].default_value = 900
    bump = nt.nodes.new('ShaderNodeBump')
    bump.inputs['Strength'].default_value = 0.35
    nt.links.new(noise.outputs['Fac'], bump.inputs['Height'])
    nt.links.new(bump.outputs['Normal'], p.inputs['Normal'])
    p.inputs['Sheen Weight'].default_value = 0.6
    return m


def extras(spec):
    for r in spec.get('rugs', []):
        bpy.ops.mesh.primitive_cube_add(size=1, location=(r.get('x', 0), r.get('y', 0), 0.006))
        o = bpy.context.active_object
        o.scale = (r['w'], r['d'], 0.012)
        bev = o.modifiers.new('b', 'BEVEL'); bev.width = 0.005; bev.segments = 2
        o.data.materials.append(fabric_material(r.get('color', '#D9CBB4')))
    for t in spec.get('tables', []):
        wood = wood_material(t.get('color', '#7A5235')) if t.get('wood', True) else material('Tbl', t['color'], 0.3)
        bpy.ops.mesh.primitive_cylinder_add(radius=t.get('r', 0.25), depth=0.03, location=(t['x'], t['y'], t['h'] - 0.015), vertices=96)
        top = bpy.context.active_object; top.data.materials.append(wood)
        bev = top.modifiers.new('b', 'BEVEL'); bev.width = 0.006; bev.segments = 3
        bpy.ops.mesh.primitive_cylinder_add(radius=0.03, depth=t['h'] - 0.03, location=(t['x'], t['y'], (t['h'] - 0.03) / 2), vertices=48)
        leg = bpy.context.active_object; leg.data.materials.append(material('Brass', '#B8925A', 0.3))
        leg.active_material.node_tree.nodes['Principled BSDF'].inputs['Metallic'].default_value = 1.0
        bpy.ops.mesh.primitive_cylinder_add(radius=t.get('r', 0.25) * 0.55, depth=0.012, location=(t['x'], t['y'], 0.006), vertices=96)
        base = bpy.context.active_object; base.data.materials.append(leg.active_material)
    for a in spec.get('art', []):
        bpy.ops.mesh.primitive_cube_add(size=1, location=(a['x'], a.get('y', 2.18), a['z']))
        fr = bpy.context.active_object
        fr.scale = (a['w'] + 0.06, 0.03, a['h'] + 0.06)
        fr.data.materials.append(material('Frame', a.get('frame', '#2B2622'), 0.4))
        bpy.ops.mesh.primitive_plane_add(size=1, location=(a['x'], a.get('y', 2.18) - 0.017, a['z']), rotation=(math.pi / 2, 0, 0))
        pic = bpy.context.active_object
        pic.scale = (a['w'], a['h'], 1)
        pic.data.materials.append(image_material(os.path.join(HERE, a['image'])))
    for b in spec.get('boxes', []):
        bpy.ops.mesh.primitive_cube_add(size=1, location=b['loc'])
        o = bpy.context.active_object
        o.scale = b['size']
        bev = o.modifiers.new('b', 'BEVEL'); bev.width = b.get('bevel', 0.01); bev.segments = 3
        m = (wood_material(b['color']) if b.get('wood') else material('Box', b['color'], b.get('rough', 0.5)))
        if b.get('wood') and b.get('plain'):
            m = pbr('PlainWood', b['color'], 0.55, bumpy=60)
        o.data.materials.append(m)


def lathe(points, segs=72):
    """Spin an (r, z) profile around the z axis: pots, diyas, bowls, candles."""
    import bmesh
    mesh = bpy.data.meshes.new('Lathe')
    bm = bmesh.new()
    rings = []
    for i in range(segs):
        a = 2 * math.pi * i / segs
        rings.append([bm.verts.new((r * math.cos(a), r * math.sin(a), z)) for r, z in points])
    for i in range(segs):
        A, B = rings[i], rings[(i + 1) % segs]
        for j in range(len(points) - 1):
            bm.faces.new((A[j], B[j], B[j + 1], A[j + 1]))
    bm.to_mesh(mesh); bm.free()
    o = bpy.data.objects.new('Lathe', mesh)
    bpy.context.collection.objects.link(o)
    for f in o.data.polygons:
        f.use_smooth = True
    sub = o.modifiers.new('s', 'SUBSURF'); sub.levels = 1; sub.render_levels = 2
    return o


def pbr(name, color, rough=0.5, metal=0.0, sss=0.0, bumpy=0.0, emit=0.0, coat=0.0):
    m = material(name, color, rough)
    p = m.node_tree.nodes['Principled BSDF']
    p.inputs['Metallic'].default_value = metal
    p.inputs['Coat Weight'].default_value = coat
    if sss:
        p.inputs['Subsurface Weight'].default_value = sss
        p.inputs['Subsurface Radius'].default_value = (0.02, 0.012, 0.008)
    if emit:
        p.inputs['Emission Color'].default_value = hex_rgb(color)
        p.inputs['Emission Strength'].default_value = emit
    if bumpy:
        nt = m.node_tree
        n = nt.nodes.new('ShaderNodeTexNoise'); n.inputs['Scale'].default_value = bumpy
        n.inputs['Detail'].default_value = 8
        b = nt.nodes.new('ShaderNodeBump'); b.inputs['Strength'].default_value = 0.5
        nt.links.new(n.outputs['Fac'], b.inputs['Height']); nt.links.new(b.outputs['Normal'], p.inputs['Normal'])
    return m


def flame(loc, scale=1.0):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=1, location=(loc[0], loc[1], loc[2] + 0.012 * scale), segments=24, ring_count=16)
    f = bpy.context.active_object
    f.scale = (0.0055 * scale, 0.0055 * scale, 0.016 * scale)
    f.data.materials.append(pbr('Flame', '#FFB347', emit=60))
    f.visible_shadow = False
    d = bpy.data.lights.new('FlameLight', 'POINT'); d.energy = 2.5 * scale; d.color = hex_rgb('#FF9A3C')[:3]; d.shadow_soft_size = 0.01
    o = bpy.data.objects.new('FlameLight', d); bpy.context.collection.objects.link(o)
    o.location = (loc[0], loc[1], loc[2] + 0.03 * scale)


# ---------------------------------------------------------------- Visi cooler (modelled here)
def _box(name, size, loc, mat, bevel=0.004, parent=None):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o = bpy.context.active_object
    o.name = name
    o.scale = size
    if bevel:
        b = o.modifiers.new('b', 'BEVEL'); b.width = bevel; b.segments = 3
    o.data.materials.append(mat)
    if parent:
        o.parent = parent
    return o


_COOLER_MATS = {}


def _cooler_mats():
    if _COOLER_MATS:
        return _COOLER_MATS
    m = _COOLER_MATS
    m['body'] = pbr('PowderCoat', '#E9ECEE', 0.38, coat=0.3)
    m['liner'] = pbr('Liner', '#F4F6F7', 0.5)
    m['alu'] = pbr('Aluminium', '#2A2F33', 0.32, metal=0.9)
    m['grille'] = pbr('Grille', '#1E2226', 0.6, metal=0.4)
    m['wire'] = pbr('Wire', '#C9CED2', 0.25, metal=1.0)
    g = bpy.data.materials.new('DoorGlass'); g.use_nodes = True
    gp = g.node_tree.nodes['Principled BSDF']
    gp.inputs['Base Color'].default_value = hex_rgb('#EAF4F8')
    gp.inputs['Transmission Weight'].default_value = 1.0
    gp.inputs['Roughness'].default_value = 0.02
    gp.inputs['IOR'].default_value = 1.5
    m['glass'] = g
    m['led'] = pbr('LED', '#F2FAFF', 0.5, emit=6)
    m['rubber'] = pbr('Rubber', '#15181A', 0.8)
    return m


def _bottle_mesh():
    """One PET bottle (0.5 L), shared by every bottle instance."""
    o = lathe([(0, 0), (0.028, 0.0), (0.033, 0.01), (0.033, 0.13), (0.03, 0.15), (0.032, 0.16), (0.032, 0.17),
               (0.022, 0.2), (0.013, 0.215), (0.012, 0.225)], 32)
    return o.data


def _bottle_mats(color, label):
    liquid = bpy.data.materials.new('Liquid' + color); liquid.use_nodes = True
    lp = liquid.node_tree.nodes['Principled BSDF']
    lp.inputs['Base Color'].default_value = hex_rgb(color)
    lp.inputs['Transmission Weight'].default_value = 0.85
    lp.inputs['Roughness'].default_value = 0.05
    return liquid, pbr('Label' + label, label, 0.35, coat=0.6)


def cooler(c):
    """A commercial visi cooler: powder-coated cabinet, lit brand canopy, glass door(s) in
    aluminium frames, wire shelves stocked with unbranded bottles and cans, a lit interior."""
    M = _cooler_mats()
    doors = c.get('doors', 1)
    W = c.get('w', 0.6 * doors)
    D = 0.62
    H = c.get('h', 1.95)
    can_h = 0.16
    body_h = H - can_h
    root = bpy.data.objects.new('Cooler', None)
    bpy.context.collection.objects.link(root)
    t = 0.035  # wall thickness
    # Cabinet shell: sides, back, top, plinth with grille
    plinth = 0.14
    _box('SideL', (t, D, body_h - plinth), (-W / 2 + t / 2, 0, plinth + (body_h - plinth) / 2), M['body'], parent=root)
    _box('SideR', (t, D, body_h - plinth), (W / 2 - t / 2, 0, plinth + (body_h - plinth) / 2), M['body'], parent=root)
    _box('Back', (W, t, body_h - plinth), (0, D / 2 - t / 2, plinth + (body_h - plinth) / 2), M['liner'], parent=root)
    _box('Top', (W, D, t), (0, 0, body_h - t / 2), M['body'], parent=root)
    _box('Floor', (W, D, t), (0, 0, plinth + t / 2), M['liner'], parent=root)
    _box('Plinth', (W, D - 0.02, plinth), (0, 0.01, plinth / 2), M['grille'], parent=root)
    for i in range(7):
        _box('Slat', (W - 0.08, 0.006, 0.008), (0, -D / 2 + 0.002, 0.025 + i * 0.016), M['wire'], bevel=0, parent=root)
    # Brand canopy: a lit panel with the brand name
    cm = pbr('Canopy' + c.get('canopy', '#0F5B6B'), c.get('canopy', '#0F5B6B'), 0.4, coat=0.5)
    _box('Canopy', (W, D, can_h), (0, 0, body_h + can_h / 2), cm, bevel=0.01, parent=root)
    bpy.ops.object.text_add(location=(0, -D / 2 - 0.002, body_h + can_h / 2), rotation=(math.pi / 2, 0, 0))
    tx = bpy.context.active_object
    tx.data.body = c.get('brand', 'HIMAL')
    tx.data.align_x = 'CENTER'; tx.data.align_y = 'CENTER'
    tx.data.size = can_h * 0.5 * min(1.0, 6 / max(len(tx.data.body), 1))
    tx.data.extrude = 0.002
    tx.data.space_character = 1.15
    tx.data.materials.append(pbr('BrandText', c.get('text', '#FFFFFF'), 0.4, emit=c.get('glow', 3.0)))
    tx.parent = root
    # Shelves and stock
    inner_w = W - 2 * t
    levels = [plinth + 0.06 + k * (body_h - plinth - 0.14) / 5 for k in range(5)]
    palettes = c.get('stock', ['#3B1408', '#F7A21B', '#9BD34B', '#E3F1F7', '#F9C80E', '#B5121B'])
    labels = c.get('labels', ['#C4161C', '#F28C1B', '#0E7C3A', '#1E5AA8', '#2B2B2B', '#F7F2E8'])
    bm = _bottle_mesh()
    bpy.data.objects.remove(next(o for o in bpy.data.objects if o.data == bm))  # keep the mesh, drop the template object
    bm.materials.append(_cooler_mats()['liner'])  # one slot; each bottle links its own material to it
    mats = [_bottle_mats(palettes[i % len(palettes)], labels[i % len(labels)]) for i in range(len(palettes))]
    cap_mats = [pbr('Cap' + col, col, 0.4) for col in ['#C4161C', '#1E5AA8', '#0E7C3A', '#F7F7F7']]
    can_mats = [pbr('Can' + col, col, 0.22, metal=0.9, coat=0.8) for col in ['#C4161C', '#1E5AA8', '#F28C1B', '#0E7C3A', '#7A1FA2']]
    import random
    rnd = random.Random(c.get('seed', 7))
    for li, z in enumerate(levels):
        _box('Shelf', (inner_w - 0.01, D - 0.12, 0.008), (0, 0.03, z), M['wire'], bevel=0, parent=root)
        cans = li == len(levels) - 1
        pitch = 0.074 if cans else 0.072
        n = int((inner_w - 0.02) // pitch)
        x0 = -(n - 1) * pitch / 2
        group = rnd.randrange(len(mats))
        for row in range(3 if cans else 2):
            for k in range(n):
                if rnd.random() < 0.06:
                    continue  # a gap where something sold
                if k % 4 == 0:
                    group = (group + 1) % len(mats)
                x = x0 + k * pitch + rnd.uniform(-0.004, 0.004)
                y = -D / 2 + 0.12 + row * 0.085
                if cans:
                    bpy.ops.mesh.primitive_cylinder_add(radius=0.033, depth=0.122, location=(x, y, z + 0.065), vertices=32)
                    o = bpy.context.active_object; o.data.materials.append(can_mats[(k // 3 + row) % len(can_mats)]); o.parent = root
                    for o2 in o.data.polygons: o2.use_smooth = True
                else:
                    o = bpy.data.objects.new('Bottle', bm)
                    bpy.context.collection.objects.link(o)
                    o.location = (x, y, z + 0.004)
                    o.rotation_euler = (0, 0, rnd.uniform(0, 6.28))
                    o.parent = root
                    liquid, label = mats[group]
                    o.material_slots[0].link = 'OBJECT'  # the mesh is shared; the liquid colour is per bottle
                    o.material_slots[0].material = liquid
                    bpy.ops.mesh.primitive_cylinder_add(radius=0.0336, depth=0.07, location=(x, y, z + 0.004 + 0.085), vertices=32)
                    lb = bpy.context.active_object; lb.data.materials.append(label); lb.parent = root
                    bpy.ops.mesh.primitive_cylinder_add(radius=0.0135, depth=0.016, location=(x, y, z + 0.004 + 0.232), vertices=20)
                    cp = bpy.context.active_object; cp.data.materials.append(cap_mats[group % len(cap_mats)]); cp.parent = root
    # Interior light: LED strips down both sides, plus soft fill so the stock reads through the glass
    for sx in (-1, 1):
        _box('LEDStrip', (0.012, 0.012, body_h - plinth - 0.1), (sx * (inner_w / 2 - 0.01), -D / 2 + 0.06, plinth + (body_h - plinth) / 2), M['led'], bevel=0, parent=root)
    d = bpy.data.lights.new('Inside', 'AREA'); d.energy = c.get('inside', 60) * doors; d.size = inner_w
    d.color = hex_rgb('#EEF7FF')[:3]
    li_o = bpy.data.objects.new('Inside', d); bpy.context.collection.objects.link(li_o)
    li_o.location = (0, -D / 2 + 0.05, body_h - 0.06); li_o.rotation_euler = (0, 0, 0); li_o.parent = root
    # Door(s): aluminium frame, glass pane, full-height handle
    dw = W / doors
    for k in range(doors):
        cx = -W / 2 + dw * (k + 0.5)
        fy = -D / 2 - 0.02
        fz0, fz1 = plinth, body_h - 0.005
        fh = fz1 - fz0
        fw = 0.045
        _box('FrameL', (fw, 0.04, fh), (cx - dw / 2 + fw / 2, fy, fz0 + fh / 2), M['alu'], parent=root)
        _box('FrameR', (fw, 0.04, fh), (cx + dw / 2 - fw / 2, fy, fz0 + fh / 2), M['alu'], parent=root)
        _box('FrameT', (dw, 0.04, fw), (cx, fy, fz1 - fw / 2), M['alu'], parent=root)
        _box('FrameB', (dw, 0.04, fw * 1.6), (cx, fy, fz0 + fw * 0.8), M['alu'], parent=root)
        _box('Glass', (dw - 2 * fw + 0.01, 0.012, fh - 2.6 * fw), (cx, fy, fz0 + fh / 2 + 0.3 * fw), M['glass'], bevel=0, parent=root)
        hx = cx + (dw / 2 - fw / 2) * (1 if (k % 2 == 0 and doors == 1) or k == 1 else -1)
        _box('Handle', (0.022, 0.03, fh * 0.5), (hx, fy - 0.035, fz0 + fh * 0.55), M['alu'], bevel=0.008, parent=root)
        _box('Gasket', (dw - 0.01, 0.006, 0.01), (cx, fy + 0.022, fz0 + 0.004), M['rubber'], bevel=0, parent=root)
    root.location = (c.get('x', 0), c.get('y', 0), 0)
    root.rotation_euler = (0, 0, math.radians(c.get('rot', 0)))
    return root



def procedural(spec):
    for p in spec.get('pots', []):
        o = lathe([tuple(v) for v in p['profile']])
        o.location = p['loc']; o.scale = (p.get('s', 1),) * 3
        mat = pbr('Pot', p.get('color', '#B5653A'), p.get('rough', 0.75), p.get('metal', 0.0), bumpy=p.get('bumpy', 180), coat=p.get('coat', 0.0))
        if p.get('clay', p.get('metal', 0) == 0 and p.get('bumpy', 180) > 0):
            # Fired clay: colour varies across the surface, no plastic sheen.
            nt = mat.node_tree; pr = nt.nodes['Principled BSDF']
            n = nt.nodes.new('ShaderNodeTexNoise'); n.inputs['Scale'].default_value = 14; n.inputs['Detail'].default_value = 6
            ramp = nt.nodes.new('ShaderNodeValToRGB')
            ramp.color_ramp.elements[0].color = hex_rgb('#8E4426'); ramp.color_ramp.elements[1].color = hex_rgb(p.get('color', '#B5653A'))
            nt.links.new(n.outputs['Fac'], ramp.inputs['Fac']); nt.links.new(ramp.outputs['Color'], pr.inputs['Base Color'])
            pr.inputs['Roughness'].default_value = 0.92; pr.inputs['Specular IOR Level'].default_value = 0.15
        o.data.materials.append(mat)
        if p.get('flame'):
            flame((p['loc'][0], p['loc'][1], p['loc'][2] + p['flame']), p.get('flame_scale', 1.0))
    for c in spec.get('candles', []):
        bpy.ops.mesh.primitive_cylinder_add(radius=c.get('r', 0.03), depth=c['h'], location=(c['x'], c['y'], c.get('z', 0) + c['h'] / 2), vertices=64)
        o = bpy.context.active_object
        bev = o.modifiers.new('b', 'BEVEL'); bev.width = 0.004; bev.segments = 3
        o.data.materials.append(pbr('Wax', c.get('color', '#F5EDDC'), 0.45, sss=0.6))
        flame((c['x'], c['y'], c.get('z', 0) + c['h']))
    for g in spec.get('garlands', []):
        # Marigold strings: a catenary of dense flower heads, a few red and white beads mixed in.
        (x0, y0, z0), (x1, y1, z1) = g['from'], g['to']
        n = g.get('n', 40); sag = g.get('sag', 0.3)
        cols = g.get('colors', ['#F59E0B', '#F97316', '#F59E0B', '#FBBF24'])
        mats = [pbr('Marigold' + c, c, 0.8, bumpy=900) for c in cols]
        for i in range(n):
            t = i / (n - 1)
            x = x0 + (x1 - x0) * t; y = y0 + (y1 - y0) * t
            z = z0 + (z1 - z0) * t - sag * 4 * t * (1 - t)
            bpy.ops.mesh.primitive_ico_sphere_add(radius=g.get('r', 0.028), subdivisions=4, location=(x, y, z))
            o = bpy.context.active_object
            o.scale = (1, 1, 0.82)
            disp = o.modifiers.new('d', 'DISPLACE')
            tex = bpy.data.textures.new('petals', 'VORONOI'); tex.noise_scale = 0.0075; tex.distance_metric = 'DISTANCE_SQUARED'
            disp.texture = tex; disp.strength = 0.016; disp.mid_level = 0.6
            o.data.materials.append(mats[(i * 7) % len(mats)])
    for t in spec.get('towers', []):
        # Architect's model: thin white floor plates on slender columns around a solid core.
        x, y = t['x'], t['y']; w, d = t['w'], t['d']; n = t['floors']; fh = t.get('fh', 0.04)
        card = pbr('Card', '#F4F2EC', 0.85)
        glass = bpy.data.materials.new('Glass'); glass.use_nodes = True
        gp = glass.node_tree.nodes['Principled BSDF']
        gp.inputs['Transmission Weight'].default_value = 1.0; gp.inputs['Roughness'].default_value = 0.05
        gp.inputs['Base Color'].default_value = hex_rgb('#DDE8EA')
        for i in range(n + 1):
            bpy.ops.mesh.primitive_cube_add(size=1, location=(x, y, 0.04 + i * fh))
            o = bpy.context.active_object; o.scale = (w, d, 0.006); o.data.materials.append(card)
        bpy.ops.mesh.primitive_cube_add(size=1, location=(x - w * 0.18, y + d * 0.1, 0.04 + n * fh / 2))
        o = bpy.context.active_object; o.scale = (w * 0.3, d * 0.35, n * fh); o.data.materials.append(card)
        bpy.ops.mesh.primitive_cube_add(size=1, location=(x, y, 0.04 + n * fh / 2))
        o = bpy.context.active_object; o.scale = (w * 0.94, d * 0.94, n * fh); o.data.materials.append(glass)
        for cx in (-0.45, 0, 0.45):
            for cy in (-0.45, 0.45):
                bpy.ops.mesh.primitive_cylinder_add(radius=0.003, depth=n * fh, location=(x + cx * w, y + cy * d, 0.04 + n * fh / 2), vertices=12)
                bpy.context.active_object.data.materials.append(card)
    for c in spec.get('coolers', []):
        cooler(c)
    for m in spec.get('maquette', []):
        bpy.ops.mesh.primitive_cube_add(size=1, location=m['loc'])
        o = bpy.context.active_object; o.scale = m['size']
        bev = o.modifiers.new('b', 'BEVEL'); bev.width = 0.002; bev.segments = 2
        o.data.materials.append(pbr('Card', m.get('color', '#F4F2EC'), m.get('rough', 0.8)))


def import_item(it):
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=os.path.join(MODELS, it['model'] + '.glb'))
    objs = [o for o in bpy.data.objects if o not in before]
    roots = [o for o in objs if o.parent is None]
    empty = bpy.data.objects.new(it['model'] + '_root', None)
    bpy.context.collection.objects.link(empty)
    for r in roots:
        r.parent = empty
    bpy.context.view_layer.update()
    meshes = [o for o in objs if o.type == 'MESH']
    lo = Vector((1e9, 1e9, 1e9)); hi = Vector((-1e9, -1e9, -1e9))
    for m in meshes:
        for c in m.bound_box:
            w = m.matrix_world @ Vector(c)
            lo = Vector(map(min, lo, w)); hi = Vector(map(max, hi, w))
    size = hi - lo
    s = it.get('scale') or (it['height'] / size.z if it.get('height') else 1)
    centre = (lo + hi) / 2
    # Move the content so its footprint centre is at the origin and its base at z=0, then scale and place.
    for r in roots:
        r.location -= Vector((centre.x, centre.y, lo.z))
    empty.scale = (s, s, s)
    empty.rotation_euler = (0, 0, math.radians(it.get('rot', 0)))
    empty.location = (it.get('x', 0), it.get('y', 0), it.get('z', 0))
    bpy.context.view_layer.update()
    return meshes


def bounds(meshes):
    lo = Vector((1e9, 1e9, 1e9)); hi = Vector((-1e9, -1e9, -1e9))
    for m in meshes:
        for c in m.bound_box:
            w = m.matrix_world @ Vector(c)
            lo = Vector(map(min, lo, w)); hi = Vector(map(max, hi, w))
    return lo, hi


def area_light(name, loc, target, power, size, color='#FFF4E6'):
    d = bpy.data.lights.new(name, 'AREA')
    d.energy = power
    d.size = size
    d.color = hex_rgb(color)[:3]
    o = bpy.data.objects.new(name, d)
    bpy.context.collection.objects.link(o)
    o.location = loc
    direction = Vector(target) - Vector(loc)
    o.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()
    return o


def render(name, spec, out):
    sc = reset(spec)
    _COOLER_MATS.clear()  # materials die with the reset scene
    mode = spec.get('mode', 'cutout')
    if mode == 'sweep':
        sweep(spec.get('bg', '#E9E3DA'))
    elif mode == 'room':
        r = spec['room']
        room(r['wall'], r.get('floor', 'wood'), r.get('side'))
    extras(spec)
    procedural(spec)
    item_meshes = []
    for it in spec['items']:
        item_meshes += import_item(it)
    if mode == 'cutout':
        catcher = plane('Catcher', 30, (0, 0, 0))
        catcher.is_shadow_catcher = True

    # Frame everything in the scene that isn't the set itself (models and generated objects).
    meshes = [o for o in bpy.data.objects if o.type == 'MESH' and o.name.split('.')[0] not in ('Sweep', 'Floor', 'Back', 'Side', 'Catcher', 'Cube') and not o.name.startswith('Flame')]
    if spec.get('frame_items_only'):
        meshes = item_meshes
    lo, hi = bounds(meshes)
    centre = (lo + hi) / 2
    radius = (hi - lo).length / 2
    L = spec.get('light', {})
    # Key: a big soft box up and to one side; fill opposite; rim behind.
    kd = L.get('key', [-2.5, -3.0, 4.0])
    k = Vector(kd).normalized() * max(4, radius * 4)
    area_light('Key', centre + k, centre, L.get('power', 900) * max(1, radius) ** 2, L.get('size', 3.0), L.get('color', '#FFF2E2'))
    f = Vector((-kd[0], kd[1] * 1.2, kd[2] * 0.5)).normalized() * max(4, radius * 4)
    area_light('Fill', centre + f, centre, L.get('fill', 140) * max(1, radius) ** 2, 4.0, '#E8EEFF')
    if 'wash' in L:  # a warm light washing the backdrop, for evening scenes
        area_light('Wash', Vector(L['wash']), centre + Vector((0, 3, 0.5)), L.get('wash_power', 300), 4.0, L.get('wash_color', '#FFB070'))
    if 'window' in L:  # a tall window off-frame: warm daylight raking across the room
        area_light('Window', Vector(L['window']), centre, L.get('window_power', 2500), 2.5, '#FFF1DC')
    rim = Vector((kd[0] * 0.4, 3.5, 3.0)).normalized() * max(4, radius * 4)
    area_light('Rim', centre + rim, centre, L.get('rim', 300) * max(1, radius) ** 2, 2.0, '#FFF8F0')
    for i, p in enumerate(spec.get('points', [])):
        d = bpy.data.lights.new(f'P{i}', 'POINT')
        d.energy = p.get('power', 20)
        d.color = hex_rgb(p.get('color', '#FFB45A'))[:3]
        d.shadow_soft_size = p.get('radius', 0.02)
        o = bpy.data.objects.new(f'P{i}', d)
        bpy.context.collection.objects.link(o)
        o.location = p['pos']

    cam_spec = spec.get('cam', {})
    cd = bpy.data.cameras.new('Cam')
    cd.lens = cam_spec.get('lens', 50)
    if cam_spec.get('dof'):
        cd.dof.use_dof = True
        cd.dof.aperture_fstop = cam_spec['dof']
    cam = bpy.data.objects.new('Cam', cd)
    bpy.context.collection.objects.link(cam)
    sc.camera = cam
    target = Vector(cam_spec['target']) if 'target' in cam_spec else centre
    yaw = math.radians(cam_spec.get('yaw', 0)); elev = math.radians(cam_spec.get('elev', 12))
    W, H = sc.render.resolution_x, sc.render.resolution_y
    sensor = 36.0
    fov_h = 2 * math.atan(sensor / 2 / cd.lens)
    fov_v = 2 * math.atan(math.tan(fov_h / 2) * H / W) if W >= H else fov_h
    if W < H:
        fov_h = 2 * math.atan(math.tan(fov_v / 2) * W / H)
    fit = radius * cam_spec.get('fit', 1.1)
    dist = cam_spec.get('dist') or max(fit / math.sin(min(fov_h, fov_v) / 2), 0.3)
    cam.location = target + Vector((math.sin(yaw) * math.cos(elev), -math.cos(yaw) * math.cos(elev), math.sin(elev))) * dist
    cam.rotation_euler = (target - cam.location).to_track_quat('-Z', 'Y').to_euler()
    if cam_spec.get('dof'):
        cd.dof.focus_distance = (target - cam.location).length
    sc.render.filepath = os.path.join(out, name + '.png')
    bpy.ops.render.render(write_still=True)


if __name__ == '__main__':
    spec_file, out = sys.argv[1], sys.argv[2]
    only = sys.argv[3].split(',') if len(sys.argv) > 3 else None
    os.makedirs(out, exist_ok=True)
    specs = json.load(open(spec_file))
    import time
    for name, spec in specs.items():
        if only and name not in only:
            continue
        t = time.time()
        render(name, spec, out)
        print('done', name, round(time.time() - t, 1), 's', flush=True)
