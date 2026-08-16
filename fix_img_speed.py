import os

index_file = "index.html"
with open(index_file, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update the preload URL
old_preload_url = "https://res.cloudinary.com/vu0ccgsm/image/upload/v1784816361/shivsrushti_boyz_migration/vna1qxssl6nw7asg9nc4.jpg"
new_preload_url = "https://res.cloudinary.com/vu0ccgsm/image/upload/w_800,f_auto,q_auto/v1784816361/shivsrushti_boyz_migration/vna1qxssl6nw7asg9nc4.jpg"
content = content.replace(old_preload_url, new_preload_url)

# 2. Update desktop and mobile top headers: remove decoding="async" and add loading="eager"
content = content.replace('decoding="async"', 'loading="eager"')

# 3. Update the aboutGanpatiPhoto tag
old_ganpati_tag = 'id="aboutGanpatiPhoto" src="' + new_preload_url + '" alt="गणपती बाप्पा" style="'
new_ganpati_tag = 'id="aboutGanpatiPhoto" fetchpriority="high" loading="eager" src="' + new_preload_url + '" alt="गणपती बाप्पा" style="'
content = content.replace(old_ganpati_tag, new_ganpati_tag)

# Let's also do a more robust replace for the aboutGanpatiPhoto
import re
content = re.sub(
    r'<img\s+id="aboutGanpatiPhoto"\s+src="https://res\.cloudinary\.com[^"]+"\s+alt="गणपती बाप्पा"\s+style="([^"]+)"\s+onerror="[^"]+">',
    r'<img id="aboutGanpatiPhoto" fetchpriority="high" loading="eager" src="' + new_preload_url + r'" alt="गणपती बाप्पा" style="\1" onerror="this.onerror=null; this.src=\'logo/logo.jpeg\';">',
    content
)

# Also fix the fallback in renderSettings so if heroBannerImage isn't provided, it uses the optimized one?
# The Cloudinary URL only exists in HTML, settings come from DB.

with open(index_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated index.html")
