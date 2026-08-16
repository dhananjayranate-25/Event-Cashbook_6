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

    # Increase font size and margin of summary-title
    content = content.replace(".summary-title{font-size:11px;", ".summary-title{font-size:16px;margin-top:15px;")

    # Add yellow line above footer and adjust gap
    
    # Target (escaped)
    old_footer_escaped = '<div class="page-footer" style=\\"margin-top:40px; padding-bottom:20px;\\">'
    new_footer_escaped = '<div style=\\"height:1.5px;background:linear-gradient(90deg,#ff8c00,#ffd700,#ff8c00);margin:40px 0 15px 0;border-radius:2px;\\"></div><div class="page-footer" style=\\"padding-bottom:20px;\\">'
    content = content.replace(old_footer_escaped, new_footer_escaped)
    
    # Target (unescaped)
    old_footer_unescaped = '<div class="page-footer" style="margin-top:40px; padding-bottom:20px;">'
    new_footer_unescaped = '<div style="height:1.5px;background:linear-gradient(90deg,#ff8c00,#ffd700,#ff8c00);margin:40px 0 15px 0;border-radius:2px;"></div><div class="page-footer" style="padding-bottom:20px;">'
    content = content.replace(old_footer_unescaped, new_footer_unescaped)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filename}")
