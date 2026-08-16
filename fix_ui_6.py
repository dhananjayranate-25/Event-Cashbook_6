import os

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

    # Name font size: 21px -> 26px
    content = content.replace("font-size:21px; color:#1a1a2e;", "font-size:26px; color:#1a1a2e;")
    
    # Post font size: 16px -> 20px
    content = content.replace("font-size:16px; font-weight:600; color:#b45309;", "font-size:20px; font-weight:600; color:#b45309;")
    
    # Layout sizes
    content = content.replace("min-width:110px; max-width:160px; margin-bottom:15px;", "min-width:140px; max-width:220px; margin-bottom:18px;")
    
    # Fallback block font sizes
    content = content.replace('font-size:16px; color:#5a2010;', 'font-size:20px; color:#5a2010;')

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filename}")

