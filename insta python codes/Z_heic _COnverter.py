import os
import pyheif
from PIL import Image

source_folder = r"D:\INSTA"

for root, dirs, files in os.walk(source_folder):
    for file in files:
        if file.lower().endswith('.heic'):
            heic_path = os.path.join(root, file)
            try:
                # Read HEIC file
                heif_file = pyheif.read(heic_path)
                # Convert to PIL Image
                image = Image.frombytes(
                    heif_file.mode,
                    heif_file.size,
                    heif_file.data,
                    "raw",
                    heif_file.mode,
                    heif_file.stride,
                )
                # Save as JPG in same folder
                jpg_path = os.path.splitext(heic_path)[0] + '.jpg'
                image.save(jpg_path, "JPEG")
                # Remove the original HEIC file
                os.remove(heic_path)
                print(f"Converted and deleted: {heic_path}")
                input()
            except Exception as e:
                print(f"Failed to convert {heic_path}: {e}")

print("Conversion completed.")