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
    
    # Decrease Name font size
    content = content.replace(
        '<div style="font-weight:700; font-size:20px; color:#1a1a2e; margin-bottom:3px;">',
        '<div style="font-weight:700; font-size:15px; color:#1a1a2e; margin-bottom:3px;">'
    )
    
    # Decrease Post font size
    content = content.replace(
        '<div style="font-weight:600; font-size:15px; color:#5a2010;">',
        '<div style="font-weight:600; font-size:12px; color:#5a2010;">'
    )
    
    # Center alignment is already there on the flex parent and the flex items.
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filename}")
