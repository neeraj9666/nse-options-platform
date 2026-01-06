import os
from PIL import Image
from pathlib import Path

def convert_webp_to_jpeg_in_place_and_delete(root_directory_path: str, quality: int = 95):
    """
    Recursively finds all .webp files, converts them to .jpg in the same folder,
    and DELETES the original .webp file upon successful conversion.

    Args:
        root_directory_path (str): The starting folder to search.
        quality (int): JPEG quality from 1 (worst) to 100 (best). Default is 95.
    """
    root_directory = Path(root_directory_path)
    
    if not root_directory.is_dir():
        print(f"❌ Error: Root directory not found at {root_directory_path}")
        return

    print(f"--- Starting recursive WebP conversion with DELETION in: {root_directory.resolve()} ---")
    print("!!! WARNING: Original WebP files will be PERMANENTLY DELETED upon successful conversion. !!!")
    
    files_processed = 0
    
    # Use rglob('*.webp') to find all .webp files recursively
    for input_path in root_directory.rglob('*.webp'):
        
        output_directory = input_path.parent
        output_filename = input_path.stem + ".jpg"
        output_path = output_directory / output_filename

        try:
            # 1. Open the image
            img = Image.open(input_path)
            
            # 2. Handle Alpha Channel (Convert RGBA to RGB)
            if img.mode in ('RGBA', 'P') and 'A' in img.getbands():
                rgb_img = img.convert('RGB')
            else:
                rgb_img = img
            
            # 3. Save as JPEG in the same location
            rgb_img.save(output_path, 'jpeg', quality=quality)
            
            # --- DELETION LOGIC ---
            
            # 4. Check if the new JPG file exists and is not zero size
            if output_path.exists() and output_path.stat().st_size > 0:
                os.remove(input_path)
                print(f"✅ Success: Converted '{input_path.name}' \n to '{output_path.name}' AND DELETED original.")
                files_processed += 1
            else:
                print(f"⚠️ Failed to verify or save '{output_path.name}'. Original file kept.")
            
        except Exception as e:
            print(f"❌ Failed to process {input_path.name}. Original file kept. Reason: {e}")

    print(f"--- Conversion and Deletion finished. Total files processed: {files_processed} ---")
# =========================================================================
# === EXAMPLE USAGE SECTION ===
# =========================================================================

# NOTE: Replace the path below with your main directory path (e.g., C:\Users\YourName\Pictures).
# If you are running this from your current PS directory, use a relative path like '.'
#
# EXAMPLE: Convert all WebP files in the current folder and its subfolders:
# convert_webp_to_jpeg_in_place(".") 

# EXAMPLE: Convert files in a specific directory:
TEST_FOLDER = r"D:\INSTA" #D:\INSTA\pin2"
convert_webp_to_jpeg_in_place_and_delete(TEST_FOLDER)
# Define the folder for testing


# 1. Run the setup to create dummy files (comment this out if you use real files)
# create_dummy_files(TEST_FOLDER)

# 2. Example of converting a whole directory
# NOTE: Replace 'TEST_FOLDER' with the actual path to your image directory.
# The converted JPGs will be saved in 'images_to_convert/converted_jpegs'
# convert_directory_to_jpeg(TEST_FOLDER, output_dir_name="output_jpgs")

# 3. Example of converting a single file (assuming you have a real file named 'test.heic')
# NOTE: You would replace the path with your specific file path.
# convert_to_jpeg("path/to/my/test.heic", output_dir="finished_photos")