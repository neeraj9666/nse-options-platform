# === HEIC → JPEG deduplication and replacement ===
# If a matching JPEG is found in 'New folder':
#   → If destination already has JPEG, delete the leftover JPEG.
#   → Else, delete the HEIC and move the new JPEG to its place.

import os
import shutil
from concurrent.futures import ThreadPoolExecutor, as_completed

# === CONFIG ===
heic_root = r"G:\INSTA\INSTA\_______ALL MIXED DOWNLOADS"
new_folder = r"G:\INSTA\INSTA\_______ALL MIXED DOWNLOADS\New folder"
MAX_WORKERS = os.cpu_count() * 2

def delete_if_duplicate(jpeg_paths):
    """
    If a JPEG (.jpg or .jpeg) with the same base name exists in both
    `heic_root` and `new_folder`, delete the one in `new_folder`.
    """
    exts = ['.jpg', '.jpeg']
    for j in jpeg_paths:
        for ext in exts:
            main_jpeg = os.path.join(heic_root, j + ext)
            new_jpeg = os.path.join(new_folder, j + ext)

            if os.path.exists(main_jpeg) and os.path.exists(new_jpeg):
                try:
                    os.remove(new_jpeg)
                    print(f"🧹 Deleted duplicate from new folder: {new_jpeg}")
                except Exception as e:
                    print(f"⚠️ Error deleting {new_jpeg}: {e}")
                break  # Stop checking once one match is handled


def build_jpeg_index(base_folder):
    """Index all JPEGs under new_folder by base name (non-recursive)."""
    jpeg_index = {}
    for root, _, files in os.walk(base_folder):
        for f in files:
            if f.lower().endswith((".jpg", ".jpeg")):
                name = os.path.splitext(f)[0].lower()
                jpeg_index[name] = os.path.join(root, f)
    return jpeg_index


def process_heic(heic_path, jpeg_index):
    """Replace HEIC with JPEG if found, else delete leftover JPEG if already moved."""
    try:
        base_name = os.path.splitext(os.path.basename(heic_path))[0].lower()
        jpeg_src = jpeg_index.get(base_name)
        target_jpeg_path = os.path.splitext(heic_path)[0] + ".jpg"

        if not jpeg_src:
            return f"🚫 No match for: {heic_path}"

        # Case 1: JPEG already exists at destination → delete leftover JPEG in new folder
        if os.path.exists(target_jpeg_path):
            os.remove(jpeg_src)
            return f"🧹 Already replaced earlier → deleted leftover JPEG: {jpeg_src}"

        # Case 2: Replace HEIC with JPEG
        os.remove(heic_path)
        shutil.move(jpeg_src, target_jpeg_path)
        return f"✅ Replaced HEIC with JPEG: {os.path.basename(heic_path)}"

    except Exception as e:
        return f"⚠️ Error processing {heic_path}: {e}"


def main():
    print("🔍 Indexing JPEGs from 'New folder'...")
    jpeg_index = build_jpeg_index(new_folder)
    delete_if_duplicate(jpeg_index)
    
    jpeg_index = build_jpeg_index(new_folder)
    print(f"📂 Indexed {len(jpeg_index)} JPEGs")

    heic_files = []
    for root, _, files in os.walk(heic_root):
        for f in files:
            if f.lower().endswith(".heic"):
                heic_files.append(os.path.join(root, f))

    print(f"🧩 Found {len(heic_files)} HEIC files to process")

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = [executor.submit(process_heic, path, jpeg_index) for path in heic_files]
        for f in as_completed(futures):
            print(f.result())

    print("✅ All HEICs processed and duplicates cleaned.")


if __name__ == "__main__":
    main()
