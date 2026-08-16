import os

file_path = "script.js"

js_code = """

// ==========================================
// DYNAMIC COMMITTEE LOADING
// ==========================================

window.currentCommitteeData = [];

async function fetchAndRenderCommittee() {
    const container = document.getElementById('dynamic-committee-container');
    if (!container) return; // Not on home page
    
    try {
        const res = await fetch('/api/committee');
        const json = await res.json();
        
        if (json.success && json.data.length > 0) {
            window.currentCommitteeData = json.data;
            container.innerHTML = ''; // Clear loader
            
            json.data.forEach((member, index) => {
                const photoSrc = member.photoUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e0e0e0'/%3E%3Ccircle cx='50' cy='40' r='20' fill='%23bdbdbd'/%3E%3Cpath d='M20,90 Q50,50 80,90' stroke='%23bdbdbd' stroke-width='10' fill='none'/%3E%3C/svg%3E";
                const delay = index * 100; // stagger animation
                
                // Keep the exact same class structure from the old hardcoded HTML
                const card = document.createElement('div');
                card.className = 'committee-member animate-fade-up';
                card.style.animationDelay = `${delay}ms`;
                card.style.margin = '10px';
                // Adjust width dynamically: if it's the first two (president/treasurer), make them take more space on desktop, otherwise standard
                card.style.flex = '1 1 200px'; 
                card.style.maxWidth = '300px';
                
                card.innerHTML = `
                    <div class="member-photo-frame">
                        <img src="${photoSrc}" alt="${member.name}" class="member-photo" style="object-position: center 10%; width: 100%; height: 100%; border-radius: 50%;">
                    </div>
                    <h3 class="member-role">${member.role}</h3>
                    <p class="member-name">${member.name}</p>
                    <p class="member-phone" ${member.mobile ? '' : 'style="display:none;"'}>मो.नं ${member.mobile}</p>
                `;
                
                container.appendChild(card);
            });
            
        } else {
            container.innerHTML = '<p style="color:#fff; text-align:center; width:100%;">सध्या कोणतीही माहिती उपलब्ध नाही.</p>';
        }
    } catch (e) {
        console.error("Error fetching committee:", e);
        container.innerHTML = '<p style="color:#fff; text-align:center; width:100%;">माहिती लोड करण्यात त्रुटी.</p>';
    }
}

// Ensure it runs when the document is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchAndRenderCommittee);
} else {
    fetchAndRenderCommittee();
}
"""

with open(file_path, "a", encoding="utf-8") as f:
    f.write(js_code)

print("Appended dynamic committee script to script.js!")
