import os
import sys
from pathlib import Path
import time

def should_skip_file(file_path, skip_patterns=None):
    """Check if a file should be skipped based on patterns."""
    if skip_patterns is None:
        skip_patterns = []
    
    # Common patterns to skip
    default_skip_patterns = [
        'node_modules',
        '.git',
        '.vscode',
        '.next',
        '.nuxt',
        '.idea',
        '__pycache__',
        'dist',
        'build',
        'coverage',
        '*.pyc',
        '*.pyo',
        '*.pyd',
        '.DS_Store',
        'Thumbs.db',
        '.env',
        '.env.local',
        '*.log',
        'package-lock.json',
        'yarn.lock',
        '.exe',
        '.dll',
        '.so',
        '.dylib',
        '.bin',
        '.wasm',
        '.ico',
        '.png',
        '.jpg',
        '.jpeg',
        '.gif',
        '.svg',
        '.woff',
        '.woff2',
        '.ttf',
        '.eot',
        '.map',
        '.min.js',
        '.min.css'
    ]
    
    all_patterns = default_skip_patterns + skip_patterns
    
    file_path_str = str(file_path).lower()
    
    # Check if file path contains any skip pattern
    for pattern in all_patterns:
        pattern_lower = pattern.lower()
        if pattern_lower.startswith('*.'):
            # Handle extension patterns
            if file_path_str.endswith(pattern_lower[1:]):
                return True
        elif pattern_lower in file_path_str:
            return True
    
    return False

def read_file_content(file_path):
    """Read file content with proper encoding handling."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except UnicodeDecodeError:
        try:
            with open(file_path, 'r', encoding='latin-1') as f:
                return f.read()
        except:
            return f"# ERROR: Could not read file {file_path} (binary or unsupported encoding)\n\n"
    except Exception as e:
        return f"# ERROR: Could not read file {file_path}: {str(e)}\n\n"

def get_file_info(file_path, root_path):
    """Get file information for the markdown."""
    try:
        rel_path = os.path.relpath(file_path, root_path)
        file_size = os.path.getsize(file_path)
        file_ext = os.path.splitext(file_path)[1]
        
        return {
            'path': rel_path,
            'full_path': file_path,
            'size': file_size,
            'extension': file_ext,
            'error': None
        }
    except Exception as e:
        return {
            'path': str(file_path),
            'full_path': file_path,
            'size': 0,
            'extension': '',
            'error': str(e)
        }

def create_safe_anchor(filename):
    """Create a safe anchor name for markdown links."""
    # Remove problematic characters and create anchor
    anchor = filename.replace('/', '').replace('\\', '').replace('.', '').replace('-', '').replace('_', '')
    # Remove non-alphanumeric characters
    anchor = ''.join(c for c in anchor if c.isalnum())
    return anchor.lower()

def create_combined_markdown(root_dir, output_file='COMPLETE_CODE_COLLECTION.md', skip_patterns=None):
    """
    Create a combined markdown file with all code from the directory.
    
    Args:
        root_dir: Root directory to scan
        output_file: Output markdown filename
        skip_patterns: Additional patterns to skip (list of strings)
    """
    root_path = Path(root_dir).resolve()
    output_path = Path(output_file).resolve()
    
    print(f"🔍 Scanning directory: {root_path}")
    print(f"💾 Output will be saved to: {output_path}")
    print(f"⏳ This may take a moment for large codebases...")
    print("-" * 60)
    
    # Collect all files
    all_files = []
    total_size = 0
    skipped_count = 0
    
    start_time = time.time()
    
    for current_dir, dirs, files in os.walk(root_path):
        current_dir_path = Path(current_dir)
        
        # Filter directories to skip
        dirs[:] = [d for d in dirs if not should_skip_file(current_dir_path / d, skip_patterns)]
        
        for file in files:
            file_path = current_dir_path / file
            
            if should_skip_file(file_path, skip_patterns):
                skipped_count += 1
                continue
            
            file_info = get_file_info(file_path, root_path)
            all_files.append(file_info)
            total_size += file_info['size']
    
    elapsed_time = time.time() - start_time
    
    print(f"✅ Found {len(all_files)} files to include")
    print(f"⏭️  Skipped {skipped_count} files/directories")
    print(f"📦 Total size: {total_size:,} bytes")
    print(f"⏱️  Scan time: {elapsed_time:.2f} seconds")
    print("-" * 60)
    
    if len(all_files) == 0:
        print("❌ No files found to include. Check your directory path.")
        return
    
    # Sort files by path for consistent output
    all_files.sort(key=lambda x: x['path'])
    
    # Write combined markdown
    try:
        with open(output_path, 'w', encoding='utf-8') as md_file:
            # Write header
            md_file.write("# Complete Code Collection\n\n")
            md_file.write(f"**Directory:** `{root_path}`\n")
            md_file.write(f"**Total Files:** {len(all_files)}\n")
            md_file.write(f"**Total Size:** {total_size:,} bytes\n")
            md_file.write(f"**Generated by:** `{Path(__file__).name}`\n")
            md_file.write(f"**Generated on:** {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
            md_file.write("\n---\n\n")
            
            # Write table of contents
            md_file.write("## 📋 Table of Contents\n\n")
            for i, file_info in enumerate(all_files, 1):
                anchor = create_safe_anchor(file_info['path'])
                md_file.write(f"{i}. [{file_info['path']}](#{anchor})\n")
            md_file.write("\n---\n\n")
            
            # Write each file's content
            processed_count = 0
            for i, file_info in enumerate(all_files, 1):
                processed_count += 1
                print(f"📄 Processing ({i}/{len(all_files)}): {file_info['path']}")
                
                anchor = create_safe_anchor(file_info['path'])
                md_file.write(f'<a id="{anchor}"></a>\n')
                md_file.write(f"## 📄 File {i}: {file_info['path']}\n\n")
                md_file.write(f"**Path:** `{file_info['path']}`\n")
                md_file.write(f"**Size:** {file_info['size']:,} bytes\n")
                md_file.write(f"**Extension:** `{file_info['extension']}`\n")
                
                if file_info.get('error'):
                    md_file.write(f"**Error:** {file_info['error']}\n")
                
                md_file.write("\n")
                md_file.write("```")
                
                # Add language identifier for syntax highlighting
                ext_to_lang = {
                    '.py': 'python',
                    '.js': 'javascript',
                    '.jsx': 'jsx',
                    '.ts': 'typescript',
                    '.tsx': 'tsx',
                    '.html': 'html',
                    '.htm': 'html',
                    '.css': 'css',
                    '.scss': 'scss',
                    '.sass': 'sass',
                    '.less': 'less',
                    '.json': 'json',
                    '.md': 'markdown',
                    '.txt': 'text',
                    '.yml': 'yaml',
                    '.yaml': 'yaml',
                    '.xml': 'xml',
                    '.sql': 'sql',
                    '.sh': 'bash',
                    '.bat': 'batch',
                    '.ps1': 'powershell',
                    '.java': 'java',
                    '.c': 'c',
                    '.cpp': 'cpp',
                    '.h': 'cpp',
                    '.hpp': 'cpp',
                    '.cs': 'csharp',
                    '.go': 'go',
                    '.rs': 'rust',
                    '.rb': 'ruby',
                    '.php': 'php',
                    '.swift': 'swift',
                    '.kt': 'kotlin',
                    '.dart': 'dart',
                    '.lua': 'lua',
                    '.r': 'r',
                    '.m': 'matlab',
                    '.tex': 'latex',
                    '.vue': 'vue',
                    '.svelte': 'svelte',
                    '.astro': 'astro',
                    '.conf': 'ini',
                    '.ini': 'ini',
                    '.toml': 'toml',
                    '.lock': 'json',
                    '.config': 'json',
                    '.rc': 'json',
                }
                
                lang = ext_to_lang.get(file_info['extension'].lower(), '')
                if lang:
                    md_file.write(lang + "\n")
                else:
                    md_file.write("\n")
                
                # Read and write file content
                content = read_file_content(file_info['full_path'])
                md_file.write(content)
                
                # Close code block
                if not content.endswith('\n'):
                    md_file.write('\n')
                md_file.write("```\n\n")
                md_file.write("[↑ Back to TOC](#-table-of-contents)\n")
                md_file.write("\n---\n\n")
        
        print(f"\n✅ Successfully created combined markdown: {output_path}")
        print(f"📊 Total files included: {len(all_files)}")
        
        # Create a summary file
        summary_path = output_path.with_name(output_path.stem + "_SUMMARY.md")
        with open(summary_path, 'w', encoding='utf-8') as summary_file:
            summary_file.write("# 📊 Code Collection Summary\n\n")
            summary_file.write(f"**Root Directory:** `{root_path}`\n")
            summary_file.write(f"**Output File:** `{output_path.name}`\n")
            summary_file.write(f"**Total Files:** {len(all_files)}\n")
            summary_file.write(f"**Total Size:** {total_size:,} bytes\n")
            summary_file.write(f"**Generated on:** {time.strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            
            summary_file.write("## 📁 File Types Summary\n\n")
            
            # Count by extension
            ext_counts = {}
            for file_info in all_files:
                ext = file_info['extension'].lower() or '[no extension]'
                ext_counts[ext] = ext_counts.get(ext, 0) + 1
            
            summary_file.write("| Extension | Count | Percentage |\n")
            summary_file.write("|-----------|-------|------------|\n")
            for ext, count in sorted(ext_counts.items(), key=lambda x: x[1], reverse=True):
                percentage = (count / len(all_files)) * 100
                summary_file.write(f"| `{ext}` | {count} | {percentage:.1f}% |\n")
            
            summary_file.write("\n## 📈 Top 10 Largest Files\n\n")
            
            # Get top 10 largest files
            largest_files = sorted(all_files, key=lambda x: x['size'], reverse=True)[:10]
            
            summary_file.write("| Rank | File | Size |\n")
            summary_file.write("|------|------|------|\n")
            for i, file_info in enumerate(largest_files, 1):
                size_kb = file_info['size'] / 1024
                if size_kb > 1024:
                    size_mb = size_kb / 1024
                    size_str = f"{size_mb:.1f} MB"
                else:
                    size_str = f"{size_kb:.1f} KB"
                summary_file.write(f"| {i} | `{file_info['path']}` | {size_str} |\n")
        
        print(f"📈 Summary created: {summary_path}")
        print(f"📁 Output file size: {os.path.getsize(output_path):,} bytes")
        
    except Exception as e:
        print(f"❌ Error writing markdown file: {str(e)}")
        import traceback
        traceback.print_exc()

def main():
    """Main function to handle command line arguments."""
    print("=" * 60)
    print("📦 Code Collection Tool")
    print("=" * 60)
    
    # If no arguments provided, use current directory
    if len(sys.argv) < 2:
        root_dir = "."
        output_file = "COMPLETE_CODE_COLLECTION.md"
        print(f"⚠️  No directory specified, using current directory: {Path('.').resolve()}")
        print(f"📝 Output file: {output_file}")
        print("-" * 60)
        
        response = input("Proceed? (Y/n): ").strip().lower()
        if response and response != 'y':
            print("Operation cancelled.")
            return
    else:
        root_dir = sys.argv[1]
        output_file = sys.argv[2] if len(sys.argv) > 2 else "COMPLETE_CODE_COLLECTION.md"
    
    # Additional skip patterns (optional)
    additional_skip_patterns = [
        # Add your custom skip patterns here
        # 'temp',
        # 'test_data',
    ]
    
    if not os.path.exists(root_dir):
        print(f"❌ Error: Directory '{root_dir}' does not exist!")
        print(f"Current working directory: {os.getcwd()}")
        return
    
    try:
        create_combined_markdown(root_dir, output_file, additional_skip_patterns)
    except KeyboardInterrupt:
        print("\n\n⚠️  Operation cancelled by user.")
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()