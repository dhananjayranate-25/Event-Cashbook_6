import glob
import os
import re

# 1. Update style.css
css_file = 'style.css'
with open(css_file, 'r', encoding='utf-8') as f:
    css = f.read()

# Replace the last .top-banner-img block for mobile
old_css = """        width: calc(100% - 12px) !important;
        height: auto !important;
        max-height: 180px !important;
        min-height: 80px !important;
        object-fit: contain !important;"""

new_css = """        width: calc(100% - 12px) !important;
        height: auto !important;
        aspect-ratio: 16 / 5 !important;
        object-fit: cover !important;
        background-color: #1a0b2e !important;
        background-image: linear-gradient(90deg, #1a0b2e, #3d1c5d, #1a0b2e) !important;
        background-size: 200% 100% !important;
        animation: shimmerHeader 2s infinite linear !important;"""

if old_css in css:
    css = css.replace(old_css, new_css)
    if "shimmerHeader" not in css:
        css += """
@keyframes shimmerHeader {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}
"""
    with open(css_file, 'w', encoding='utf-8') as f:
        f.write(css)
    print("Updated style.css")

# 2. Add decoding="sync" to html files
html_files = glob.glob("*.html")
for f in html_files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if 'mobileTopHeaderImg' in content:
        content = re.sub(r'(<img id="mobileTopHeaderImg"[^>]*?)>', r'\1 decoding="sync">', content)
        content = content.replace('decoding="sync" decoding="sync">', 'decoding="sync">')
        content = re.sub(r'(<img id="desktopTopHeaderImg"[^>]*?)>', r'\1 decoding="sync">', content)
        content = content.replace('decoding="sync" decoding="sync">', 'decoding="sync">')
        
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Patched {f} with decoding=sync")

print("Done fixing header styles")
