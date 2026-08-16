import re

file_path = "admin.html"

with open(file_path, "r", encoding="utf-8") as f:
    html = f.read()

# 1. Add sidebar tab
sidebar_tab = """            <li onclick="switchTab('qr')"><i class="fas fa-qrcode"></i> <span>Bank QR Code</span></li>
            <li onclick="switchTab('committee')"><i class="fas fa-users"></i> <span>उत्सव कार्यकारिणी</span></li>"""
if "switchTab('committee')" not in html:
    html = html.replace('<li onclick="switchTab(\'qr\')"><i class="fas fa-qrcode"></i> <span>Bank QR Code</span></li>', sidebar_tab)

# 2. Add Committee Section UI
committee_section = """
        <!-- Committee Section -->
        <div id="committee" class="tab-content" style="display: none;">
            <div class="header">
                <h2>उत्सव कार्यकारिणी व्यवस्थापन</h2>
                <button class="btn btn-primary" onclick="openCommitteeModal()"><i class="fas fa-plus"></i> नवीन सदस्य जोडा</button>
            </div>
            
            <div class="card">
                <div class="card-body">
                    <div style="overflow-x: auto;">
                        <table class="table" id="committee-table">
                            <thead>
                                <tr>
                                    <th style="width: 80px;">क्रम</th>
                                    <th style="width: 80px;">फोटो</th>
                                    <th>पद (Role)</th>
                                    <th>नाव</th>
                                    <th>मोबाईल नंबर</th>
                                    <th>कृती</th>
                                </tr>
                            </thead>
                            <tbody id="committee-tbody">
                                <!-- Committee members will be loaded here -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Committee Modal -->
        <div id="committeeModal" class="modal">
            <div class="modal-content" style="max-width: 500px;">
                <h3 id="committeeModalTitle" style="margin-bottom: 20px; font-weight: 700; color: #1a1a2e;">नवीन सदस्य जोडा</h3>
                <form id="committeeForm" onsubmit="handleCommitteeSubmit(event)">
                    <input type="hidden" id="committee-role-old" />
                    
                    <div class="form-group">
                        <label>क्रम (Order Number) *</label>
                        <input type="number" id="committee-order" class="form-control" placeholder="उदा. 1 (अध्यक्ष), 2 (उपाध्यक्ष)" required>
                        <small style="color: #666; display: block; margin-top: 5px;">या क्रमानुसार वेबसाईटवर नावे दिसतील.</small>
                    </div>
                    
                    <div class="form-group">
                        <label>पद (Role / Post) *</label>
                        <input type="text" id="committee-role" class="form-control" placeholder="उदा. अध्यक्ष" required>
                    </div>
                    
                    <div class="form-group">
                        <label>नाव (Full Name) *</label>
                        <input type="text" id="committee-name" class="form-control" placeholder="सदस्याचे नाव" required>
                    </div>
                    
                    <div class="form-group">
                        <label>मोबाईल नंबर</label>
                        <input type="text" id="committee-mobile" class="form-control" placeholder="मोबाईल नंबर (उदा. 9876543210)">
                    </div>
                    
                    <div class="form-group">
                        <label>फोटो (Photo)</label>
                        <input type="file" id="committee-photo" class="form-control" accept="image/*">
                        <div id="committee-photo-preview" style="margin-top: 10px; display: none;">
                            <img id="committee-photo-img" src="" alt="Preview" style="max-width: 100px; max-height: 100px; border-radius: 8px; border: 2px solid #ffd700;">
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 25px;">
                        <button type="button" class="btn btn-secondary" onclick="closeCommitteeModal()">रद्द करा (Cancel)</button>
                        <button type="submit" class="btn btn-primary" id="committeeSubmitBtn">सेव्ह करा (Save)</button>
                    </div>
                </form>
            </div>
        </div>
"""

if 'id="committee" class="tab-content"' not in html:
    html = html.replace('<!-- Settings Section -->', committee_section + '\n\n        <!-- Settings Section -->')


# 3. Add JS functions
committee_js = """
// ==========================================
// COMMITTEE MANAGEMENT
// ==========================================

let currentCommittee = [];

async function loadCommittee() {
    try {
        const res = await fetch('/api/committee');
        const json = await res.json();
        if(json.success) {
            currentCommittee = json.data;
            renderCommitteeTable();
        }
    } catch (e) {
        console.error("Error loading committee:", e);
    }
}

function renderCommitteeTable() {
    const tbody = document.getElementById('committee-tbody');
    if(!tbody) return;
    
    tbody.innerHTML = '';
    
    if(currentCommittee.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">कोणतेही सदस्य सापडले नाहीत.</td></tr>';
        return;
    }
    
    currentCommittee.forEach(member => {
        const tr = document.createElement('tr');
        
        const photoHtml = member.photoUrl 
            ? `<img src="${member.photoUrl}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid #ffd700;">` 
            : `<div style="width: 50px; height: 50px; border-radius: 50%; background: #e0e0e0; display: flex; align-items: center; justify-content: center;"><i class="fas fa-user" style="color: #999;"></i></div>`;
            
        tr.innerHTML = `
            <td style="font-weight: bold; color: #ff8c00;">${member.order || 0}</td>
            <td>${photoHtml}</td>
            <td style="font-weight: 700;">${member.role}</td>
            <td>${member.name}</td>
            <td>${member.mobile || '-'}</td>
            <td>
                <button class="btn btn-primary" style="padding: 6px 12px; font-size: 13px;" onclick="editCommitteeMember('${member.role}')"><i class="fas fa-edit"></i> Edit</button>
                <button class="btn btn-danger" style="padding: 6px 12px; font-size: 13px; margin-left: 5px;" onclick="deleteCommitteeMember('${member.role}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openCommitteeModal() {
    document.getElementById('committeeModalTitle').innerText = "नवीन सदस्य जोडा";
    document.getElementById('committeeForm').reset();
    document.getElementById('committee-role-old').value = "";
    document.getElementById('committee-photo-preview').style.display = "none";
    document.getElementById('committeeModal').style.display = "flex";
}

function closeCommitteeModal() {
    document.getElementById('committeeModal').style.display = "none";
}

function editCommitteeMember(role) {
    const member = currentCommittee.find(m => m.role === role);
    if(!member) return;
    
    document.getElementById('committeeModalTitle').innerText = "सदस्य माहिती बदला";
    document.getElementById('committee-role-old').value = member.role;
    document.getElementById('committee-role').value = member.role;
    document.getElementById('committee-name').value = member.name;
    document.getElementById('committee-mobile').value = member.mobile || '';
    document.getElementById('committee-order').value = member.order || 0;
    
    const preview = document.getElementById('committee-photo-preview');
    const previewImg = document.getElementById('committee-photo-img');
    if(member.photoUrl) {
        previewImg.src = member.photoUrl;
        preview.style.display = "block";
    } else {
        preview.style.display = "none";
    }
    
    document.getElementById('committeeModal').style.display = "flex";
}

async function deleteCommitteeMember(role) {
    if(confirm('तुम्हाला खात्री आहे की हा सदस्य डिलीट करायचा आहे?')) {
        try {
            const res = await fetch(`/api/committee/${encodeURIComponent(role)}`, { method: 'DELETE' });
            if(res.ok) {
                showToast('सदस्य डिलीट झाला', 'success');
                loadCommittee();
            }
        } catch(e) {
            showToast('Error deleting member', 'error');
        }
    }
}

async function handleCommitteeSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('committeeSubmitBtn');
    btn.disabled = true;
    btn.innerText = "Please wait...";
    
    const oldRole = document.getElementById('committee-role-old').value;
    const role = document.getElementById('committee-role').value;
    const name = document.getElementById('committee-name').value;
    const mobile = document.getElementById('committee-mobile').value;
    const order = document.getElementById('committee-order').value;
    const photoFile = document.getElementById('committee-photo').files[0];
    
    const formData = new FormData();
    formData.append('role', role);
    formData.append('name', name);
    formData.append('mobile', mobile);
    formData.append('order', order);
    if(photoFile) formData.append('photo', photoFile);
    
    try {
        // If role changed, delete the old one first (since role is the unique key in backend)
        if(oldRole && oldRole !== role) {
            await fetch(`/api/committee/${encodeURIComponent(oldRole)}`, { method: 'DELETE' });
        }
        
        const res = await fetch('/api/committee', {
            method: 'POST',
            body: formData
        });
        
        const json = await res.json();
        if(json.success) {
            showToast('माहिती सेव्ह झाली!', 'success');
            closeCommitteeModal();
            loadCommittee();
        } else {
            showToast(json.error || 'Failed to save', 'error');
        }
    } catch(err) {
        showToast('Network error', 'error');
    } finally {
        btn.disabled = false;
        btn.innerText = "सेव्ह करा (Save)";
    }
}
"""

if 'loadCommittee()' not in html:
    html = html.replace('// Dashboard functions', committee_js + '\n// Dashboard functions')
    html = html.replace('loadSettings();', 'loadSettings();\n            loadCommittee();')


with open(file_path, "w", encoding="utf-8") as f:
    f.write(html)
print("Updated admin.html successfully!")
