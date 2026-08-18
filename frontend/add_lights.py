import bpy
import math
from mathutils import Vector

blend_path = r"C:\Users\jain2\Desktop\Websites\ToteMood-v3\public\3Dmodel\tote_optimized.blend"
bpy.ops.wm.open_mainfile(filepath=blend_path)

# Delete existing lights just in case
bpy.ops.object.select_all(action='DESELECT')
for obj in bpy.data.objects:
    if obj.type == 'LIGHT':
        obj.select_set(True)
bpy.ops.object.delete()

def look_at(obj, target):
    direction = target - obj.location
    rot_quat = direction.to_track_quat('-Z', 'Y')
    obj.rotation_euler = rot_quat.to_euler()

# 1. Soft Key Light (Spot)
light_data1 = bpy.data.lights.new(name="Key_Light", type='SPOT')
light_data1.energy = 2500  # Watts
light_data1.spot_size = math.radians(70)
light_data1.spot_blend = 1.0 # Soft edge
light_data1.shadow_soft_size = 0.5 # Soft shadow
light_obj1 = bpy.data.objects.new(name="Key_Light", object_data=light_data1)
bpy.context.scene.collection.objects.link(light_obj1)
light_obj1.location = Vector((1.5, -3.0, 2.5))
look_at(light_obj1, Vector((0, 0, 0.5))) # Point slightly above origin

# 2. Rim Light (Spot)
light_data2 = bpy.data.lights.new(name="Rim_Light", type='SPOT')
light_data2.energy = 5000  # Watts
light_data2.color = (0.85, 0.9, 1.0) # Slightly cool rim light
light_data2.spot_size = math.radians(50)
light_data2.spot_blend = 0.5
light_data2.shadow_soft_size = 0.2
light_obj2 = bpy.data.objects.new(name="Rim_Light", object_data=light_data2)
bpy.context.scene.collection.objects.link(light_obj2)
light_obj2.location = Vector((-1.5, 3.0, 1.5))
look_at(light_obj2, Vector((0, 0, 0.5)))

# 3. Soft Environment lighting (World Background acts as ambient in GLTF)
world = bpy.context.scene.world
if not world:
    world = bpy.data.worlds.new("World")
    bpy.context.scene.world = world

world.use_nodes = True
bg_node = world.node_tree.nodes.get('Background')
if bg_node:
    bg_node.inputs[0].default_value = (0.1, 0.1, 0.12, 1.0) # Soft studio grey/blue ambient
    bg_node.inputs[1].default_value = 1.0 # Strength

bpy.ops.wm.save_as_mainfile(filepath=blend_path)

export_path = r"C:\Users\jain2\Desktop\Websites\ToteMood-v3\public\3Dmodel\tote_optimized.glb"
bpy.ops.export_scene.gltf(
    filepath=export_path,
    export_format='GLB',
    use_selection=False,
    export_apply=True,
    export_materials='EXPORT',
    export_lights=True,
    export_image_format='AUTO'
)
print("--- LIGHTING UPDATE AND EXPORT COMPLETE ---")
