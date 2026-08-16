import os
import re

index_file = "index.html"
with open(index_file, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix the IIFE cache loader at the top
old_iife = """
                        if (dElem && deskImg) dElem.src = (deskImg.startsWith('data:image') || deskImg.startsWith('http')) ? deskImg : ('uploads/' + deskImg);
                        if (mElem && mobImg) mElem.src = (mobImg.startsWith('data:image') || mobImg.startsWith('http')) ? mobImg : ('uploads/' + mobImg);
"""
new_iife = """
                        if (dElem && deskImg) {
                            const newSrc = (deskImg.startsWith('data:image') || deskImg.startsWith('http')) ? deskImg : ('uploads/' + deskImg);
                            const t1 = new Image(); t1.onload = () => dElem.src = newSrc; t1.src = newSrc;
                        }
                        if (mElem && mobImg) {
                            const newSrc = (mobImg.startsWith('data:image') || mobImg.startsWith('http')) ? mobImg : ('uploads/' + mobImg);
                            const t2 = new Image(); t2.onload = () => mElem.src = newSrc; t2.src = newSrc;
                        }
"""
content = content.replace(old_iife, new_iife)

# 2. Fix renderSettings deskImg loader
old_render_desk = """
                if (deskImg) {
                    desktopElem.src = (deskImg.startsWith('data:image') || deskImg.startsWith('http')) ? deskImg : ('uploads/' + deskImg);
                }
"""
new_render_desk = """
                if (deskImg) {
                    const newSrc = (deskImg.startsWith('data:image') || deskImg.startsWith('http')) ? deskImg : ('uploads/' + deskImg);
                    const t = new Image(); t.onload = () => desktopElem.src = newSrc; t.src = newSrc;
                }
"""
content = content.replace(old_render_desk, new_render_desk)

# 3. Fix renderSettings mobImg loader
old_render_mob = """
                if (mobImg) {
                    mobileElem.src = (mobImg.startsWith('data:image') || mobImg.startsWith('http')) ? mobImg : ('uploads/' + mobImg);
                }
"""
new_render_mob = """
                if (mobImg) {
                    const newSrc = (mobImg.startsWith('data:image') || mobImg.startsWith('http')) ? mobImg : ('uploads/' + mobImg);
                    const t = new Image(); t.onload = () => mobileElem.src = newSrc; t.src = newSrc;
                }
"""
content = content.replace(old_render_mob, new_render_mob)

# 4. Fix renderSettings aboutGanpatiPhoto loader
old_about = """
                if (settings.aboutMandalPhoto) {
                    aboutPhotoElem.src = settings.aboutMandalPhoto;
                } else if (settings.heroBannerImage) {
                    aboutPhotoElem.src = settings.heroBannerImage.startsWith('data:') || settings.heroBannerImage.startsWith('http') ? settings.heroBannerImage : (settings.heroBannerImage.startsWith('uploads/') ? settings.heroBannerImage : 'uploads/' + settings.heroBannerImage);
                }
"""
new_about = """
                let newSrc = null;
                if (settings.aboutMandalPhoto) {
                    newSrc = settings.aboutMandalPhoto;
                } else if (settings.heroBannerImage) {
                    newSrc = settings.heroBannerImage.startsWith('data:') || settings.heroBannerImage.startsWith('http') ? settings.heroBannerImage : (settings.heroBannerImage.startsWith('uploads/') ? settings.heroBannerImage : 'uploads/' + settings.heroBannerImage);
                }
                if (newSrc) {
                    const t = new Image(); t.onload = () => aboutPhotoElem.src = newSrc; t.src = newSrc;
                }
"""
content = content.replace(old_about, new_about)

with open(index_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("index.html updated successfully for seamless image swaps")
