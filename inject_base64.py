import os

with open('base64.txt', 'r', encoding='utf-8') as f:
    b64 = f.read()

index_file = 'index.html'
with open(index_file, 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('src="logo/pdf_header_banner_opt.jpg?v=2"', f'src="{b64}"')
html = html.replace('<link rel="preload" as="image" href="logo/pdf_header_banner_opt.jpg">', '')

with open(index_file, 'w', encoding='utf-8') as f:
    f.write(html)

print("Injected Base64 image into index.html")
