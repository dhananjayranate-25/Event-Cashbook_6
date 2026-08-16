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
    
    # Update the container gap and padding
    # Currently it is: gap:15px 2%; padding:0 10px;
    # Or gap:15px 5px; based on whatever is there.
    # Let's replace gap:15px 2%; with gap:15px 5px;
    content = content.replace("gap:15px 2%;", "gap:15px 5px;")
    
    # Update the item flex basis
    # Currently: flex: 0 0 23%; max-width: 25%;
    content = content.replace("flex: 0 0 23%; max-width: 25%; padding: 0 5px;", "flex: 0 1 140px; max-width: 150px; padding: 0 2px;")
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filename}")
