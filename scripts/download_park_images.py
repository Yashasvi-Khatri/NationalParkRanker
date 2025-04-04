#!/usr/bin/env python3
import json
import os
import requests
import time
from PIL import Image
from io import BytesIO
import random
import sys
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Paths
PARKS_JSON_PATH = "server/data/parks.json"
IMAGE_OUTPUT_DIR = "client/public/images/parks"
UPDATED_PARKS_JSON_PATH = "server/data/parks_updated.json"

# Fallback images (high-quality, freely usable nature images)
FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1544979590-37e9b47eb705?w=800&h=600&fit=crop",  # Tiger
    "https://images.unsplash.com/photo-1503656142023-618e7d1f435a?w=800&h=600&fit=crop",  # Forest
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop",  # Nature
    "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&h=600&fit=crop",  # Mountains
    "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&h=600&fit=crop",  # Wildlife
]

def ensure_dir_exists(directory):
    """Ensure that the directory exists."""
    os.makedirs(directory, exist_ok=True)

def get_fallback_image(park_id):
    """Get a deterministic fallback image based on park ID."""
    return FALLBACK_IMAGES[park_id % len(FALLBACK_IMAGES)]

def download_image(url, park_id, park_name):
    """Download an image and save it to the output directory."""
    try:
        # Add User-Agent header to avoid being blocked
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        # Try to download the image with a timeout
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()  # Raise an exception for 4XX/5XX responses
        
        # Process and save the image
        img = Image.open(BytesIO(response.content))
        
        # Create a filename based on park ID and name
        safe_name = "".join(c if c.isalnum() else "_" for c in park_name)
        filename = f"{park_id}_{safe_name}.jpg"
        output_path = os.path.join(IMAGE_OUTPUT_DIR, filename)
        
        # Convert to RGB if needed (in case of PNG with transparency)
        if img.mode in ('RGBA', 'LA'):
            background = Image.new("RGB", img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[3])  # 3 is the alpha channel
            img = background
        
        # Resize to a reasonable size if too large
        max_size = (800, 600)
        img.thumbnail(max_size, Image.LANCZOS)
        
        # Save the image
        img.save(output_path, "JPEG", quality=85)
        logger.info(f"Downloaded image for park {park_id}: {park_name}")
        
        # Return the relative path to be used in the app
        return f"/images/parks/{filename}"
    
    except Exception as e:
        logger.error(f"Error downloading image for park {park_id}: {e}")
        
        # Try to use a fallback image from Unsplash
        try:
            fallback_url = get_fallback_image(park_id)
            response = requests.get(fallback_url, timeout=10)
            response.raise_for_status()
            
            img = Image.open(BytesIO(response.content))
            
            # Create a filename for the fallback
            safe_name = "".join(c if c.isalnum() else "_" for c in park_name)
            filename = f"{park_id}_{safe_name}_fallback.jpg"
            output_path = os.path.join(IMAGE_OUTPUT_DIR, filename)
            
            img.save(output_path, "JPEG", quality=85)
            logger.info(f"Used fallback image for park {park_id}: {park_name}")
            
            return f"/images/parks/{filename}"
        
        except Exception as fallback_error:
            logger.error(f"Error using fallback image for park {park_id}: {fallback_error}")
            return None

def main():
    # Ensure output directory exists
    ensure_dir_exists(IMAGE_OUTPUT_DIR)
    
    # Read parks data
    try:
        with open(PARKS_JSON_PATH, 'r', encoding='utf-8') as f:
            parks = json.load(f)
    except Exception as e:
        logger.error(f"Error reading parks data: {e}")
        sys.exit(1)
    
    # Check if we have progress already
    try:
        if os.path.exists(UPDATED_PARKS_JSON_PATH):
            with open(UPDATED_PARKS_JSON_PATH, 'r', encoding='utf-8') as f:
                parks = json.load(f)
            logger.info(f"Loaded existing progress from {UPDATED_PARKS_JSON_PATH}")
    except Exception as e:
        logger.error(f"Error loading existing progress: {e}")
    
    # Count parks that need processing (don't have a local path)
    parks_to_process = [p for p in parks if not p.get("imageUrl", "").startswith("/images/parks/")]
    total_parks = len(parks)
    
    logger.info(f"Processing {len(parks_to_process)} of {total_parks} parks that need images...")
    
    # Process each park in batches of 20
    batch_size = 20
    successful_downloads = 0
    
    for i in range(0, len(parks_to_process), batch_size):
        batch = parks_to_process[i:i+batch_size]
        logger.info(f"Processing batch {i//batch_size + 1} of {(len(parks_to_process) - 1) // batch_size + 1}...")
        
        for park in batch:
            park_id = park["id"]
            park_name = park["name"]
            image_url = park["imageUrl"]
            
            logger.info(f"Processing park {park_id}: {park_name}")
            
            # Download image
            local_image_path = download_image(image_url, park_id, park_name)
            
            if local_image_path:
                # Update the park's image URL to use the local file
                # Find the park in the original list and update it
                for orig_park in parks:
                    if orig_park["id"] == park_id:
                        orig_park["imageUrl"] = local_image_path
                        break
                
                successful_downloads += 1
            
            # Sleep briefly to avoid hitting rate limits
            time.sleep(0.5)
        
        # Save progress after each batch
        try:
            with open(UPDATED_PARKS_JSON_PATH, 'w', encoding='utf-8') as f:
                json.dump(parks, f, indent=2)
            logger.info(f"Progress saved after batch {i//batch_size + 1}")
        except Exception as e:
            logger.error(f"Error saving progress: {e}")
    
    # Final save of the updated parks data
    try:
        with open(UPDATED_PARKS_JSON_PATH, 'w', encoding='utf-8') as f:
            json.dump(parks, f, indent=2)
        logger.info(f"Updated parks data saved to {UPDATED_PARKS_JSON_PATH}")
        
        # Also update the original parks.json file as a backup
        with open(PARKS_JSON_PATH, 'w', encoding='utf-8') as f:
            json.dump(parks, f, indent=2)
        logger.info(f"Original parks data updated as well")
    except Exception as e:
        logger.error(f"Error saving final data: {e}")
        sys.exit(1)
    
    logger.info(f"Download complete! Successfully processed {successful_downloads} of {len(parks_to_process)} images.")

if __name__ == "__main__":
    main()