
    // Auto-wrap tables for mobile responsiveness
    document.addEventListener('DOMContentLoaded', function() {
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            if (!table.parentElement.classList.contains('table-responsive')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'table-responsive';
                table.parentNode.insertBefore(wrapper, table);
                wrapper.appendChild(table);
            }
        });
    });
    


        if (sessionStorage.getItem('adminLoggedIn') === 'true') {
            document.documentElement.classList.add('show-admin');
        } else {
            document.documentElement.classList.add('show-login');
        }
    

                    let currentMemberCount = 9;
                    
                    function generateMemberForm(i) {
                        return `
                        <div class="upload-container" style="margin-bottom: 20px;" id="member${i}Container">
                            <h3 style="margin-bottom: 15px; color: var(--text-primary);">Member ${i} (सदस्य)</h3>
                            <div class="form-grid">
                                <div class="form-group floating-label">
                                    <input type="text" id="member${i}Name" placeholder=" ">
                                    <label for="member${i}Name">Name</label>
                                    <div class="input-focus-line"></div>
                                </div>
                                <div class="form-group floating-label">
                                    <input type="text" id="member${i}Mobile" placeholder=" ">
                                    <label for="member${i}Mobile">Mobile Number</label>
                                    <div class="input-focus-line"></div>
                                </div>
                                <div class="form-group floating-label">
                                    <input type="text" id="member${i}Designation" placeholder=" " class="form-control" style="width:100%; padding:10px; border-radius:10px; background:var(--bg-card); border:1px solid var(--glass-border); color:var(--text-primary);">
                                    <label for="member${i}Designation">Post / Designation टाईप करा</label>
                                    <div class="input-focus-line"></div>
                                </div>
                            </div>
                            <div style="margin-top: 15px;">
                                <label style="color: var(--text-secondary); font-size: 12px; display: block; margin-bottom: 5px;">Member ${i} Photo</label>
                                <input type="file" id="member${i}PhotoInput" accept="image/*" style="padding: 8px; border-radius: 10px; background: var(--bg-card); border: 2px dashed var(--glass-border); color: var(--text-primary); cursor: pointer; width: 100%;">
                            </div>
                            <div class="committee-btn-group" style="margin-top: 20px; display: flex; flex-wrap: wrap; align-items: center; gap: 10px;">
                                <button class="btn btn-primary ripple" onclick="saveCommitteeMember('member${i}')" style="background: linear-gradient(135deg, #10b981, #059669); margin: 0;">Save Member ${i}</button>
                                <button class="btn btn-primary ripple" onclick="deleteCommitteeMember('member${i}')" style="background: linear-gradient(135deg, #ef4444, #dc2626); margin: 0;">Delete</button>
                                <span id="member${i}Status" style="font-size:14px; margin-left:5px;"></span>
                            </div>
                        </div>
                        `;
                    }

                    function renderExtraMembers() {
                        const container = document.getElementById('extra-members-container');
                        let html = '';
                        for(let i=1; i<=currentMemberCount; i++) {
                            html += generateMemberForm(i);
                        }
                        container.innerHTML = html;
                    }

                    function addNewMemberSlot() {
                        currentMemberCount++;
                        const container = document.getElementById('extra-members-container');
                        container.insertAdjacentHTML('beforeend', generateMemberForm(currentMemberCount));
                    }

                    document.addEventListener('DOMContentLoaded', () => {
                        renderExtraMembers();
                    });
                

        function adminLogout() {
            sessionStorage.removeItem('adminLoggedIn');
            window.location.replace('index.html');
        }

        document.addEventListener('DOMContentLoaded', function() {
            // Check session persistence (if logged in from login.html)
            if (sessionStorage.getItem('adminLoggedIn') === 'true') {
                document.getElementById('loginContainer').style.display = 'none';
                document.getElementById('adminPanel').style.display = 'block';
                // Wait a moment for script.js to load, then initialize
                setTimeout(() => {
                    if (window.loadYearsForAdmin) window.loadYearsForAdmin();
                    if (window.fetchStorageStats) window.fetchStorageStats();
                    
                    const savedTab = sessionStorage.getItem('activeAdminTab');
                    if (savedTab) {
                        switchAdminTab(savedTab, false);
                    }
                }, 100);
            } else {
                // Show login by default
                document.getElementById('loginContainer').style.display = 'flex';
                document.getElementById('adminPanel').style.display = 'none';
            }
            
            // Login button handler
            const loginBtn = document.getElementById('loginBtn');
            if (loginBtn) {
                loginBtn.addEventListener('click', function() {
                    if (window.checkAdminLogin) {
                        window.checkAdminLogin();
                    }
                });
            }
            
            // Allow Enter key to login
            const passwordInput = document.getElementById('adminPassword');
            if (passwordInput) {
                passwordInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        if (loginBtn) loginBtn.click();
                    }
                });
            }
            
            // Create Panel button
            const createBtn = document.getElementById('createPanelBtn');
            if (createBtn) {
                createBtn.addEventListener('click', function() {
                    if (window.createCustomYearPanel) window.createCustomYearPanel();
                    else console.error('createCustomYearPanel not found');
                });
            }
            
            // Delete Panel button
            const deleteBtn = document.getElementById('deletePanelBtn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', function() {
                    if (window.deleteCustomYearPanel) window.deleteCustomYearPanel();
                    else console.error('deleteCustomYearPanel not found');
                });
            }
            
            // Delete All Panels button
            const deleteAllBtn = document.getElementById('deleteAllPanelsBtn');
            if (deleteAllBtn) {
                deleteAllBtn.addEventListener('click', function() {
                    if (window.deleteAllPanels) window.deleteAllPanels();
                    else console.error('deleteAllPanels not found');
                });
            }
            
            // Year tabs
            const yearTabs = document.querySelectorAll('.year-tab');
            yearTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const year = this.getAttribute('data-year');
                    if (window.switchYearTab) window.switchYearTab(year);
                    else console.error('switchYearTab not found');
                });
            });

            // PDF Upload
            const uploadBtn = document.getElementById('uploadBtn');
            if (uploadBtn) {
                uploadBtn.addEventListener('click', uploadPDF);
            }

            // Upload year input handler
            const uploadYearInput = document.getElementById('uploadYearInput');
            if (uploadYearInput) {
                uploadYearInput.addEventListener('input', function() {
                    let val = this.value.trim();
                    if (val && !isNaN(val) && val.length === 4) {
                        const s = getPDFSettingsForYear(val);
                        document.getElementById('uploadOrgName').value = s.orgName;
                        document.getElementById('uploadSubtitle').value = s.subtitle;
                        document.getElementById('uploadTagline').value = s.tagline;
                    }
                });
            }

            loadUploadedPDFs();
            loadAppearanceSettings();
        });

        // Global Function to upload file and get URL
        async function uploadFile(file) {
            const formData = new FormData();
            formData.append('image', file);
            const response = await fetch('/api/upload-image', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (!result.success) throw new Error(result.error);
            return result.url;
        }

        async function loadAppearanceSettings() {
            try {
                const response = await fetch('/api/settings');
                const result = await response.json();
                if (result.success) {
                    const settings = result.data;
                    document.getElementById('appEstYear').value = settings.estYear || '';
if (settings.bgAudioUrl) document.getElementById('currentBgAudio').innerHTML = `Current: <a href="${settings.bgAudioUrl}" target="_blank" style="color:#ffd700;">Audio Link</a>`;
if (settings.bgAudioVolume !== undefined) {
    document.getElementById('bgVolumeInput').value = settings.bgAudioVolume;
    document.getElementById('bgVolumeLabel').innerText = Math.round(settings.bgAudioVolume * 100) + '%';
}
                    
                    document.getElementById('donateAccName').value = settings.donateAccName || 'Dhananjay Sachin Ranate';
                    document.getElementById('donateAccNo').value = settings.donateAccNo || '322502010043655';
                    document.getElementById('donateIFSC').value = settings.donateIFSC || 'UBIN0532258';
                    document.getElementById('donateBranch').value = settings.donateBranch || 'Union Bank Of India, Gulewadi Sangamner';
                    
                    if (document.getElementById('aboutMandalTitle')) {
                        document.getElementById('aboutMandalTitle').value = settings.aboutMandalTitle || 'मंडळाचा परिचय';
                    }
                    if (document.getElementById('aboutMandalSubtitle')) {
                        document.getElementById('aboutMandalSubtitle').value = settings.aboutMandalSubtitle || 'भक्ती, संस्कृती आणि सामाजिक कार्याची परंपरा';
                    }
                    if (document.getElementById('aboutMandalDetails')) {
                        document.getElementById('aboutMandalDetails').value = settings.aboutMandalDetails || 'शिवसृष्टी सार्वजनिक उत्सव मंडळ, संगमनेर हे धार्मिक, सांस्कृतिक आणि सामाजिक कार्यासाठी ओळखले जाणारे परिसरातील एक अग्रणी आणि सन्माननीय मंडळ आहे.\n\nमंडळाची स्थापना सन २०१९ मध्ये झाली असून, यंदाचे मंडळाचे दिमाखदार ८ वे वर्ष आहे. श्री गणेशोत्सवाच्या माध्यमातून समाजात एकोपा निर्माण करणे, विविध सामाजिक, शैक्षणिक व आरोग्य उपक्रम राबवणे आणि पर्यावरणपूरक उत्सवाचा वसा पुढे चालवणे हे आमच्या मंडळाचे मुख्य ध्येय आहे.\n\nमंडळाच्या वतीने दरवर्षी महाआरती, सामाजिक शिबिरे, भव्य व मंगलमय आगमन आणि विसर्जन मिरवणूक तसेच अन्नदान (महाप्रसाद) अशा विविध उपक्रमांचे अतिशय शिस्तबद्ध व शानदार आयोजन केले जाते.\n\nसर्व भाविक भक्तांचे, देणगीदारांचे, गावकऱ्यांचे आणि मंडळातील सर्व अभ्यासू व जिद्दी कार्यकर्त्यांचे मोलाचे सहकार्य हीच आमच्या मंडळाची खरी ताकद व प्रेरणा आहे.\n\n॥ अनंत कोटी ब्रह्मांड नायक राजाधिराज श्री गणेशाय नमः ॥ 🚩';
                    }
                    
                    if (document.getElementById('varganiAabharText')) {
                        document.getElementById('varganiAabharText').value = settings.varganiAabharText || '';
                    }
                    if (document.getElementById('varganiAabharTitle')) {
                        document.getElementById('varganiAabharTitle').value = settings.varganiAabharTitle || '';
                    }
                                        if (document.getElementById('mahaprasadNimantranText')) {
                        document.getElementById('mahaprasadNimantranText').value = settings.mahaprasadNimantranText || '';
                    }
                    if (document.getElementById('mahaprasadNimantranTitle')) {
                        document.getElementById('mahaprasadNimantranTitle').value = settings.mahaprasadNimantranTitle || '';
                    }
                    if (document.getElementById('aagmanSohalaText')) {
                        document.getElementById('aagmanSohalaText').value = settings.aagmanSohalaText || '';
                    }
                    if (document.getElementById('aagmanSohalaTitle')) {
                        document.getElementById('aagmanSohalaTitle').value = settings.aagmanSohalaTitle || '';
                    }
                    if (document.getElementById('visarjanSohalaText')) {
                        document.getElementById('visarjanSohalaText').value = settings.visarjanSohalaText || '';
                    }
                    if (document.getElementById('visarjanSohalaTitle')) {
                        document.getElementById('visarjanSohalaTitle').value = settings.visarjanSohalaTitle || '';
                    }
                    if (document.getElementById('customEventText')) {
                        document.getElementById('customEventText').value = settings.customEventText || '';
                    }
                    if (document.getElementById('customEventTitle')) {
                        document.getElementById('customEventTitle').value = settings.customEventTitle || '';
                    }
                    if (document.getElementById('varganiCardBadge')) document.getElementById('varganiCardBadge').value = settings.varganiCardBadge || '';
                    if (document.getElementById('varganiCardDesc')) document.getElementById('varganiCardDesc').value = settings.varganiCardDesc || '';
                    if (document.getElementById('mahaprasadCardBadge')) document.getElementById('mahaprasadCardBadge').value = settings.mahaprasadCardBadge || '';
                    if (document.getElementById('mahaprasadCardDesc')) document.getElementById('mahaprasadCardDesc').value = settings.mahaprasadCardDesc || '';
                    if (document.getElementById('aagmanCardBadge')) document.getElementById('aagmanCardBadge').value = settings.aagmanCardBadge || '';
                    if (document.getElementById('aagmanCardDesc')) document.getElementById('aagmanCardDesc').value = settings.aagmanCardDesc || '';
                    if (document.getElementById('visarjanCardBadge')) document.getElementById('visarjanCardBadge').value = settings.visarjanCardBadge || '';
                    if (document.getElementById('visarjanCardDesc')) document.getElementById('visarjanCardDesc').value = settings.visarjanCardDesc || '';
                    if (document.getElementById('customEventCardBadge')) document.getElementById('customEventCardBadge').value = settings.customEventCardBadge || '';
                    if (document.getElementById('customEventCardDesc')) document.getElementById('customEventCardDesc').value = settings.customEventCardDesc || '';
                    const getToggleStr = (val) => (val === false || val === 0 || val === '0' || String(val).trim().toLowerCase() === 'false' || String(val).trim().toLowerCase() === 'off') ? 'false' : 'true';
                    if (document.getElementById('showVarganiPoster')) {
                        document.getElementById('showVarganiPoster').value = getToggleStr(settings.showVarganiPoster);
                    }
                    if (document.getElementById('showMahaprasadPoster')) {
                        document.getElementById('showMahaprasadPoster').value = getToggleStr(settings.showMahaprasadPoster);
                    }
                    if (document.getElementById('showAagmanPoster')) {
                        document.getElementById('showAagmanPoster').value = getToggleStr(settings.showAagmanPoster);
                    }
                    if (document.getElementById('showVisarjanPoster')) {
                        document.getElementById('showVisarjanPoster').value = getToggleStr(settings.showVisarjanPoster);
                    }
                    if (document.getElementById('showCustomEventPoster')) {
                        document.getElementById('showCustomEventPoster').value = getToggleStr(settings.showCustomEventPoster);
                    }
                    if (document.getElementById('donationPosterMode')) {
                        document.getElementById('donationPosterMode').value = settings.donationPosterMode || 'generated';
                    }
                    if (document.getElementById('donationPosterBtnName')) {
                        document.getElementById('donationPosterBtnName').value = settings.donationPosterBtnName || '';
                    }
                    if (document.getElementById('donationPosterText')) {
                        document.getElementById('donationPosterText').value = settings.donationPosterText || '';
                    }
                }
            } catch(e) {
                console.error("Error loading settings:", e);
            }
        }

        async function saveAppearanceSettings() {
            const status = document.getElementById('appearanceStatus');
            status.innerHTML = '<span style="color: #3b82f6;">Saving...</span>';
            
            const estYear = document.getElementById('appEstYear').value;
            const varganiAabharTitle = document.getElementById('varganiAabharTitle').value;
            const varganiAabharText = document.getElementById('varganiAabharText').value;
                        const mahaprasadNimantranTitle = document.getElementById('mahaprasadNimantranTitle').value;
            const mahaprasadNimantranText = document.getElementById('mahaprasadNimantranText').value;
            const aagmanSohalaTitle = document.getElementById('aagmanSohalaTitle').value;
            const aagmanSohalaText = document.getElementById('aagmanSohalaText').value;
            const visarjanSohalaTitle = document.getElementById('visarjanSohalaTitle') ? document.getElementById('visarjanSohalaTitle').value : '';
            const visarjanSohalaText = document.getElementById('visarjanSohalaText') ? document.getElementById('visarjanSohalaText').value : '';
            const customEventTitle = document.getElementById('customEventTitle') ? document.getElementById('customEventTitle').value : '';
            const customEventText = document.getElementById('customEventText') ? document.getElementById('customEventText').value : '';
            const varganiCardBadge = document.getElementById('varganiCardBadge') ? document.getElementById('varganiCardBadge').value : '';
            const varganiCardDesc = document.getElementById('varganiCardDesc') ? document.getElementById('varganiCardDesc').value : '';
            const mahaprasadCardBadge = document.getElementById('mahaprasadCardBadge') ? document.getElementById('mahaprasadCardBadge').value : '';
            const mahaprasadCardDesc = document.getElementById('mahaprasadCardDesc') ? document.getElementById('mahaprasadCardDesc').value : '';
            const aagmanCardBadge = document.getElementById('aagmanCardBadge') ? document.getElementById('aagmanCardBadge').value : '';
            const aagmanCardDesc = document.getElementById('aagmanCardDesc') ? document.getElementById('aagmanCardDesc').value : '';
            const visarjanCardBadge = document.getElementById('visarjanCardBadge') ? document.getElementById('visarjanCardBadge').value : '';
            const visarjanCardDesc = document.getElementById('visarjanCardDesc') ? document.getElementById('visarjanCardDesc').value : '';
            const customEventCardBadge = document.getElementById('customEventCardBadge') ? document.getElementById('customEventCardBadge').value : '';
            const customEventCardDesc = document.getElementById('customEventCardDesc') ? document.getElementById('customEventCardDesc').value : '';

            const showVarganiPoster = document.getElementById('showVarganiPoster') ? document.getElementById('showVarganiPoster').value : 'true';
            const showMahaprasadPoster = document.getElementById('showMahaprasadPoster') ? document.getElementById('showMahaprasadPoster').value : 'true';
            const showAagmanPoster = document.getElementById('showAagmanPoster') ? document.getElementById('showAagmanPoster').value : 'true';
            const showVisarjanPoster = document.getElementById('showVisarjanPoster') ? document.getElementById('showVisarjanPoster').value : 'true';
            const showCustomEventPoster = document.getElementById('showCustomEventPoster') ? document.getElementById('showCustomEventPoster').value : 'true';

            const donationPosterMode = document.getElementById('donationPosterMode').value;
            const donationPosterBtnName = document.getElementById('donationPosterBtnName').value;
            const donationPosterText = document.getElementById('donationPosterText').value;



            try {
                // Save texts
                const bgVolume = document.getElementById('bgVolumeInput').value;
const settingsToSave = [
{ key: 'bgAudioVolume', value: bgVolume },
                    { key: 'estYear', value: estYear },
                    { key: 'varganiAabharTitle', value: varganiAabharTitle },
                    { key: 'varganiAabharText', value: varganiAabharText },
                    { key: 'varganiCardBadge', value: varganiCardBadge },
                    { key: 'varganiCardDesc', value: varganiCardDesc },
                    { key: 'mahaprasadNimantranTitle', value: mahaprasadNimantranTitle },
                    { key: 'mahaprasadNimantranText', value: mahaprasadNimantranText },
                    { key: 'mahaprasadCardBadge', value: mahaprasadCardBadge },
                    { key: 'mahaprasadCardDesc', value: mahaprasadCardDesc },
                    { key: 'aagmanSohalaTitle', value: aagmanSohalaTitle },
                    { key: 'aagmanSohalaText', value: aagmanSohalaText },
                    { key: 'aagmanCardBadge', value: aagmanCardBadge },
                    { key: 'aagmanCardDesc', value: aagmanCardDesc },
                    { key: 'visarjanSohalaTitle', value: visarjanSohalaTitle },
                    { key: 'visarjanSohalaText', value: visarjanSohalaText },
                    { key: 'visarjanCardBadge', value: visarjanCardBadge },
                    { key: 'visarjanCardDesc', value: visarjanCardDesc },
                    { key: 'customEventTitle', value: customEventTitle },
                    { key: 'customEventText', value: customEventText },
                    { key: 'customEventCardBadge', value: customEventCardBadge },
                    { key: 'customEventCardDesc', value: customEventCardDesc },
                    { key: 'showVarganiPoster', value: showVarganiPoster },
                    { key: 'showMahaprasadPoster', value: showMahaprasadPoster },
                    { key: 'showAagmanPoster', value: showAagmanPoster },
                    { key: 'showVisarjanPoster', value: showVisarjanPoster },
                    { key: 'showCustomEventPoster', value: showCustomEventPoster },
                    { key: 'donationPosterMode', value: donationPosterMode },
                    { key: 'donationPosterBtnName', value: donationPosterBtnName },
                    { key: 'donationPosterText', value: donationPosterText },
                    
                    
                    
                    
                ];

                // Upload Background Audio
const bgAudioInput = document.getElementById('bgAudioInput');
if (bgAudioInput.files && bgAudioInput.files.length > 0) {
    const audioData = new FormData();
    audioData.append('audio', bgAudioInput.files[0]);
    const audioRes = await fetch('/api/upload-audio', { method: 'POST', body: audioData });
    const audioResult = await audioRes.json();
    if (audioResult.success) {
        settingsToSave.push({ key: 'bgAudioUrl', value: audioResult.url });
    }
}

// Upload Custom Posters as Base64 if selected
                const donInput = document.getElementById('donationPosterInput');
                if (donInput.files && donInput.files.length > 0) {
                    const url = await uploadFile(donInput.files[0]);
                    settingsToSave.push({ key: 'donationPosterImage', value: url });
                    donInput.value = '';
                }
                

                // Upload Banner as Base64 to MongoDB if selected
                const fileInput = document.getElementById('heroBannerInput');
                if (fileInput.files && fileInput.files.length > 0) {
                    const file = fileInput.files[0];
                    const url = await uploadFile(file);
                    settingsToSave.push({ key: 'heroBannerImage', value: url });
                    fileInput.value = '';
                }

                // Upload Website Header Banner Image if selected
                const webHeaderInput = document.getElementById('websiteHeaderBannerInput');
                if (webHeaderInput && webHeaderInput.files && webHeaderInput.files.length > 0) {
                    const url = await uploadFile(webHeaderInput.files[0]);
                    settingsToSave.push({ key: 'websiteHeaderImage', value: url });
                    webHeaderInput.value = '';
                }

                // Upload Mobile View & Posters Header Image if selected
                const posterHeaderInput = document.getElementById('posterHeaderBannerInput');
                if (posterHeaderInput && posterHeaderInput.files && posterHeaderInput.files.length > 0) {
                    const url = await uploadFile(posterHeaderInput.files[0]);
                    settingsToSave.push({ key: 'posterHeaderImage', value: url });
                    posterHeaderInput.value = '';
                }

                for (const setting of settingsToSave) {
                    await fetch('/api/settings', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(setting)
                    });
                }
                
                status.innerHTML = '<span style="color: #10b981;">Settings saved successfully!</span>';
                setTimeout(() => { status.innerHTML = ''; }, 3000);
                alert('Settings Saved Successfully!');
                
            } catch (error) {
                status.innerHTML = '<span style="color: #ef4444;">Error: ' + error.message + '</span>';
            }
        }


        async function saveDonationSettings() {
            const status = document.getElementById('donationStatus');
            status.innerHTML = '<span style="color: #3b82f6;">Saving...</span>';
            
            const accName = document.getElementById('donateAccName').value;
            const accNo = document.getElementById('donateAccNo').value;
            const ifsc = document.getElementById('donateIFSC').value;
            const branch = document.getElementById('donateBranch').value;
            
            try {
                const settingsToSave = [
                    { key: 'donateAccName', value: accName },
                    { key: 'donateAccNo', value: accNo },
                    { key: 'donateIFSC', value: ifsc },
                    { key: 'donateBranch', value: branch }
                ];

                const fileInput = document.getElementById('donateQRInput');
                if (fileInput.files && fileInput.files.length > 0) {
                    const file = fileInput.files[0];
                    const url = await uploadFile(file);
                    settingsToSave.push({ key: 'donateQRCode', value: url });
                    fileInput.value = '';
                }

                for (const setting of settingsToSave) {
                    await fetch('/api/settings', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(setting)
                    });
                }
                
                status.innerHTML = '<span style="color: #10b981;">Donation settings saved successfully!</span>';
                setTimeout(() => { status.innerHTML = ''; }, 3000);
                alert('Settings Saved Successfully!');
                
            } catch (error) {
                status.innerHTML = '<span style="color: #ef4444;">Error: ' + error.message + '</span>';
            }
        }

        async function saveParichaySettings() {
            const status = document.getElementById('parichayStatus');
            status.innerHTML = '<span style="color: #3b82f6;">Saving...</span>';
            
            const title = document.getElementById('aboutMandalTitle').value;
            const subtitle = document.getElementById('aboutMandalSubtitle').value;
            const details = document.getElementById('aboutMandalDetails').value;
            
            try {
                const settingsToSave = [
                    { key: 'aboutMandalTitle', value: title },
                    { key: 'aboutMandalSubtitle', value: subtitle },
                    { key: 'aboutMandalDetails', value: details }
                ];

                const fileInput = document.getElementById('aboutMandalPhotoInput');
                if (fileInput && fileInput.files && fileInput.files.length > 0) {
                    const file = fileInput.files[0];
                    const url = await uploadFile(file);
                    settingsToSave.push({ key: 'aboutMandalPhoto', value: url });
                    fileInput.value = '';
                }

                for (const setting of settingsToSave) {
                    await fetch('/api/settings', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(setting)
                    });
                }
                
                try {
                    let cached = localStorage.getItem('settingsCache');
                    let s = cached ? JSON.parse(cached) : {};
                    for (const item of settingsToSave) {
                        s[item.key] = item.value;
                    }
                    localStorage.setItem('settingsCache', JSON.stringify(s));
                } catch(ce) {}
                
                status.innerHTML = '<span style="color: #10b981;">Mandal Parichay settings saved successfully!</span>';
                setTimeout(() => { status.innerHTML = ''; }, 3000);
                alert('Mandal Parichay Settings Saved Successfully!');
                
            } catch (error) {
                status.innerHTML = '<span style="color: #ef4444;">Error: ' + error.message + '</span>';
            }
        }

        async function uploadPDF() {
            const year = document.getElementById('uploadYearInput').value;
            const fileInput = document.getElementById('pdfFileInput');
            const status = document.getElementById('uploadStatus');

            if (!year) {
                status.innerHTML = '<p style="color: #ef4444;">Please select a year!</p>';
                return;
            }
            if (!fileInput.files || fileInput.files.length === 0) {
                status.innerHTML = '<p style="color: #ef4444;">Please select a PDF file!</p>';
                return;
            }

            const file = fileInput.files[0];
            if (!file.name.toLowerCase().endsWith('.pdf')) {
                status.innerHTML = '<p style="color: #ef4444;">Only PDF files allowed!</p>';
                return;
            }

            status.innerHTML = '<p style="color: #3b82f6;">Uploading ' + file.name + '...</p>';

            const formData = new FormData();
            formData.append('pdf', file);
            formData.append('year', year);
            const orgName = document.getElementById('uploadOrgName').value.trim();
            const subtitle = document.getElementById('uploadSubtitle').value.trim();
            const tagline = document.getElementById('uploadTagline').value.trim();
            formData.append('orgName', orgName);
            formData.append('subtitle', subtitle);
            formData.append('tagline', tagline);

            try {
                const response = await fetch('/api/upload-pdf', {
                    method: 'POST',
                    body: formData
                });
                const text = await response.text();
                let result;
                try {
                    result = JSON.parse(text);
                } catch (e) {
                    throw new Error('Server returned: ' + text.substring(0, 100));
                }

                if (result.success) {
                    status.innerHTML = '<p style="color: #22c55e;">PDF uploaded successfully with cover settings!</p>';
                    fileInput.value = '';
                    document.getElementById('uploadOrgName').value = '';
                    document.getElementById('uploadSubtitle').value = '';
                    document.getElementById('uploadTagline').value = '';
                    document.getElementById('uploadYearInput').value = '2026';
                    loadUploadedPDFs();
                } else {
                    status.innerHTML = '<p style="color: #ef4444;">Error: ' + result.error + '</p>';
                }
            } catch (error) {
                status.innerHTML = '<p style="color: #ef4444;">Upload failed: ' + error.message + '</p>';
            }
        }

        window.saveUploadCoverSettings = async function saveUploadCoverSettings() {
            const year = document.getElementById('uploadYearInput').value;
            const status = document.getElementById('uploadStatus');
            if (!year) {
                status.innerHTML = '<p style="color: #ef4444;">Please select a year first!</p>';
                return;
            }
            const orgName = document.getElementById('uploadOrgName').value.trim();
            const subtitle = document.getElementById('uploadSubtitle').value.trim();
            const tagline = document.getElementById('uploadTagline').value.trim();
            if (!orgName || !subtitle || !tagline) {
                status.innerHTML = '<p style="color: #ef4444;">All three fields are required!</p>';
                return;
            }
            window.savePDFSettings(year, { orgName, subtitle, tagline });
            status.innerHTML = '<p style="color: #22c55e;">Cover settings saved for ' + year + '! View any ' + year + ' PDF to see changes.</p>';
        }

        async function loadUploadedPDFs() {
            const pdfList = document.getElementById('pdfList');
            if (!pdfList) return;

            try {
                const response = await fetch('/api/uploaded-pdfs');
                const result = await response.json();

                if (result.success && result.data.length > 0) {
                    pdfList.innerHTML = result.data.map(pdf => {
                        const escName = pdf.displayName.replace(/'/g, "\\'");
                        const escSub = (pdf.subtitle || '').replace(/'/g, "\\'");
                        const escTag = (pdf.tagline || '').replace(/'/g, "\\'");
                        const escOrg = (pdf.orgName || '').replace(/'/g, "\\'");
                        const isVisible = pdf.showOnHome !== false;
                        const visBtnStyle = isVisible ? 'background: linear-gradient(135deg, #10b981, #059669); color: white;' : 'background: linear-gradient(135deg, #64748b, #475569); color: white;';
                        const visBtnText = isVisible ? '👁️ Show on Home: ON' : '🚫 Show on Home: OFF';
                        const subDisplay = pdf.subtitle ? `<div style="font-size: 10px; color: #ff8c00;">Marathi: ${pdf.subtitle}</div>` : '';
                        const tagDisplay = pdf.tagline ? `<div style="font-size: 10px; color: #aaa;">Tagline: ${pdf.tagline}</div>` : '';
                        return `
                        <div class="pdf-item" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 15px; margin-bottom: 10px; background: var(--card-bg); border-radius: 10px; border: 1px solid var(--border-color);">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <span style="font-size: 24px;">📄</span>
                                <div>
                    <strong style="color: var(--text-primary);">${pdf.displayName}</strong>
                    <div style="font-size: 11px; color: #888;">Year: ${pdf.year} | Uploaded: ${pdf.uploadedAt}</div>
                    ${subDisplay}
                    ${tagDisplay}
                </div>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <button class="btn btn-primary ripple" onclick="viewMergedPDF('${pdf.filename}', '${pdf.year}', '${escSub}', '${escTag}', '${escOrg}')" style="padding: 8px 16px; font-size: 13px;">
                    View PDF
                </button>
                <button class="btn btn-secondary ripple" onclick="downloadMergedPDF('${pdf.filename}', '${pdf.year}', '${escSub}', '${escTag}', '${escOrg}')" style="padding: 8px 16px; font-size: 13px;">
                    Download
                </button>
                <button class="btn btn-secondary ripple" onclick="togglePDFHomeVisibility('${pdf.filename}', ${!isVisible})" style="padding: 8px 12px; font-size: 13px; ${visBtnStyle}">
                    ${visBtnText}
                </button>
                <button class="btn btn-secondary ripple" onclick="editPdfCover('${pdf.filename}', '${escName}', '${escSub}', '${escTag}', '${escOrg}')" style="padding: 8px 12px; font-size: 13px; background: linear-gradient(135deg, #f59e0b, #d97706);">
                    Cover
                </button>
                <button class="btn btn-secondary ripple" onclick="renamePDF('${pdf.filename}', '${escName}')" style="padding: 8px 12px; font-size: 13px;">
                    Rename
                </button>
                <button class="btn btn-delete ripple" onclick="deletePDF('${pdf.filename}')" style="padding: 8px 12px; font-size: 13px;">
                    Delete
                </button>
            </div>
        </div>`;
                    }).join('');
                } else {
                    pdfList.innerHTML = '<p style="color: #888; text-align: center; padding: 20px;">No PDFs uploaded yet. Upload your existing PDFs above.</p>';
                }
            } catch (error) {
                pdfList.innerHTML = `<p style="color: #ef4444;">Error loading PDFs: ${error.message}</p>`;
            }
        }

        function getPDFSettingsForYear(year) {
            const defaults = { orgName: 'शिवसृष्टी सार्वजनिक उत्सव मंडळ', subtitle: 'गणेश उत्सव कॅशबुक', tagline: 'वर्ष : आठवे', headerOrgName: 'शिवसृष्टी हिंदू तरुण मित्र मंडळ', headerSubtitle: '' };
            try {
                const key = 'pdfCustomSettings_' + year;
                const stored = JSON.parse(localStorage.getItem(key) || '{}');
                if (Object.keys(stored).length > 0) return { ...defaults, ...stored };
                const global = JSON.parse(localStorage.getItem('pdfCustomSettings') || '{}');
                if (Object.keys(global).length > 0) return { ...defaults, ...global };
                return defaults;
            } catch (e) { return defaults; }
        }

        function createCoverHTML(year, logoSrc, pdfSubtitle, pdfTagline, pdfOrgName) {
            const fallback = getPDFSettingsForYear(year);
            const s = {
                orgName: pdfOrgName || fallback.orgName,
                subtitle: pdfSubtitle || fallback.subtitle,
                tagline: pdfTagline || fallback.tagline
            };
            return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=794">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
@media print {
  @page { margin: 0 !important; size: A4 portrait !important; }
  html, body { width: 100% !important; height: 100% !important; margin: 0 !important; padding: 0 !important; background: #ffffff !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  .cover-page { width: 100% !important; max-width: 100% !important; margin: 0 !important; box-sizing: border-box !important; page-break-after: always; overflow: hidden !important; }
}
* { box-sizing: border-box; margin: 0; padding: 0; touch-action: manipulation; }
body { font-family: "Poppins", "Noto Sans Devanagari", sans-serif; background: #f5f0eb; color: #1a1a2e; font-size: 10px; line-height: 1.4; }
.cover-page { width: 210mm; height: 297mm; margin: 0 auto; background: linear-gradient(160deg, #1a0800 0%, #3d1508 25%, #5a2010 50%, #3d1508 75%, #1a0800 100%); position: relative; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; page-break-after: always; box-shadow: 0 0 20px rgba(0,0,0,0.15); }
.cover-page::before { content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(ellipse at 30% 20%, rgba(255,140,0,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(255,215,0,0.1) 0%, transparent 50%); pointer-events: none; }
.cover-outer-border { position: absolute; top: 8mm; left: 8mm; right: 8mm; bottom: 8mm; border: 5px solid #ff8c00; border-radius: 25px; box-shadow: 0 0 30px rgba(255,140,0,0.3), inset 0 0 30px rgba(255,140,0,0.1); }
.cover-inner-border { position: absolute; top: 11mm; left: 11mm; right: 11mm; bottom: 11mm; border: 3px solid rgba(255,215,0,0.4); border-radius: 20px; }
.cover-corner { position: absolute; width: 60px; height: 60px; border: 5px solid #ffd700; }
.cover-corner.tl { top: 14mm; left: 14mm; border-right: none; border-bottom: none; border-radius: 15px 0 0 0; }
.cover-corner.tr { top: 14mm; right: 14mm; border-left: none; border-bottom: none; border-radius: 0 15px 0 0; }
.cover-corner.bl { bottom: 14mm; left: 14mm; border-right: none; border-top: none; border-radius: 0 0 0 15px; }
.cover-corner.br { bottom: 14mm; right: 14mm; border-left: none; border-top: none; border-radius: 0 0 15px 0; }
.cover-content { position: relative; z-index: 10; display: flex; flex-direction: column; align-items: center; padding: 30px; margin-top: -40px; }
.cover-logo-wrap { width: 350px; max-width: 85vw; height: 350px; max-height: 85vw; position: relative; margin-bottom: 25px; }
.cover-logo-glow { position: absolute; top: -30px; left: -30px; right: -30px; bottom: -30px; background: radial-gradient(circle, rgba(255,140,0,0.7) 0%, rgba(255,140,0,0.3) 40%, transparent 70%); border-radius: 50%; }
.cover-logo-ring { position: absolute; top: -15px; left: -15px; right: -15px; bottom: -15px; border: 6px solid rgba(255,215,0,0.7); border-radius: 50%; }
.cover-logo-ring2 { position: absolute; top: -25px; left: -25px; right: -25px; bottom: -25px; border: 4px solid rgba(255,215,0,0.3); border-radius: 50%; }
.cover-logo { width: 100%; height: 100%; object-fit: contain; border-radius: 50%; border: 8px solid #ffd700; background: rgba(255,255,255,0.98); padding: 12px; box-shadow: 0 0 100px rgba(255,140,0,1), 0 0 200px rgba(255,140,0,0.4), 0 20px 60px rgba(0,0,0,0.8); position: relative; z-index: 2; }
.cover-mandal-name { font-size: 30px; white-space: normal; font-weight: 900; color: #ffd700; text-align: center; letter-spacing: 2px; text-shadow: 0 0 30px rgba(255,215,0,0.6), 0 3px 10px rgba(0,0,0,0.7); line-height: 1.4; border-left: 6px solid #dc2626; border-right: 6px solid #dc2626; padding: 10px 20px; margin-top: 10px; }
.cover-divider { width: 350px; max-width: 80vw; height: 4px; background: linear-gradient(90deg, transparent, #ffd700, #ff8c00, #ffd700, transparent); margin: 18px auto; border-radius: 3px; box-shadow: 0 0 15px rgba(255,215,0,0.4); }
.cover-subtitle { font-size: 24px; font-weight: 700; color: #ff8c00; text-align: center; letter-spacing: 2px; margin-bottom: 0; text-shadow: 0 0 20px rgba(255,140,0,0.5); }
.cover-tagline { font-size: 24px; font-weight: 700; color: #ff8c00; text-align: center; letter-spacing: 2px; text-shadow: 0 0 20px rgba(255,140,0,0.5); margin-bottom: 0; }
.cover-year-box { margin-top: 30px; padding: 15px 50px; border: 3px solid #ffd700; border-radius: 35px; background: linear-gradient(135deg, rgba(255,140,0,0.15), rgba(255,215,0,0.1)); text-align: center; box-shadow: 0 0 30px rgba(255,215,0,0.2); }
.cover-year-label { font-size: 30px; font-weight: 800; color: #ffd700; display: inline-block; margin-right: 12px; margin-bottom: 0; letter-spacing: 1px; text-shadow: 0 0 25px rgba(255,215,0,0.5); }
.cover-year-val { font-size: 30px; font-weight: 800; color: #ffd700; text-shadow: 0 0 25px rgba(255,215,0,0.5); }
.cover-footer { position: absolute; bottom: 15mm; left: 0; right: 0; text-align: center; z-index: 10; }
.cover-footer-om { font-size: 20px; color: #ffd700; margin-bottom: 8px; letter-spacing: 3px; }
.cover-footer p { font-size: 10px; color: #8b7355; letter-spacing: 1.5px; line-height: 1.6; }
</style>
</head><body>
<div class="cover-page">
  <div class="cover-outer-border"></div>
  <div class="cover-inner-border"></div>
  <div class="cover-corner tl"></div><div class="cover-corner tr"></div><div class="cover-corner bl"></div><div class="cover-corner br"></div>
  <div class="cover-content">
    <div class="cover-logo-wrap"><div class="cover-logo-glow"></div><div class="cover-logo-ring"></div><div class="cover-logo-ring2"></div><img src="${logoSrc}" alt="Logo" class="cover-logo" onerror="this.style.display='none'"></div>
    <div class="cover-mandal-name">${s.orgName.includes('शिवसृष्टी') ? '<div style="font-size:1.5em; color:#ffd700; text-shadow:0 0 25px rgba(255,140,0,1); line-height:1.2; margin-bottom:12px;">शिवसृष्टी</div><div style="font-size:0.9em; color:#ffcc00; margin-bottom:5px;">सार्वजनिक उत्सव मंडळ</div>' : s.orgName}</div>
    <div class="cover-divider"></div>
    <div style="display:flex;align-items:baseline;justify-content:center;flex-wrap:wrap;gap:15px;margin-bottom:10px;text-align:center;">
      <span class="cover-subtitle" style="display:inline;">${s.subtitle}</span>
      <span class="cover-tagline" style="display:inline;">${s.tagline === 'Ganpati Festival Cashbook' ? 'वर्ष : आठवे' : s.tagline}</span>
    </div>
    <div class="cover-year-box"><span class="cover-year-label">सन</span><span class="cover-year-val">${year}</span></div>
  </div>
  <div class="cover-footer">
    <div class="cover-footer-om">\u0950 \u0917\u0923 \u0917\u0923\u092A\u0924\u092F\u0947 \u0928\u092E\u0903</div>
    <p>Developed by | Dhananjay Ranate</p>
  </div>
</div>
</body></html>`;
        }

        async function generateClientMergedPDF(filename, year, download, pdfSubtitle, pdfTagline, pdfOrgName) {
            try {
                const logoDataURL = await window.loadLogo();
                const coverHTML = createCoverHTML(year, logoDataURL, pdfSubtitle, pdfTagline, pdfOrgName);
                const iframe = document.createElement('iframe');
                iframe.style.position = 'absolute';
                iframe.style.left = '-9999px';
                iframe.style.top = '-9999px';
                iframe.style.width = '794px';
                iframe.style.height = '1123px';
                iframe.style.border = 'none';
                document.body.appendChild(iframe);
                iframe.contentDocument.write(coverHTML);
                iframe.contentDocument.close();
                const imgs = iframe.contentDocument.querySelectorAll('img');
                await Promise.all([...imgs].map(img => new Promise(r => {
                    if (img.complete) r(); else { img.onload = r; img.onerror = r; setTimeout(r, 2000); }
                })));
                try { await iframe.contentDocument.fonts.ready; } catch(e) {}
                await new Promise(r => setTimeout(r, 500));
                const canvas = await html2canvas(iframe.contentDocument.body, {
                    scale: 2, windowWidth: 794, width: 794, useCORS: true, backgroundColor: '#ffffff', allowTaint: true
                });
                document.body.removeChild(iframe);
                const resp = await fetch((typeof API_URL !== 'undefined' ? API_URL : '') + '/api/cashbook/view/' + filename);
                const uploadBytes = await resp.arrayBuffer();
                const { PDFDocument } = PDFLib;
                const mergedPdf = await PDFDocument.create();
                const coverPage = mergedPdf.addPage([595.28, 841.89]);
                const coverImage = await mergedPdf.embedJpg(canvas.toDataURL('image/jpeg', 0.95));
                coverPage.drawImage(coverImage, { x: 0, y: 0, width: 595.28, height: 841.89 });
                const existingPdf = await PDFDocument.load(uploadBytes);
                const indices = existingPdf.getPageIndices();
                const uPgs = await mergedPdf.copyPages(existingPdf, indices);
                uPgs.forEach(p => mergedPdf.addPage(p));
                const mergedBytes = await mergedPdf.save({ useObjectStreams: false });
                const blob = new Blob([mergedBytes], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                if (download) {
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'Ganpati_Cashbook_Shivsrushti_' + year + '.pdf';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    setTimeout(() => URL.revokeObjectURL(url), 10000);
                } else {
                    window.open(url, '_blank');
                }
            } catch (error) {
                console.error('PDF merge error:', error);
                alert('Error generating PDF. Make sure server is running!');
            }
        }

        async function viewMergedPDF(filename, year, subtitle, tagline, orgName) {
            await generateClientMergedPDF(filename, year, false, subtitle, tagline, orgName);
        }

        async function downloadMergedPDF(filename, year, subtitle, tagline, orgName) {
            await generateClientMergedPDF(filename, year, true, subtitle, tagline, orgName);
        }

        async function renamePDF(filename, currentName) {
            const newName = prompt('Enter new display name:', currentName);
            if (!newName || !newName.trim() || newName === currentName) return;
            try {
                const response = await fetch(`/api/uploaded-pdfs/${filename}/rename`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ displayName: newName.trim() })
                });
                const result = await response.json();
                if (result.success) {
                    loadUploadedPDFs();
                } else {
                    alert('Error: ' + result.error);
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        }

        async function togglePDFHomeVisibility(filename, showOnHome) {
            try {
                const response = await fetch(`/api/uploaded-pdfs/${filename}/visibility`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ showOnHome })
                });
                const result = await response.json();
                if (result.success) {
                    loadUploadedPDFs();
                } else {
                    alert('Error: ' + result.error);
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        }

        async function deletePDF(filename) {
            if (!confirm(`Delete ${filename}?`)) return;
            try {
                const response = await fetch(`/api/uploaded-pdfs/${filename}`, { method: 'DELETE' });
                const result = await response.json();
                if (result.success) {
                    loadUploadedPDFs();
                } else {
                    alert('Error: ' + result.error);
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        }

        // Per-PDF cover settings editor
        let editCoverFilename = '';
        function editPdfCover(filename, displayName, subtitle, tagline, orgName) {
            editCoverFilename = filename;
            document.getElementById('editCoverFilename').textContent = displayName || filename;
            document.getElementById('editCoverOrgName').value = orgName || '';
            document.getElementById('editCoverSubtitle').value = subtitle || '';
            document.getElementById('editCoverTagline').value = tagline || '';
            document.getElementById('editCoverStatus').style.display = 'none';
            document.getElementById('editCoverModal').style.display = 'flex';
        }
        function closeEditCoverModal() {
            document.getElementById('editCoverModal').style.display = 'none';
        }
        async function saveEditCover() {
            const orgName = document.getElementById('editCoverOrgName').value.trim();
            const subtitle = document.getElementById('editCoverSubtitle').value.trim();
            const tagline = document.getElementById('editCoverTagline').value.trim();
            const status = document.getElementById('editCoverStatus');
            if (!orgName || !subtitle || !tagline) {
                status.style.color = '#ef4444';
                status.textContent = 'All three fields required!';
                status.style.display = 'block';
                return;
            }
            try {
                const response = await fetch(`/api/uploaded-pdfs/${editCoverFilename}/cover`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orgName, subtitle, tagline })
                });
                const result = await response.json();
                if (result.success) {
                    status.style.color = '#22c55e';
                    status.textContent = 'Cover settings saved!';
                    status.style.display = 'block';
                    setTimeout(() => { closeEditCoverModal(); loadUploadedPDFs(); }, 1000);
                } else {
                    status.style.color = '#ef4444';
                    status.textContent = 'Error: ' + result.error;
                    status.style.display = 'block';
                }
            } catch (error) {
                status.style.color = '#ef4444';
                status.textContent = 'Error: ' + error.message;
                status.style.display = 'block';
            }
        }
        
        // Expose PDF functions globally
        window.deletePDF = deletePDF;
        window.uploadPDF = uploadPDF;
        window.viewMergedPDF = viewMergedPDF;
        window.downloadMergedPDF = downloadMergedPDF;
        window.renamePDF = renamePDF;
        window.editPdfCover = editPdfCover;

    

        function populatePDFSettingsYear() {
            const sel = document.getElementById('pdfSettingsYear');
            const tabs = document.querySelectorAll('.year-tab[data-year]');
            const years = [];
            tabs.forEach(t => { const y = t.getAttribute('data-year'); if (y !== 'all') years.push(y); });
            const current = sel.value;
            sel.innerHTML = '<option value="">Select Year</option>' + years.map(y => '<option value="' + y + '">' + y + '</option>').join('');
            if (current && years.includes(current)) sel.value = current;
            else if (years.length > 0) sel.value = years[0];
            sel.onchange = loadPDFSettingsForYear;
        }
        function loadPDFSettingsForYear() {
            const year = document.getElementById('pdfSettingsYear').value;
            if (!year) return;
            const s = getPDFSettings(year);
            document.getElementById('pdfOrgName').value = s.orgName;
            document.getElementById('pdfSubtitle').value = s.subtitle;
            document.getElementById('pdfTagline').value = s.tagline;
            document.getElementById('pdfHeaderOrgName').value = s.headerOrgName || '';
            document.getElementById('pdfHeaderSubtitle').value = s.headerSubtitle || '';
        }
        function openPDFSettingsModal() {
            populatePDFSettingsYear();
            const year = document.getElementById('pdfSettingsYear').value;
            if (year) loadPDFSettingsForYear();
            document.getElementById('pdfSettingsStatus').style.display = 'none';
            document.getElementById('pdfSettingsModal').style.display = 'flex';
        }
        function closePDFSettingsModal() {
            document.getElementById('pdfSettingsModal').style.display = 'none';
        }
        function onSavePDFSettings() {
            const year = document.getElementById('pdfSettingsYear').value;
            if (!year) {
                const status = document.getElementById('pdfSettingsStatus');
                status.style.color = '#ef4444';
                status.textContent = 'Please select a year!';
                status.style.display = 'block';
                return;
            }
            const orgName = document.getElementById('pdfOrgName').value.trim();
            const subtitle = document.getElementById('pdfSubtitle').value.trim();
            const tagline = document.getElementById('pdfTagline').value.trim();
            const headerOrgName = document.getElementById('pdfHeaderOrgName').value.trim();
            const headerSubtitle = document.getElementById('pdfHeaderSubtitle').value.trim();
            if (!orgName || !subtitle || !tagline) {
                const status = document.getElementById('pdfSettingsStatus');
                status.style.color = '#ef4444';
                status.textContent = 'Cover fields (Org Name, Marathi Title, Tagline) are required!';
                status.style.display = 'block';
                return;
            }
            window.savePDFSettings(year, { orgName, subtitle, tagline, headerOrgName, headerSubtitle });
            const status = document.getElementById('pdfSettingsStatus');
            status.style.color = '#22c55e';
            status.textContent = 'Settings saved for ' + year + '!';
            status.style.display = 'block';
            setTimeout(closePDFSettingsModal, 1200);
        }

        window.switchAdminTab = switchAdminTab;
        function switchAdminTab(tabId, pushState = true) {
            if (pushState) {
                const currentHash = window.location.hash.replace('#', '');
                const isCurrentlyHome = !currentHash || currentHash === 'tab-home';
                
                if (isCurrentlyHome && tabId !== 'tab-home') {
                    history.pushState(null, '', '#' + tabId);
                } else if (!isCurrentlyHome && tabId !== 'tab-home') {
                    history.replaceState(null, '', '#' + tabId);
                } else if (tabId === 'tab-home' && !isCurrentlyHome) {
                    history.pushState(null, '', '#tab-home');
                }
            }

            document.querySelectorAll('.admin-tab-content').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.btn-tab').forEach(el => el.classList.remove('active'));
            
            const tabContent = document.getElementById(tabId);
            if(tabContent) tabContent.style.display = 'block';
            
            const btn = document.getElementById('btn-' + tabId);
            if(btn) btn.classList.add('active');
            
            sessionStorage.setItem('activeAdminTab', tabId);
            
            if (tabId === 'tab-committee' && typeof loadCommitteeMembers === 'function') {
                loadCommitteeMembers();
            }
            if (tabId === 'tab-aarti' && typeof loadAartiData === 'function') {
                loadAartiData();
            }
            if (tabId === 'tab-gallery' && typeof loadAdminAlbums === 'function') {
                loadAdminAlbums();
            }
            if (tabId === 'tab-niyojan' && typeof loadNiyojanAdmin === 'function') {
                loadNiyojanAdmin();
            }
        }
        
        window.addEventListener('popstate', function(e) {
            const hash = window.location.hash.replace('#', '');
            if (hash) {
                switchAdminTab(hash, false);
            } else {
                switchAdminTab('tab-home', false);
            }
        });

        async function saveCommitteeMember(role) {
            const statusElem = document.getElementById(role + 'Status');
            statusElem.style.color = '#fff';
            statusElem.textContent = 'Saving...';
            
            const name = document.getElementById(role + 'Name').value.trim();
            const mobile = document.getElementById(role + 'Mobile').value.trim();
            const designationElem = document.getElementById(role + 'Designation');
            const designation = designationElem ? designationElem.value.trim() : '';
            const photoInput = document.getElementById(role + 'PhotoInput');
            
            if (!name) {
                statusElem.style.color = '#ff6b6b';
                statusElem.textContent = 'Name is required!';
                return;
            }
            
            let orderNum = 99;
            if (role === 'president') orderNum = 1;
            else if (role === 'treasurer') orderNum = 2;
            else if (role.startsWith('member')) orderNum = 2 + parseInt(role.replace('member', ''), 10);
            
            const formData = new FormData();
            formData.append('role', role);
            formData.append('name', name);
            formData.append('mobile', mobile);
            formData.append('designation', designation);
            formData.append('order', orderNum);
            
            if (photoInput.files.length > 0) {
                formData.append('photo', photoInput.files[0]);
            }
            
            try {
                const response = await fetch('/api/committee', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                
                if (result.success) {
                    statusElem.style.color = '#10b981';
                    statusElem.textContent = 'Saved Successfully!';
                    photoInput.value = ''; // clear file input
                    setTimeout(() => statusElem.textContent = '', 3000);
                } else {
                    statusElem.style.color = '#ff6b6b';
                    statusElem.textContent = 'Error: ' + result.error;
                }
            } catch (error) {
                console.error("Save committee member error:", error);
                statusElem.style.color = '#ff6b6b';
                statusElem.textContent = 'Network/Server Error! (Check photo size or retry)';
            }
        }

        async function deleteCommitteeMember(role) {
            if (!confirm(`Are you sure you want to delete ${role}?`)) return;
            
            const statusElem = document.getElementById(role + 'Status');
            statusElem.style.color = '#fff';
            statusElem.textContent = 'Deleting...';
            
            try {
                const response = await fetch(`/api/committee/${role}`, {
                    method: 'DELETE'
                });
                const result = await response.json();
                
                if (result.success) {
                    statusElem.style.color = '#10b981';
                    statusElem.textContent = 'Deleted Successfully!';
                    document.getElementById(role + 'Name').value = '';
                    document.getElementById(role + 'Mobile').value = '';
                    const photoInput = document.getElementById(role + 'PhotoInput');
                    if(photoInput) photoInput.value = '';
                    setTimeout(() => statusElem.textContent = '', 3000);
                } else {
                    statusElem.style.color = '#ff6b6b';
                    statusElem.textContent = 'Error: ' + result.error;
                }
            } catch (error) {
                console.error("Delete committee member error:", error);
                statusElem.style.color = '#ff6b6b';
                statusElem.textContent = 'Network/Server Error!';
            }
        }

        async function loadCommitteeMembers() {
            try {
                const response = await fetch('/api/committee');
                const result = await response.json();
                if (result.success) {
                    // First ensure we have enough slots for all fetched members
                    let maxMemberNum = 9;
                    result.data.forEach(member => {
                        if (member.role && member.role.startsWith('member')) {
                            const num = parseInt(member.role.replace('member', ''), 10);
                            if (num > maxMemberNum) maxMemberNum = num;
                        }
                    });
                    
                    while (typeof currentMemberCount !== 'undefined' && currentMemberCount < maxMemberNum) {
                        addNewMemberSlot();
                    }

                    // Now populate the data
                    result.data.forEach(member => {
                        const role = member.role;
                        if (document.getElementById(role + 'Name')) {
                            document.getElementById(role + 'Name').value = member.name || '';
                        }
                        if (document.getElementById(role + 'Mobile')) {
                            document.getElementById(role + 'Mobile').value = member.mobile || '';
                        }
                        if (document.getElementById(role + 'Designation')) {
                            document.getElementById(role + 'Designation').value = member.designation || '';
                        }
                    });
                }
            } catch (error) {
                console.error("Error loading committee", error);
            }
        }

        // Close modals on overlay click
        document.addEventListener('click', function(e) {
            const pm = document.getElementById('pdfSettingsModal');
            if (e.target === pm) closePDFSettingsModal();
            const cm = document.getElementById('editCoverModal');
            if (e.target === cm) closeEditCoverModal();
        });
    
// ==========================================
// MAHA AARTI MANAGEMENT
// ==========================================

async function loadAartiData() {
    try {
        const res = await fetch('/api/aarti');
        const aartis = await res.json();
        
        const tbody = document.getElementById('aartiTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (aartis.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">कोणतीही नोंद आढळली नाही.</td></tr>';
            return;
        }
        
        aartis.forEach(aarti => {
            const tr = document.createElement('tr');
            
            const formattedDate = formatDate(aarti.date);
            
            tr.innerHTML = `
                <td>${formattedDate}</td>
                <td>${aarti.timeOfDay}</td>
                <td>${aarti.name}</td>
                <td>${aarti.phone || '-'}</td>
                <td>
                    <button class="delete-btn" onclick="deleteAarti('${aarti._id}')" style="padding: 5px 10px; font-size: 12px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) {
        console.error('Failed to load aarti data:', e);
    }
}
// ==========================================
// GALLERY MANAGEMENT
// ==========================================
async function loadAdminAlbums() {
    const container = document.getElementById('albumsListContainer');
    try {
        const res = await fetch('/api/gallery/admin');
        const data = await res.json();
        if (data.success) {
            if (data.albums.length === 0) {
                container.innerHTML = '<p style="color:white;text-align:center;">कोणतेही अल्बम नाहीत. नवीन अल्बम तयार करा.</p>';
                return;
            }
            container.innerHTML = data.albums.map(album => `
                <div class="admin-card" style="margin-bottom: 20px; padding: 15px; background: rgba(0,0,0,0.4); border-radius: 12px; border: 1px solid rgba(212,175,55,0.3); width: 100%; box-sizing: border-box; overflow: hidden;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 15px;">
                        <h3 style="color: #ffeb3b; margin:0; word-break: break-word; font-size: 16px; flex: 1; min-width: 160px;">${album.title} <span style="font-size:13px; color:#ccc;">(Photos: ${album.photos.length})</span></h3>
                        <button class="delete-btn" onclick="deleteAlbum('${album._id}')" style="background:#f44336; border:none; color:white; padding:6px 12px; border-radius:5px; cursor:pointer; font-size: 13px; white-space: nowrap;"><i class="fas fa-trash"></i> Delete Album</button>
                    </div>
                    
                    <form onsubmit="handleUploadPhotos(event, '${album._id}')" style="display:flex; flex-wrap: wrap; gap:10px; align-items:center; margin-bottom: 15px; width: 100%; box-sizing: border-box;">
                        <input type="file" multiple accept="image/*" id="photos_${album._id}" required style="color: white; flex: 1; min-width: 180px; max-width: 100%; font-size: 13px; box-sizing: border-box; background: rgba(255,255,255,0.05); padding: 6px; border-radius: 6px; border: 1px dashed rgba(255,255,255,0.2);">
                        <button type="submit" class="btn btn-primary" style="padding: 8px 16px; font-size:14px; white-space: nowrap;"><i class="fas fa-upload"></i> Upload Photos</button>
                        <span id="uploadStatus_${album._id}" style="color:#ffeb3b; font-size:14px; width: 100%;"></span>
                    </form>
                    
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        ${album.photos.map(photo => `
                            <div style="position:relative; width: 100px; height: 100px; border-radius: 8px; overflow: hidden; border: 1px solid rgba(255,255,255,0.2);">
                                <img src="${photo.photoData}" style="width:100%; height:100%; object-fit:cover;">
                                <button onclick="deletePhoto('${album._id}', '${photo._id}')" style="position:absolute; top:2px; right:2px; background:rgba(244,67,54,0.9); color:white; border:none; border-radius:50%; width:24px; height:24px; cursor:pointer;"><i class="fas fa-times"></i></button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        }
    } catch (e) {
        console.error(e);
        container.innerHTML = '<p style="color:red;text-align:center;">Failed to load albums.</p>';
    }
}

async function handleCreateAlbum(e) {
    e.preventDefault();
    const title = document.getElementById('albumTitle').value;
    const order = document.getElementById('albumOrder').value;
    const status = document.getElementById('albumStatus');
    status.innerText = "Creating...";
    status.style.color = "#ffeb3b";
    
    try {
        const res = await fetch('/api/gallery/album', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({title, order})
        });
        const data = await res.json();
        if (data.success) {
            status.innerText = "Album created successfully!";
            status.style.color = "#4caf50";
            document.getElementById('addAlbumForm').reset();
            loadAdminAlbums();
            setTimeout(() => { status.innerText = ""; }, 3000);
        }
    } catch (err) {
        status.innerText = "Error: " + err.message;
        status.style.color = "red";
    }
}

async function deleteAlbum(id) {
    if(!confirm("Are you sure you want to delete this album and ALL its photos?")) return;
    try {
        await fetch('/api/gallery/album/' + id, { method: 'DELETE' });
        loadAdminAlbums();
    } catch (e) { console.error(e); }
}

async function handleUploadPhotos(e, albumId) {
    e.preventDefault();
    const input = document.getElementById('photos_' + albumId);
    const status = document.getElementById('uploadStatus_' + albumId);
    
    if (input.files.length === 0) return;
    
    const total = input.files.length;
    let successCount = 0;
    
    status.innerText = `Uploading 0 of ${total}...`;
    status.style.color = "#ffeb3b";
    
    for (let i = 0; i < total; i++) {
        const formData = new FormData();
        formData.append('photos', input.files[i]);
        
        try {
            status.innerText = `Uploading ${i + 1} of ${total}...`;
            const res = await fetch('/api/gallery/album/' + albumId + '/photos', {
                method: 'POST',
                body: formData
            });
            
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || res.statusText);
            }
            
            const data = await res.json();
            if (data.success) {
                successCount++;
            } else {
                console.error("Upload failed for file", i, data.error);
            }
        } catch (err) {
            console.error("Error uploading file", i, err);
            status.style.color = "#ff5252";
            status.innerText = `Error on photo ${i + 1}. Stopping.`;
            break;
        }
    }
    
    if (successCount === total) {
        status.style.color = "#4caf50";
        status.innerText = "All photos uploaded successfully!";
    } else if (successCount > 0) {
        status.innerText = `Uploaded ${successCount} of ${total} photos.`;
    }
    
    setTimeout(() => { status.innerText = ""; status.style.color = "#ffeb3b"; }, 3000);
    input.value = ""; // clear input
    loadAdminAlbums();
}

async function deletePhoto(albumId, filename) {
    if(!confirm("Delete this photo?")) return;
    try {
        await fetch(`/api/gallery/album/${albumId}/photo/${filename}`, { method: 'DELETE' });
        loadAdminAlbums();
    } catch (e) { console.error(e); }
}

// ==========================================
// AARTI MEDIA
// ==========================================
async function handleUploadAartiMedia(e) {
    e.preventDefault();
    const statusDiv = document.getElementById('aartiMediaStatus');
    const audioFile = document.getElementById('aartiAudioFile').files[0];
    const pdfFile = document.getElementById('aartiPdfFile').files[0];

    if (!audioFile && !pdfFile) {
        statusDiv.style.color = '#ff5252';
        statusDiv.innerText = 'कृपया किमान एक फाइल (ऑडिओ किंवा PDF) निवडा.';
        return;
    }

    statusDiv.style.color = '#ffeb3b';
    statusDiv.innerText = 'अपलोड होत आहे... कृपया प्रतीक्षा करा...';

    const formData = new FormData();
    if (audioFile) formData.append('aarti_audio', audioFile);
    if (pdfFile) formData.append('aarti_pdf', pdfFile);

    try {
        const res = await fetch('/api/settings/aarti-media', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        if (data.success) {
            statusDiv.style.color = '#4caf50';
            statusDiv.innerText = 'मीडिया यशस्वीरित्या सेव्ह झाला!';
            setTimeout(() => { statusDiv.innerText = ''; }, 3000);
        } else {
            throw new Error(data.error);
        }
    } catch (err) {
        statusDiv.style.color = '#ff5252';
        statusDiv.innerText = 'चूक: ' + err.message;
    }
}
async function handleAddAarti(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();

    const nameVal = document.getElementById('aartiName').value;
    const dateVal = document.getElementById('aartiDate').value;
    const timeVal = document.getElementById('aartiTime').value;
    if (!nameVal || !nameVal.trim() || !dateVal || !dateVal.trim() || !timeVal || !timeVal.trim()) {
        alert('कृपया संपूर्ण नाव आणि तारीख भरणे आवश्यक आहे.');
        return false;
    }
    
    const btn = document.getElementById('aartiSubmitBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    
    const data = {
        name: document.getElementById('aartiName').value,
        date: document.getElementById('aartiDate').value,
        timeOfDay: document.getElementById('aartiTime').value,
        phone: document.getElementById('aartiPhone').value,
        pujaDetails: document.getElementById('aartiPujaDetails').value
    };
    
    try {
        const res = await fetch('/api/aarti', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (res.ok) {
            alert('महाआरती यशस्वीरित्या नोंदवली गेली!');
            document.getElementById('addAartiForm').reset();
            loadAartiData();
        } else {
            alert('काहीतरी चूक झाली.');
        }
    } catch (e) {
        console.error('Error adding aarti:', e);
        alert('Server Error.');
    } finally {
        btn.disabled = false;
        btn.textContent = 'माहिती सेव्ह करा';
    }
}

async function deleteAarti(id) {
    if (!confirm('तुम्हाला खात्री आहे का की तुम्हाला ही नोंद हटवायची आहे?')) return;
    
    try {
        const res = await fetch(`/api/aarti/${id}`, { method: 'DELETE' });
        if (res.ok) {
            loadAartiData();
        } else {
            alert('Failed to delete.');
        }
    } catch (e) {
        console.error('Error deleting aarti:', e);
    }
}

    
// ==========================================
// NIYOJAN LOGIC
// ==========================================
async function loadNiyojanAdmin() {
    try {
        const response = await fetch('/api/niyojan');
        const list = await response.json();
        const tbody = document.getElementById('niyojanList');
        tbody.innerHTML = '';
        
        list.forEach(item => {
            const tr = document.createElement('tr');
            
            const formattedDate = formatDate(item.date);
            
            tr.innerHTML = `
                <td>${formattedDate}</td>
                <td>${item.time}</td>
                <td><strong>${item.title}</strong><br><small style="color: #aaa;">${item.description || ''}</small></td>
                <td>
                    <button class="btn-action delete" onclick="deleteNiyojan('${item._id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) {
        console.error('Error loading niyojan:', e);
    }
}

async function addNiyojan(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();

    const dtVal = document.getElementById('niyojanDate').value;
    const tmVal = document.getElementById('niyojanTime').value;
    const ttVal = document.getElementById('niyojanTitle').value;
    if (!dtVal || !dtVal.trim() || !tmVal || !tmVal.trim() || !ttVal || !ttVal.trim()) {
        alert('कृपया तारीख, वेळ आणि कार्यक्रमाचे नाव भरणे आवश्यक आहे.');
        return false;
    }

    const payload = {
        date: document.getElementById('niyojanDate').value,
        time: document.getElementById('niyojanTime').value,
        title: document.getElementById('niyojanTitle').value,
        description: document.getElementById('niyojanDescription').value
    };
    
    try {
        const res = await fetch('/api/niyojan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            document.getElementById('niyojanForm').reset();
            loadNiyojanAdmin();
            alert('नियोजन ऍड केले!');
        } else {
            alert('नियोजन ऍड करताना एरर आली.');
        }
    } catch (e) {
        console.error(e);
        alert('Server error.');
    }
}

async function deleteNiyojan(id) {
    if(!confirm('हे नियोजन डिलीट करायचे?')) return;
    try {
        const res = await fetch(`/api/niyojan/${id}`, { method: 'DELETE' });
        if (res.ok) {
            loadNiyojanAdmin();
        } else {
            alert('डिलीट करताना एरर आली.');
        }
    } catch(e) {
        console.error(e);
    }
}

    