import re

file_path = "index.html"
with open(file_path, "r", encoding="utf-8") as f:
    html = f.read()

# Replace everything inside <div class="committee-grid"> ... </div>
pattern = r'(<div class="committee-grid">).*?(</div>\s*</div>\s*</div>\s*<!-- Niyojan Section -->)'
match = re.search(pattern, html, re.DOTALL)
if match:
    new_html = match.group(1) + """
                            <div id="dynamic-committee-container" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px;">
                                <div style="text-align: center; width: 100%; color: #fff; padding: 20px;">
                                    <i class="fas fa-spinner fa-spin fa-2x"></i>
                                    <p style="margin-top: 10px;">माहिती लोड होत आहे...</p>
                                </div>
                            </div>
                        """ + match.group(2)
    html = html.replace(match.group(0), new_html)
    print("Replaced committee grid!")
else:
    print("Could not find committee grid")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(html)
