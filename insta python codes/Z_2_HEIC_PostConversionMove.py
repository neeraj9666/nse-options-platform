import os, shutil

log_file = 'heic_copy_log.txt'
converted_folder = r'D:\INSTA\_HEIC_Converted'

def process_files():
    with open(log_file, 'r') as f:
        for line in f:
            if 'Copied:' not in line: continue
            src, dst = [x.strip() for x in line.split("Copied:")[1].split("->")]
            original_jpg = src.replace(".heic", ".JPG")
            converted_jpg = dst.replace(".heic", ".JPG").replace("_heic_", "_HEIC_Converted")
            delete_heic_file = src
            print(src)
            #input()
            #print("FROM:", converted_jpg)
            #print("TO  :", original_jpg)
            if os.path.exists(original_jpg) and os.path.exists(delete_heic_file):
                os.remove(delete_heic_file)
                print("REMOEVD _HEIC FILE\n") 
            if not os.path.exists(converted_jpg):
                print("Missing converted JPG:", converted_jpg)
                continue
            os.makedirs(os.path.dirname(original_jpg), exist_ok=True)
            shutil.move(converted_jpg, original_jpg)
            if os.path.exists(dst):
                os.remove(dst)
                
            print("Moved OK\n")
            #input()

process_files()
