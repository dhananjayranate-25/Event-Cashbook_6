import os
import glob

# Find all HTML and JS files in the current directory
files_to_fix = glob.glob("*.html") + glob.glob("*.js") + ["index.html.tmp"]

# We want to replace:
# if (btn) btn.innerHTML = originalText;
# with:
# if (btn) { btn.innerHTML = originalText; btn.disabled = false; }

target_string = "if (btn) btn.innerHTML = originalText;"
replacement_string = "if (btn) { btn.innerHTML = originalText; btn.disabled = false; }"

for filename in files_to_fix:
    if not os.path.isfile(filename):
        continue
    
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
            
        if target_string in content:
            new_content = content.replace(target_string, replacement_string)
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Fixed bug in {filename}")
    except Exception as e:
        print(f"Error processing {filename}: {e}")

print("Fix applied.")
