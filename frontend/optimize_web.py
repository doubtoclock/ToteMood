import bpy

blend_path = r"C:\Users\jain2\Desktop\Websites\ToteMood-v3\public\3Dmodel\tote_optimized.blend"
bpy.ops.wm.open_mainfile(filepath=blend_path)

# 1. Merge duplicate/identical materials to reduce material slots
mat_bag = bpy.data.materials.get("Tui.002")
if mat_bag:
    mat_bag.name = "Bag_Material"

for obj in bpy.data.objects:
    if obj.type == 'MESH':
        for slot in obj.material_slots:
            if slot.material and slot.material.name in ["Tui.002", "Chi.002"]:
                slot.material = mat_bag

# 2. Join Body, Handle, and Threads into a single "Tote_Body" mesh
bpy.ops.object.select_all(action='DESELECT')
target_meshes = ["Tote_Body", "Tote_Handle", "Tote_Threads"]
objs_to_join = [bpy.data.objects.get(name) for name in target_meshes if bpy.data.objects.get(name)]

if objs_to_join:
    for obj in objs_to_join:
        obj.select_set(True)
    
    # Set the active object to Tote_Body so the merged object takes its name
    bpy.context.view_layer.objects.active = bpy.data.objects.get("Tote_Body")
    bpy.ops.object.join()

# 3. Remove doubles (merge overlapping vertices) to clean up geometry
bpy.ops.object.select_all(action='DESELECT')
for obj in bpy.data.objects:
    if obj.type == 'MESH':
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.mode_set(mode='EDIT')
        bpy.ops.mesh.select_all(action='SELECT')
        bpy.ops.mesh.remove_doubles(threshold=0.0001)
        bpy.ops.object.mode_set(mode='OBJECT')

# 4. Clean up orphaned materials/data
for _ in range(3):
    bpy.ops.outliner.orphans_purge(do_local_ids=True, do_linked_ids=True, do_recursive=True)

# 5. Export for Web using Draco compression & JPEG textures
export_path = r"C:\Users\jain2\Desktop\Websites\ToteMood-v3\public\3Dmodel\tote_web.glb"
bpy.ops.export_scene.gltf(
    filepath=export_path,
    export_format='GLB',
    use_selection=False,
    export_apply=True,
    export_materials='EXPORT',
    export_lights=True,
    export_image_format='JPEG',
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=6
)

bpy.ops.wm.save_as_mainfile(filepath=r"C:\Users\jain2\Desktop\Websites\ToteMood-v3\public\3Dmodel\tote_web.blend")
print("--- WEB OPTIMIZATION AND EXPORT COMPLETE ---")
