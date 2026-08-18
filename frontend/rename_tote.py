import bpy

bpy.ops.wm.read_factory_settings(use_empty=True)

glb_path = r"C:\Users\jain2\Desktop\Websites\ToteMood-v3\public\3Dmodel\tote_bag.glb"
bpy.ops.import_scene.gltf(filepath=glb_path)

if "Mat_Truoc_Tui.002" in bpy.data.materials:
    bpy.data.materials["Mat_Truoc_Tui.002"].name = "Canvas_Material"

for obj in bpy.data.objects:
    if obj.type == 'MESH':
        if obj.name == "Object_27":
            obj.name = "Tote_Front"
        elif obj.name == "Object_26":
            obj.name = "Tote_Body"
        elif obj.name == "Object_20":
            obj.name = "Tote_Handle"

blend_path = r"C:\Users\jain2\Desktop\Websites\ToteMood-v3\public\3Dmodel\tote_bag.blend"
bpy.ops.wm.save_as_mainfile(filepath=blend_path)
print("--- RENAME AND SAVE COMPLETE ---")
