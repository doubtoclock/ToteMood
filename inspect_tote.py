import bpy

bpy.ops.wm.read_factory_settings(use_empty=True)

glb_path = r"C:\Users\jain2\Desktop\Websites\ToteMood-v3\public\3Dmodel\tote_bag.glb"
bpy.ops.import_scene.gltf(filepath=glb_path)

print("--- HIERARCHY START ---")
def print_hierarchy(obj, indent=""):
    mat_names = [m.name for m in obj.data.materials if m] if obj.type == 'MESH' else []
    print(f"{indent}{obj.name} ({obj.type}) - Materials: {mat_names}")
    for child in obj.children:
        print_hierarchy(child, indent + "  ")

for obj in bpy.context.scene.collection.objects:
    if obj.parent is None:
        print_hierarchy(obj)
print("--- HIERARCHY END ---")
