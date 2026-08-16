import os

files_to_fix = [
    "index.html",
    "index.html.tmp"
]

for filename in files_to_fix:
    if not os.path.exists(filename):
        continue
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # We need to replace ' + committeeHtml + ' with ${committeeHtml} ONLY inside template literals
    # We can split by return `<!DOCTYPE html>
    
    parts = content.split('return `<!DOCTYPE html>')
    if len(parts) > 1:
        for i in range(1, len(parts)):
            parts[i] = parts[i].replace("' + committeeHtml + '", "${committeeHtml}")
            
        content = 'return `<!DOCTYPE html>'.join(parts)
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed template literal in {filename}")
