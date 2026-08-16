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
    
    # We change from flex: 0 1 auto; to flex: 0 0 160px;
    # This forces every single member block to be exactly 160 pixels wide.
    # Because all blocks are identically wide, their centers align perfectly, forming a clean grid!
    content = content.replace(
        '<div style="text-align:center; flex: 0 1 auto; max-width:145px; padding: 0 10px;">',
        '<div style="text-align:center; flex: 0 0 160px; max-width:160px; padding: 0 5px;">'
    )
    
    # Let's also adjust the spacing between name and designation slightly to make it look even better
    content = content.replace(
        '<div style="font-weight:700; font-size:15px; color:#1a1a2e; margin-bottom:1px;">',
        '<div style="font-weight:700; font-size:15px; color:#1a1a2e; margin-bottom:2px;">'
    )
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filename}")
