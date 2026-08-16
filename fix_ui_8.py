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

    # The current line looks like:
    # committeeHtml += '<div style="text-align:center; flex: 1 1 calc(25% - 12px); min-width:140px; max-width:220px; margin-bottom:5px;">' +
    
    # We replace the flex rules with fixed width so they don't stretch apart
    content = content.replace("flex: 1 1 calc(25% - 12px); min-width:140px; max-width:220px;", "flex: 0 0 190px;")
    
    # Also let's adjust the container gap. It's currently gap:15px 10px;
    # Let's make it gap:15px 15px; to give it a neat horizontal grid spacing
    content = content.replace("gap:15px 10px;", "gap:15px 15px;")
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filename}")
