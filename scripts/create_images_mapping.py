#!/usr/bin/env python3
import json
import os

# Paths
PARKS_JSON_PATH = "server/data/parks.json"
IMAGE_MAPPING_PATH = "client/src/park_images.json"

# Default fallback images
FALLBACK_IMAGES = [
    "/images/parks/fallback1.jpg",
    "/images/parks/fallback2.jpg",
    "/images/parks/fallback3.jpg",
    "/images/parks/fallback4.jpg",
    "/images/parks/fallback5.jpg",
]

def get_fallback_image(park_id):
    """Get a deterministic fallback image based on park ID."""
    return FALLBACK_IMAGES[park_id % len(FALLBACK_IMAGES)]

def main():
    # Read parks data
    with open(PARKS_JSON_PATH, 'r', encoding='utf-8') as f:
        parks = json.load(f)
    
    # Create mapping from park ID to image URL
    image_mapping = {}
    for park in parks:
        park_id = park["id"]
        image_mapping[str(park_id)] = get_fallback_image(park_id)
    
    # Save mapping to JSON file
    with open(IMAGE_MAPPING_PATH, 'w', encoding='utf-8') as f:
        json.dump(image_mapping, f, indent=2)
    
    print(f"Created image mapping file at {IMAGE_MAPPING_PATH}")

if __name__ == "__main__":
    main()