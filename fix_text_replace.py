import os

files_to_fix = [
    "index.html",
    "gallery_fixed.html",
    "gallery.html",
    "about.html",
    "user.html",
    "admin.html",
    "index.html.tmp"
]

for filename in files_to_fix:
    if not os.path.exists(filename):
        continue
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace the text
    content = content.replace("उत्सव कमिटी", "उत्सव कार्यकारिणी")
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filename}")
