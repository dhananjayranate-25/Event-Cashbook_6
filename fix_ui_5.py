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

    # Name font size: 18px -> 21px
    content = content.replace("font-size:18px; color:#1a1a2e;", "font-size:21px; color:#1a1a2e;")
    
    # Post font size: 14px -> 16px
    content = content.replace("font-size:14px; font-weight:600; color:#b45309;", "font-size:16px; font-weight:600; color:#b45309;")
    
    # Increase gap between rows: margin-bottom:8px -> margin-bottom:15px
    content = content.replace("max-width:160px; margin-bottom:8px;", "max-width:160px; margin-bottom:15px;")
    
    # Also adjust default president/treasurer blocks just in case they're used
    content = content.replace('font-size:16px; color:#1a1a2e;">तेजस', 'font-size:21px; color:#1a1a2e;">तेजस')
    content = content.replace('font-size:16px; color:#1a1a2e;">धनंजय', 'font-size:21px; color:#1a1a2e;">धनंजय')
    content = content.replace('font-weight:800; font-size:15px; color:#5a2010;', 'font-weight:800; font-size:16px; color:#5a2010;')

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filename}")

