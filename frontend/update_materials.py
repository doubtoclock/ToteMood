import bpy

# Load the blend file
blend_path = r"C:\Users\jain2\Desktop\Websites\ToteMood-v3\public\3Dmodel\tote_bag.blend"
bpy.ops.wm.open_mainfile(filepath=blend_path)

# Create the artwork image placeholder (black cotton color)
black_color = (0.02, 0.02, 0.02, 1.0)
img = bpy.data.images.get("Artwork_Image")
if not img:
    img = bpy.data.images.new(name="Artwork_Image", width=1024, height=1024, alpha=True)
    img.generated_color = black_color

def setup_black_cotton(mat, is_front=False):
    if not mat or not mat.node_tree:
        return
    
    # Find Principled BSDF
    bsdf = None
    for node in mat.node_tree.nodes:
        if node.type == 'BSDF_PRINCIPLED':
            bsdf = node
            break
            
    if not bsdf:
        return
        
    # Set Roughness to matte canvas (0.9) and Metallic to 0.0
    bsdf.inputs['Roughness'].default_value = 0.9
    bsdf.inputs['Metallic'].default_value = 0.0
    
    if is_front:
        # Make the front use an Image Texture named "Artwork"
        tex_node = mat.node_tree.nodes.get("Artwork")
        if not tex_node:
            tex_node = mat.node_tree.nodes.new('ShaderNodeTexImage')
            tex_node.name = "Artwork"
            tex_node.label = "Artwork"
            
            # Position it to the left of the BSDF for neatness
            tex_node.location = (bsdf.location.x - 300, bsdf.location.y)
        
        tex_node.image = img
        
        # Link texture color to BSDF Base Color
        mat.node_tree.links.new(tex_node.outputs['Color'], bsdf.inputs['Base Color'])
    else:
        # Just set base color to black cotton for the rest of the bag
        bsdf.inputs['Base Color'].default_value = black_color

for mat in bpy.data.materials:
    if mat.name == "Canvas_Material":
        setup_black_cotton(mat, is_front=True)
    elif mat.name in ["Tui.002", "Chi.002"]:
        setup_black_cotton(mat, is_front=False)

# Save the blend file
bpy.ops.wm.save_mainfile()
print("--- MATERIAL UPDATE COMPLETE ---")
