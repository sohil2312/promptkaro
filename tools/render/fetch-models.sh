#!/bin/sh
# Downloads the open-licensed glTF models used by scenes.html (Khronos glTF Sample Assets).
# Licenses and authors are listed in /credits.html. Run from tools/render.
set -e
B=https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models
mkdir -p models
for n in GlamVelvetSofa SheenWoodLeatherSofa SheenChair ChairDamaskPurplegold SpecularSilkPouf AnisotropyBarnLamp \
         IridescenceLamp GlassVaseFlowers DiffuseTransmissionPlant GlassHurricaneCandleHolder DiffuseTransmissionTeacup \
         Lantern MaterialsVariantsShoe SunglassesKhronos Corset ChronographWatch CommercialRefrigerator \
         IridescentDishWithOlives PotOfCoals; do
  [ -f "models/$n.glb" ] || curl -sfL -o "models/$n.glb" "$B/$n/glTF-Binary/$n.glb"
done
echo "models ready"
