import bpy

bpy.ops.wm.open_mainfile(filepath=r"C:\Users\jain2\Desktop\Websites\ToteMood-v3\public\3Dmodel\tote_bag.blend")

for mat in bpy.data.materials:
    print(f"Material: {mat.name}")
    if mat.use_nodes and mat.node_tree:
        for node in mat.node_tree.nodes:
            print(f"  Node: {node.type} - {node.name}")
            if node.type == 'TEX_IMAGE' and getattr(node, 'image', None):
                print(f"    Image: {node.image.name}")
            if node.type == 'NORMAL_MAP':
                print(f"    Normal Map node found")
