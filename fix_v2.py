import glob
import os

files = glob.glob("*.html") + glob.glob("*.js")

target = "logo/pdf_header_banner_opt.jpg?v=2"
replace = "logo/pdf_header_banner_opt.jpg"

for f in files:
    if not os.path.isfile(f): continue
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            
        if target in content:
            content = content.replace(target, replace)
            with open(f, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f"Patched {f}")
    except Exception as e:
        pass

print("Done replacing ?v=2")
