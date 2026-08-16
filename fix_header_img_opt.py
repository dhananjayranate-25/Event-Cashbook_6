import os
import glob

files = glob.glob("*.html") + glob.glob("*.js") + ["index.html.tmp"]

target = "logo/pdf_header_banner.png"
replace = "logo/pdf_header_banner_opt.jpg"

target2 = "pdf_header_banner.png"
replace2 = "pdf_header_banner_opt.jpg"

for f in files:
    if not os.path.isfile(f): continue
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            
        if target in content or target2 in content:
            content = content.replace(target, replace)
            content = content.replace(target2, replace2)
            with open(f, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f"Patched {f}")
    except Exception as e:
        pass

print("Done replacing header banner.")
