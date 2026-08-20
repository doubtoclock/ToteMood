import bpy

blend_path = r"C:\Users\jain2\Desktop\Websites\ToteMood-v3\public\3Dmodel\tote_web.blend"
bpy.ops.wm.open_mainfile(filepath=blend_path)

# 1. Get the base black canvas material
bag_mat = bpy.data.materials.get("Bag_Material")
if not bag_mat:
    bag_mat = bpy.data.materials.new("Bag_Material")
    bag_mat.use_nodes = True
    bag_mat.node_tree.nodes["Principled BSDF"].inputs['Base Color'].default_value = (0.02, 0.02, 0.02, 1.0)

# 2. Setup the Artwork Material (Transparent)
art_mat = bpy.data.materials.get("Canvas_Material")
if art_mat:
    art_mat.name = "Artwork_Material"
else:
    art_mat = bpy.data.materials.new("Artwork_Material")
    art_mat.use_nodes = True

# In newer Blender versions, Alpha mode is automatically inferred by the exporter
# based on whether the Principled BSDF's Alpha socket is linked.

bsdf = art_mat.node_tree.nodes.get("Principled BSDF")
bsdf.inputs['Roughness'].default_value = 0.9

tex_node = art_mat.node_tree.nodes.get("Artwork")
if not tex_node:
    tex_node = art_mat.node_tree.nodes.new('ShaderNodeTexImage')
    tex_node.name = "Artwork"
    tex_node.label = "Artwork"

img = bpy.data.images.get("Artwork_Placeholder")
if not img:
    img = bpy.data.images.new(name="Artwork_Placeholder", width=1024, height=1024, alpha=True)
    img.generated_color = (1.0, 1.0, 1.0, 0.0) # Transparent

tex_node.image = img

# Link Color and Alpha to trigger transparency export
links = art_mat.node_tree.links
links.new(tex_node.outputs['Color'], bsdf.inputs['Base Color'])
links.new(tex_node.outputs['Alpha'], bsdf.inputs['Alpha'])

# 3. Create the Decal Layer Geometry
tote_front = bpy.data.objects.get("Tote_Front")
if tote_front:
    # Set original to solid black canvas
    if not tote_front.data.materials:
        tote_front.data.materials.append(bag_mat)
    else:
        tote_front.data.materials[0] = bag_mat
    
    # Duplicate to create Artwork layer
    bpy.ops.object.select_all(action='DESELECT')
    tote_front.select_set(True)
    bpy.context.view_layer.objects.active = tote_front
    bpy.ops.object.duplicate(linked=False)
    
    tote_artwork = bpy.context.active_object
    tote_artwork.name = "Tote_Artwork"
    
    # Assign artwork material to the duplicate
    tote_artwork.data.materials[0] = art_mat
    
    # Displace the artwork layer slightly (0.5mm) along normals to avoid Z-fighting
    mod = tote_artwork.modifiers.new(name="Decal_Offset", type='DISPLACE')
    mod.strength = 0.0005
    bpy.ops.object.modifier_apply(modifier="Decal_Offset")

# 4. Save and Export
bpy.ops.wm.save_as_mainfile(filepath=blend_path)

export_path = r"C:\Users\jain2\Desktop\Websites\ToteMood-v3\public\3Dmodel\tote_web.glb"
bpy.ops.export_scene.gltf(
    filepath=export_path,
    export_format='GLB',
    use_selection=False,
    export_apply=True,
    export_materials='EXPORT',
    export_lights=True,
    export_image_format='AUTO', # Essential to keep Alpha channel as PNG
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=6
)
print("--- DYNAMIC ARTWORK LAYER EXPORT COMPLETE ---")
