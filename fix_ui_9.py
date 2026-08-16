import os
import re

files_to_fix = [
    "gallery_fixed_script.js",
    "gallery_script.js",
    "index.html",
    "temp.js",
    "test_script_1.js",
    "index.html.tmp"
]

for filename in files_to_fix:
    if not os.path.exists(filename):
        continue
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Change flex item to be more compact
    # Currently: flex: 0 0 190px;
    # Change to: flex: 0 1 auto; max-width: 180px; padding: 0 5px;
    content = content.replace("flex: 0 0 190px;", "flex: 0 1 auto; max-width: 185px; padding: 0 8px;")
    
    # Adjust gap
    content = content.replace("gap:15px 15px;", "gap:15px 5px;")
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filename}")
