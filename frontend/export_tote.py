import bpy

# Load the blend file
blend_path = r"C:\Users\jain2\Desktop\Websites\ToteMood-v3\public\3Dmodel\tote_bag.blend"
bpy.ops.wm.open_mainfile(filepath=blend_path)

# 1. Unparent all meshes while keeping their world transform
for obj in bpy.data.objects:
    if obj.type == 'MESH':
        matrix_copy = obj.matrix_world.copy()
        obj.parent = None
        obj.matrix_world = matrix_copy

# 2. Delete all Empties / non-mesh objects
bpy.ops.object.select_all(action='DESELECT')
for obj in bpy.data.objects:
    if obj.type != 'MESH':
        obj.select_set(True)
bpy.ops.object.delete()

# 3. Join all remaining "Object_X" into a single "Tote_Threads" mesh
bpy.ops.object.select_all(action='DESELECT')
thread_objs = [obj for obj in bpy.data.objects if obj.name.startswith("Object_")]
if thread_objs:
    for obj in thread_objs:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = thread_objs[0]
    bpy.ops.object.join()
    bpy.context.active_object.name = "Tote_Threads"

# 4. Apply transforms (Location, Rotation, Scale) for all objects
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

# 5. Purge unused materials, textures, and data blocks (run a few times for recursive cleaning)
for _ in range(4):
    bpy.ops.outliner.orphans_purge(do_local_ids=True, do_linked_ids=True, do_recursive=True)

# 6. Export to GLB
export_path = r"C:\Users\jain2\Desktop\Websites\ToteMood-v3\public\3Dmodel\tote_optimized.glb"
bpy.ops.export_scene.gltf(
    filepath=export_path,
    export_format='GLB',
    use_selection=False,
    export_apply=True,
    export_materials='EXPORT',
    export_image_format='AUTO'
)

# Save blend file one last time as optimized
bpy.ops.wm.save_as_mainfile(filepath=r"C:\Users\jain2\Desktop\Websites\ToteMood-v3\public\3Dmodel\tote_optimized.blend")
print("--- PREPARATION AND EXPORT COMPLETE ---")
