import os
import concurrent.futures
from PIL import Image

TARGET_DIR = r'D:\INSTA\hottest_actress_divas'
MIN_DIM = 400

def get_all_image_paths():
    paths = []
    names_with_jpg = set()
    
    # Pass 1: Quick index to find all JPGs for duplicate matching
    for root, _, files in os.walk(TARGET_DIR):
        for f in files:
            ext = f.lower()
            full_path = os.path.join(root, f)
            if ext.endswith(('.jpg', '.jpeg')):
                # Store the base name (path + filename without extension)
                names_with_jpg.add(os.path.splitext(full_path)[0].lower())
            
            if ext.endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif', '.heic')):
                paths.append(full_path)
    return paths, names_with_jpg

def fast_process(file_path, jpg_names_set):
    try:
        # 1. Fast Duplicate Match (No file opening)
        base_no_ext = os.path.splitext(file_path)[0].lower()
        if file_path.lower().endswith('.heic') and base_no_ext in jpg_names_set:
            os.remove(file_path)
            return "REMOVED_DUPLICATE"

        # 2. Resolution Check
        if os.path.exists(file_path):
            with Image.open(file_path) as img:
                w, h = img.size
            if w < MIN_DIM or h < MIN_DIM:
                os.remove(file_path)
                return "DELETED_LOW_RES"
                
    except Exception:
        return "ERROR"
    return "SKIPPED" # Return a string instead of None to prevent TypeErrors

if __name__ == "__main__":
    print("Indexing folder...")
    all_paths, jpg_set = get_all_image_paths()
    
    print(f"Processing {len(all_paths)} images...")
    
    # ProcessPoolExecutor manages cores automatically
    with concurrent.futures.ProcessPoolExecutor() as executor:
        # Pass the set to every worker
        results = list(executor.map(fast_process, all_paths, [jpg_set]*len(all_paths)))

    # Safe summary calculation
    removals = results.count("REMOVED_DUPLICATE")
    low_res = results.count("DELETED_LOW_RES")
    errors = results.count("ERROR")

    print(f"\n--- Task Complete ---")
    print(f"Duplicate HEICs removed: {removals}")
    print(f"Low-res images deleted:  {low_res}")
    print(f"Errors encountered:      {errors}")
