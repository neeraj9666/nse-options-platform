import os

# Configuration
TARGET_DIR = r"D:\options-platform2"
OUTPUT_FILE = "collected_code.md"  # Change to .txt if preferred
EXCLUDE_DIRS = {'node_modules', '.git', 'dist', 'build', '__pycache__'}
# Add extensions you want to include
EXTENSIONS = {'.py', '.js', '.ts', '.tsx', '.css', '.html', '.json'}

def collect_code():
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as outfile:
        outfile.write(f"# Code Collection for {os.path.basename(TARGET_DIR)}\n\n")
        
        for root, dirs, files in os.walk(TARGET_DIR):
            # Prune excluded directories in-place to stop os.walk from entering them
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
            
            for file in files:
                ext = os.path.splitext(file)[1].lower()
                if ext in EXTENSIONS:
                    file_path = os.path.join(root, file)
                    relative_path = os.path.relpath(file_path, TARGET_DIR)
                    
                    try:
                        with open(file_path, 'r', encoding='utf-8') as infile:
                            content = infile.read()
                            
                        # Formatting for Markdown
                        outfile.write(f"## File: {relative_path}\n")
                        outfile.write(f"```{ext.strip('.')}\n")
                        outfile.write(content)
                        outfile.write("\n```\n\n")
                        print(f"Collected: {relative_path}")
                        
                    except Exception as e:
                        print(f"Skipped {relative_path}: {e}")

if __name__ == "__main__":
    collect_code()
    print(f"\nDone! All code saved to {OUTPUT_FILE}")
