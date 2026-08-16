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

    # Reduce gap on flex container
    # Currently: gap:20px 10px;
    # Change to: gap:15px 10px;
    content = content.replace("gap:20px 10px;", "gap:15px 10px;")
    
    # Reduce margin-bottom on individual items
    # Currently: margin-bottom:18px;
    # Change to: margin-bottom:5px;
    content = content.replace("margin-bottom:18px;", "margin-bottom:5px;")
    
    # Check if there is any other large gap
    # margin-top:20px; on the committee container
    # margin-top:15px; on the page-footer
    # That is totally fine. The double gap was because of flex-gap + margin-bottom on each item.

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filename}")
