import re

file_path = "style.css"

with open(file_path, "r", encoding="utf-8") as f:
    css = f.read()

old_css = """@media (max-width: 768px) {
    .custom-header {
        position: relative !important;
        top: 0;"""

new_css = """@media (max-width: 768px) {
    .custom-header {
        position: sticky !important;
        top: 0;"""

if old_css in css:
    css = css.replace(old_css, new_css)
    print("Successfully replaced position: relative to position: sticky in style.css!")
else:
    print("Could not find the exact CSS block.")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(css)
