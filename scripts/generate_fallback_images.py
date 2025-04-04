#!/usr/bin/env python3
import os
from PIL import Image, ImageDraw, ImageFont
import random

# Constants
IMAGES_DIR = "client/public/images/parks"
NUM_FALLBACKS = 5
IMAGE_SIZE = (640, 480)

# Colors - earthy/natural tones for national parks
BACKGROUND_COLORS = [
    (76, 115, 61),    # Forest Green
    (142, 118, 75),   # Brown
    (108, 140, 167),  # Blue (water)
    (191, 168, 128),  # Tan/Sand
    (112, 66, 20)     # Dark Brown
]

def ensure_dir_exists(directory):
    """Ensure that the directory exists."""
    os.makedirs(directory, exist_ok=True)

def generate_fallback_image(index):
    """Generate a simple colored fallback image with index."""
    img_size = IMAGE_SIZE
    color = BACKGROUND_COLORS[index % len(BACKGROUND_COLORS)]
    
    # Create a new image with the selected color
    img = Image.new('RGB', img_size, color)
    draw = ImageDraw.Draw(img)
    
    # Add some visual interest with simple shapes
    for _ in range(20):
        shape_x = random.randint(0, img_size[0])
        shape_y = random.randint(0, img_size[1])
        shape_size = random.randint(10, 50)
        shape_color = tuple(max(0, min(255, c + random.randint(-30, 30))) for c in color)
        
        if random.choice([True, False]):
            # Draw circle
            draw.ellipse(
                (shape_x - shape_size/2, shape_y - shape_size/2, 
                 shape_x + shape_size/2, shape_y + shape_size/2), 
                fill=shape_color
            )
        else:
            # Draw rectangle
            draw.rectangle(
                (shape_x - shape_size/2, shape_y - shape_size/2, 
                 shape_x + shape_size/2, shape_y + shape_size/2), 
                fill=shape_color
            )
    
    # Add text indicating it's a fallback image
    text = f"Fallback Image {index + 1}"
    
    # Try to use a nice font, fall back to default if not available
    try:
        # This is a generic font that should be available on most systems
        font = ImageFont.truetype("DejaVuSans.ttf", 40)
    except:
        font = ImageFont.load_default()
    
    # Get text size
    text_bbox = draw.textbbox((0, 0), text, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    
    # Position text in center
    position = ((img_size[0] - text_width) // 2, (img_size[1] - text_height) // 2)
    
    # Draw with white text and black outline for visibility
    draw.text((position[0]-2, position[1]), text, font=font, fill=(0, 0, 0))
    draw.text((position[0]+2, position[1]), text, font=font, fill=(0, 0, 0))
    draw.text((position[0], position[1]-2), text, font=font, fill=(0, 0, 0))
    draw.text((position[0], position[1]+2), text, font=font, fill=(0, 0, 0))
    draw.text(position, text, font=font, fill=(255, 255, 255))
    
    return img

def main():
    # Create directory if it doesn't exist
    ensure_dir_exists(IMAGES_DIR)
    
    # Generate fallback images
    for i in range(NUM_FALLBACKS):
        img = generate_fallback_image(i)
        img_path = os.path.join(IMAGES_DIR, f"fallback{i+1}.jpg")
        img.save(img_path)
        print(f"Generated fallback image: {img_path}")

if __name__ == "__main__":
    main()