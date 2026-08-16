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
        top: -1px;
        border-bottom: 2px solid rgba(255, 215, 0, 0.4) !important;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.9) !important;"""

if old_css in css:
    css = css.replace(old_css, new_css)
    print("Changed custom-header to sticky with shadow.")

# Fix overflow-x on body
css = css.replace("overflow-x: hidden", "overflow-x: clip")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(css)
