from PIL import Image
import os

def create_favicon():
    """
    Create favicon files from the uploaded personal photo.
    Crops to focus on face and creates multiple optimized sizes.
    """
    # Input and output paths
    input_path = r"C:\Users\Hardware\.gemini\antigravity\brain\a5551724-9c65-47bc-b190-1e480a3b89a8\uploaded_image_1766489808913.png"
    output_dir = r"d:\TwoProjects\PortFolio\static\img"
    
    # Ensure output directory exists
    os.makedirs(output_dir, exist_ok=True)
    
    # Open the image
    img = Image.open(input_path)
    print(f"Original image size: {img.size}")
    
    # Get image dimensions
    width, height = img.size
    
    # Calculate crop box to focus on face (upper-middle portion)
    # Assuming face is in the upper-middle third of the image
    crop_size = min(width, int(height * 0.6))  # Focus on upper 60% height
    
    # Center horizontally, focus on upper portion vertically
    left = (width - crop_size) // 2
    top = int(height * 0.1)  # Start from 10% down
    right = left + crop_size
    bottom = top + crop_size
    
    # Ensure we don't exceed image bounds
    if bottom > height:
        bottom = height
        top = bottom - crop_size
    
    # Crop to square focusing on face
    img_cropped = img.crop((left, top, right, bottom))
    print(f"Cropped to: {img_cropped.size}")
    
    # Create high-quality base image (512x512)
    img_512 = img_cropped.resize((512, 512), Image.Resampling.LANCZOS)
    img_512.save(os.path.join(output_dir, "favicon-512.png"), "PNG", optimize=True)
    print("Created favicon-512.png")
    
    # Create Apple Touch Icon (180x180)
    img_180 = img_cropped.resize((180, 180), Image.Resampling.LANCZOS)
    img_180.save(os.path.join(output_dir, "apple-touch-icon.png"), "PNG", optimize=True)
    print("Created apple-touch-icon.png")
    
    # Create standard favicon sizes
    sizes = [16, 32, 48, 192]
    for size in sizes:
        img_resized = img_cropped.resize((size, size), Image.Resampling.LANCZOS)
        img_resized.save(os.path.join(output_dir, f"favicon-{size}.png"), "PNG", optimize=True)
        print(f"Created favicon-{size}.png")
    
    # Create .ico file with multiple sizes (16, 32, 48)
    ico_sizes = [(16, 16), (32, 32), (48, 48)]
    ico_images = []
    for size in ico_sizes:
        ico_img = img_cropped.resize(size, Image.Resampling.LANCZOS)
        ico_images.append(ico_img)
    
    # Save as .ico
    ico_images[0].save(
        os.path.join(output_dir, "favicon.ico"),
        format='ICO',
        sizes=ico_sizes,
        append_images=ico_images[1:]
    )
    print("Created favicon.ico")
    
    print("\n✅ All favicon files created successfully!")
    print(f"📁 Location: {output_dir}")

if __name__ == "__main__":
    create_favicon()
