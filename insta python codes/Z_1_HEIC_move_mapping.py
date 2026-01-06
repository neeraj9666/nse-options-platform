import os
import shutil
import logging

# Define source and destination folders
source_folder = r"D:\INSTA"
destination_folder = r"D:\INSTA\_heic_"

# Set up logging
log_file = 'heic_copy_log.txt'
logging.basicConfig(filename=log_file, level=logging.INFO, format='%(asctime)s - %(message)s')

# Create destination folder if it doesn't exist
os.makedirs(destination_folder, exist_ok=True)

# Walk through the source folder and subfolders
for root, dirs, files in os.walk(source_folder):
    for file in files:
        if file.lower().endswith('.heic'):
            source_path = os.path.join(root, file)
            dest_path = os.path.join(destination_folder, file)
            
            # Check if file already exists at destination
            if os.path.exists(dest_path):
                print(f"Skipping (already exists): {dest_path}")
                continue
            
            try:
                shutil.copy2(source_path, dest_path)
                #shutil.move(source_path, dest_path)
                print(f"Copied: {source_path} -> {dest_path}")
                # Log the paths
                logging.info(f"Copied: {source_path} -> {dest_path}")
            except Exception as e:
                print(f"Error copying {source_path}: {e}")
                logging.error(f"Error copying {source_path}: {e}")