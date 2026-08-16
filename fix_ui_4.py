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

    # Increase committee member font sizes
    # Old: font-size:15px; color:#1a1a2e;
    # New: font-size:18px; color:#1a1a2e;
    content = content.replace("font-size:15px; color:#1a1a2e;", "font-size:18px; color:#1a1a2e;")
    
    # Old: font-size:12px; font-weight:600; color:#b45309;
    # New: font-size:14px; font-weight:600; color:#b45309;
    content = content.replace("font-size:12px; font-weight:600; color:#b45309;", "font-size:14px; font-weight:600; color:#b45309;")
    
    # Move Developed By slightly upwards
    # The container has margin-top:40px;
    
    content = content.replace('<div class="page-footer" style=\\"margin-top:40px; padding-bottom:20px;\\">', '<div class="page-footer" style=\\"margin-top:15px; padding-bottom:20px;\\">')
    content = content.replace('<div class="page-footer" style="margin-top:40px; padding-bottom:20px;">', '<div class="page-footer" style="margin-top:15px; padding-bottom:20px;">')
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filename}")
