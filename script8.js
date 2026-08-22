
    const API_URL = '';
    let uploadedPDFsData = [];
    let uploadedPDFsPage = 0;
    let yearVisibilityMap = {};
    let appSettings = {};

    function getPDFSettings(year) {
        const defaults = { orgName: 'शिवसृष्टी सार्वजनिक उत्सव मंडळ', subtitle: 'गणेश उत्सव कॅशबुक', tagline: 'वर्ष : आठवे', headerOrgName: '', headerSubtitle: '' };
        try {
            const key = year ? 'pdfCustomSettings_' + year : 'pdfCustomSettings';
            const stored = appSettings[key] || {};
            if (Object.keys(stored).length > 0) return { ...defaults, ...stored };
            if (year) {
                const global = appSettings['pdfCustomSettings'] || {};
                if (Object.keys(global).length > 0) return { ...defaults, ...global };
            }
            return defaults;
        } catch (e) {
            return defaults;
        }
    }

    function getPDFsPerPage() {
        return window.innerWidth <= 768 ? 2 : 5;
    }

    let currentYearEntries = [];
    let currentYearPage = 1;
    let currentSelectedYear = '';

    function initScrollReveal() {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => observer.observe(el));
    }

    function createSparkles() {
        const container = document.getElementById('particles');
        if (!container) return;
        const colors = ['gold', 'purple'];
        const sizes = ['tiny', '', 'big'];
        for (let i = 0; i < 15; i++) {
            const el = document.createElement('div');
            el.className = 'sparkle ' + colors[i % 2] + ' ' + sizes[i % 3];
            el.style.left = Math.random() * 100 + '%';
            el.style.setProperty('--dur', (10 + Math.random() * 15) + 's');
            el.style.setProperty('--delay', (Math.random() * 15) + 's');
            el.style.setProperty('--max-opacity', (0.4 + Math.random() * 0.5));
            container.appendChild(el);
        }
        for (let i = 0; i < 10; i++) {
            const el = document.createElement('div');
            el.className = 'sparkle-star';
            el.style.left = Math.random() * 100 + '%';
            el.style.top = Math.random() * 100 + '%';
            el.style.animationDelay = (Math.random() * 5) + 's';
            el.style.animationDuration = (2 + Math.random() * 4) + 's';
            container.appendChild(el);
        }
    }

    let currentTab = 'home';
    let isHistoryPushed = false;

    document.addEventListener('DOMContentLoaded', function() {
        
// Countdown Timer Logic
function initCountdown() {
    // Exact Date for Ganeshotsav 2026: September 10, 2026 00:00:00
    const festivalDate = new Date('2026-09-10T00:00:00').getTime();
    
    const updateTimer = () => {
        const now = new Date().getTime();
        const distance = festivalDate - now;
        
        if (distance < 0) {
            const display = document.getElementById('countdownTimerDisplay');
            if (display) {
                display.innerHTML = '<h3 style="color: #28a745; font-size: 1.5rem; width: 100%;">उत्सवाला सुरुवात झाली आहे! मंगलमूर्ती मोरया!</h3>';
            }
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        const dEl = document.getElementById('cd-days');
        const hEl = document.getElementById('cd-hours');
        const mEl = document.getElementById('cd-mins');
        const sEl = document.getElementById('cd-secs');
        
        if (dEl) dEl.innerText = days;
        if (hEl) hEl.innerText = hours.toString().padStart(2, '0');
        if (mEl) mEl.innerText = minutes.toString().padStart(2, '0');
        if (sEl) sEl.innerText = seconds.toString().padStart(2, '0');
    };
    
    updateTimer();
    setInterval(updateTimer, 1000);
}
initCountdown();

    
async function loadHomeGalleryPreview() {
    try {
        const response = await fetch('/api/gallery');
        if (response.ok) {
            const data = await response.json();
            const grid = document.getElementById('homeGalleryPreviewGrid');
            if (grid && data.success && data.data && data.data.length > 0) {
                let html = '';
                // Limit to 6 photos
                const photos = data.data.slice(0, 6);
                photos.forEach(photo => {
                    html += `
                    <div style="width: 100%; aspect-ratio: 1; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.4); cursor: pointer; transition: transform 0.3s;" onclick="openLightbox('${photo.url}')" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        <img src="${photo.url}" alt="${photo.description || 'Gallery image'}" style="width: 100%; height: 100%; object-fit: cover; loading="lazy">
                    </div>`;
                });
                grid.innerHTML = html;
            } else if (grid) {
                grid.innerHTML = '<p style="color: #ccc; grid-column: 1 / -1;">छायाचित्रे उपलब्ध नाहीत.</p>';
            }
        }
    } catch (e) {
        console.error('Failed to load gallery preview:', e);
        const grid = document.getElementById('homeGalleryPreviewGrid');
        if (grid) grid.innerHTML = '<p style="color: #ccc; grid-column: 1 / -1;">छायाचित्रे लवकरच उपलब्ध होतील.</p>';
    }
}

    loadHomeGalleryPreview();
    setupNavigation();
        const initialTab = window.location.hash.replace('#', '') || 'home';
        switchTab(initialTab, false);
        loadUploadedPDFsHome();
        renderVisibleYearSections();
        initScrollReveal();
        createSparkles();
        loadAppearanceSettingsHome();
        loadAartiDataHome();
        loadNiyojanDataHome();
        
        loadCommitteeDataHome();

    // Compact Sticky Header Logic
    window.addEventListener('scroll', () => {
        const compactHeader = document.getElementById('compactStickyHeader');
        if (compactHeader) {
            if (window.scrollY > 250) {
                compactHeader.style.transform = 'translateY(0)';
            } else {
                compactHeader.style.transform = 'translateY(-100%)';
            }
        }
    });
        
        // Secret Admin Login
        let logoClickCount = 0;
        let logoClickTimer;
        const secretAdminLogos = [
            document.getElementById('secretAdminLogo'),
            document.getElementById('desktopTopHeaderImg'),
            document.getElementById('mobileTopHeaderImg'),
            document.querySelector('.footer-mandal-name-img')
        ];
        secretAdminLogos.forEach(logo => {
            if (logo) {
                logo.addEventListener('click', () => {
                    logoClickCount++;
                    clearTimeout(logoClickTimer);
                    if (logoClickCount >= 5) {
                        window.location.href = 'admin.html?v=fixed';
                    }
                    // Reset count after 2 seconds of inactivity
                    logoClickTimer = setTimeout(() => {
                        logoClickCount = 0;
                    }, 2000);
                });
            }
        });
    });

    function switchTab(tabName, pushState = true) {
        currentTab = tabName;
        window.scrollTo(0, 0);
        const navMenu = document.getElementById('navLinks');
        if (navMenu) navMenu.classList.remove('active');
        
        const heroContainer = document.getElementById('heroSectionContainer');
        const ganeshotsavHeader = document.getElementById('ganeshotsavHeader');
        const cashbookContainer = document.getElementById('visibleYearsContainer');
        const prevYearsContainer = document.getElementById('previousYearsContainer');
        const siteFooter = document.getElementById('siteFooter');
        const mainContainer = document.getElementById('mainTabContainer') || document.querySelector('.container');
        const donationSection = document.getElementById('donationSection');
        const committeeSection = document.getElementById('committeeSection');
        const contactSection = document.getElementById('contactSection');
        const niyojanSection = document.getElementById('niyojanSection');
        const aartiSection = document.getElementById('aartiSection');

        const showEl = (el) => {
            if (!el) return;
            el.style.setProperty('display', 'block', 'important');
            el.style.setProperty('opacity', '1', 'important');
            el.style.setProperty('visibility', 'visible', 'important');
            el.classList.add('visible');
            if (el.querySelectorAll) {
                el.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .animate-fade-up, .pdf-card-home, .committee-member, .utsav-card, .donation-card').forEach(child => {
                    child.classList.add('visible');
                    child.style.setProperty('opacity', '1', 'important');
                    child.style.setProperty('transform', 'none', 'important');
                    child.style.setProperty('animation', 'none', 'important');
                    child.style.setProperty('visibility', 'visible', 'important');
                });
            }
        };

        // Hide everything first
        if(heroContainer) heroContainer.style.display = 'none';
        if(ganeshotsavHeader) ganeshotsavHeader.style.display = 'none';
        if(cashbookContainer) cashbookContainer.style.display = 'none';
        if(prevYearsContainer) prevYearsContainer.style.display = 'none';
        if(siteFooter) siteFooter.style.display = 'none';
        if(mainContainer) mainContainer.style.display = 'none';
        if(donationSection) donationSection.style.display = 'none';
        if(committeeSection) committeeSection.style.display = 'none';
        if(aartiSection) aartiSection.style.display = 'none';
        if(contactSection) contactSection.style.display = 'none';
        if(niyojanSection) niyojanSection.style.display = 'none';

        // Show based on tabName
        if (tabName === 'home') {
            showEl(heroContainer);
            showEl(siteFooter);
        } else if (tabName === 'ganeshotsav') {
            showEl(mainContainer);
            showEl(ganeshotsavHeader);
            showEl(cashbookContainer);
            showEl(prevYearsContainer);
            showEl(siteFooter);
            if(typeof renderVisibleYearSections === 'function') renderVisibleYearSections();
            if(typeof loadUploadedPDFsHome === 'function') loadUploadedPDFsHome();
        } else if (tabName === 'donate') {
            showEl(siteFooter);
            showEl(mainContainer);
            showEl(donationSection);
        } else if (tabName === 'aarti') {
            showEl(siteFooter);
            showEl(mainContainer);
            showEl(aartiSection);
        } else if (tabName === 'committee') {
            showEl(siteFooter);
            showEl(mainContainer);
            showEl(committeeSection);
            if(typeof loadCommitteeDataHome === 'function') loadCommitteeDataHome();
        } else if (tabName === 'contact') {
            showEl(siteFooter);
            showEl(mainContainer);
            showEl(contactSection);
        } else if (tabName === 'niyojan') {
            showEl(siteFooter);
            showEl(mainContainer);
            showEl(niyojanSection);
        }
        
        if (pushState) {
            if (tabName === 'home') {
                if (isHistoryPushed) {
                    isHistoryPushed = false;
                    window.history.back();
                    return;
                } else {
                    window.history.replaceState({ tab: 'home', isHome: true }, '', window.location.pathname + window.location.search);
                }
            } else {
                if (!isHistoryPushed) {
                    window.history.pushState({ tab: tabName, isHome: false }, '', '#' + tabName);
                    isHistoryPushed = true;
                } else {
                    window.history.replaceState({ tab: tabName, isHome: false }, '', '#' + tabName);
                }
            }
        }
    }

    function setupNavigation() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.tab && e.state.tab !== 'home') {
                isHistoryPushed = true;
                switchTab(e.state.tab, false);
            } else {
                isHistoryPushed = false;
                switchTab('home', false);
            }
        });
        
        // Push initial state
        const currentHash = window.location.hash.replace('#', '');
        if (currentHash && currentHash !== 'home') {
            window.history.replaceState({ tab: currentHash, isHome: false }, '', '#' + currentHash);
            isHistoryPushed = true;
        } else {
            window.history.replaceState({ tab: 'home', isHome: true }, '', window.location.pathname + window.location.search);
            isHistoryPushed = false;
        }
    }

    
    

    
    
    async function loadNiyojanDataHome() {
        try {
            const response = await fetch('/api/niyojan');
            if (response.ok) {
                const niyojans = await response.json();
                const grid = document.getElementById('niyojanGrid');
                if (!grid) return;
                
                if (niyojans.length === 0) {
                    grid.innerHTML = '<p style="text-align: center; color: white;">कोणतेही नियोजन उपलब्ध नाही.</p>';
                    return;
                }
                
                let html = '';
                niyojans.forEach((item, index) => {
                    const formattedDate = formatDate(item.date);
                    
                    let time12 = item.time;
                    if (time12) {
                        let parts = time12.split(':');
                        if (parts.length >= 2) {
                            let h = parseInt(parts[0], 10);
                            let m = parts[1];
                            let ampm = h >= 12 ? 'PM' : 'AM';
                            h = h % 12 || 12;
                            time12 = `${h}:${m} ${ampm}`;
                        }
                    }

                    html += `
                        <div class="niyojan-item animate-fade-up" style="animation-delay: ${index * 0.1}s; display: flex; gap: 20px; margin-bottom: 25px;">
                            <!-- Timeline dot -->
                            <div style="min-width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #d4af37, #aa8222); border: 4px solid #1a1a1a; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px rgba(212,175,55,0.5); z-index: 2;">
                                <i class="fas fa-calendar-day" style="color: #fff; font-size: 1.1rem;"></i>
                            </div>
                            
                            <!-- Content Card -->
                            <div class="glass-panel" style="flex: 1; padding: 15px 20px; border-left: 3px solid #d4af37; background: rgba(255,255,255,0.05);">
                                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 8px;">
                                    <span style="color: #ffcc00; font-weight: bold; font-size: 1.1rem;">${formattedDate}</span>
                                    <span style="background: rgba(212,175,55,0.2); color: #ffeb3b; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 5px; height: fit-content; line-height: 1;"><i class="far fa-clock"></i>${time12}</span>
                                </div>
                                <h3 style="color: #fff; font-family: 'Khand', sans-serif; font-size: 1.25rem; margin: 0 0 5px 0;">${item.title}</h3>
                                ${item.description ? `<p style="color: #ccc; font-size: 0.9rem; margin: 0; line-height: 1.4;">${item.description}</p>` : ''}
                                ${item.addedBy ? `<div style="display:flex; justify-content:flex-end; margin-top: 10px;"><span style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); padding: 3px 10px; border-radius: 15px; font-size: 0.75rem; color:#aaa;"><i class="fas fa-user-edit" style="margin-right:5px; color:#d4af37;"></i>${item.addedBy}</span></div>` : ''}
                            </div>
                        </div>
                    `;
                });
                grid.innerHTML = html;
            }
        } catch (e) {
    console.error('Failed to load niyojan data:', e);
} finally {
    const grid = document.getElementById('niyojanGrid');
    if (grid && grid.innerHTML.includes('लोड होत आहे')) {
        grid.innerHTML = '<p style="text-align: center; color: #ccc;">माहिती लवकरच उपलब्ध होईल.</p>';
    }
}
    }

    async function loadAartiDataHome() {
        try {
            const response = await fetch('/api/aarti');
            if (response.ok) {
                const aartis = await response.json();
                const grid = document.getElementById('aartiGrid');
                if (!grid) return;
                
                if (aartis.length === 0) {
                    grid.innerHTML = '<p style="text-align: center; color: white; width: 100%;">कोणतीही महाआरती नोंदवली नाही.</p>';
                    return;
                }
                
                let html = '';
                aartis.forEach(aarti => {
                    const formattedDate = formatDate(aarti.date);
                    
                    html += `
                        <div class="aarti-item glass-panel" style="padding: 15px; margin-bottom: 15px; border-left: 4px solid #ffcc00; background: rgba(255,255,255,0.1);">
                            <h3 style="color: #ffeb3b; margin: 0 0 10px 0; font-family: 'Khand', sans-serif; font-size: 1.2rem;">${aarti.name}</h3>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; color: #fff; font-size: 0.85rem;">
                                <div><strong style="color: #ffcc00;">तारीख:</strong> ${formattedDate}</div>
                                <div><strong style="color: #ffcc00;">वेळ:</strong> ${aarti.timeOfDay}</div>
                            </div>
                            ${aarti.pujaDetails ? `<div style="margin-top: 10px; color: #eee; font-size: 0.85rem;"><strong style="color: #ffcc00;">इतर माहिती:</strong> ${aarti.pujaDetails}</div>` : ''}
                            ${aarti.addedBy ? `<div style="display:flex; justify-content:flex-end; margin-top: 12px; grid-column: 1 / -1;"><span style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); padding: 3px 10px; border-radius: 15px; font-size: 0.75rem; color:#aaa;"><i class="fas fa-user-edit" style="margin-right:5px; color:#ffcc00;"></i>${aarti.addedBy}</span></div>` : ''}
                        </div>
                    `;
                });
                grid.innerHTML = html;
            }
        } catch (e) {
    console.error('Error loading aarti data:', e);
} finally {
    const grid = document.getElementById('aartiGrid');
    if (grid && grid.innerHTML.includes('लोड होत आहे')) {
        grid.innerHTML = '<p style="text-align: center; color: #ccc; width: 100%;">माहिती लवकरच उपलब्ध होईल.</p>';
    }
}
    }

    window.audioCtx = null;
    window.audioGainNode = null;
    function initWebAudio(audioElem) {
        if (!window.audioCtx) {
            try {
                window.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                window.audioGainNode = window.audioCtx.createGain();
                const source = window.audioCtx.createMediaElementSource(audioElem);
                source.connect(window.audioGainNode);
                window.audioGainNode.connect(window.audioCtx.destination);
            } catch(e) {
                console.error('Web Audio API init failed', e);
            }
        }
        if (window.audioCtx && window.audioCtx.state === 'suspended') {
            window.audioCtx.resume();
        }
        if (window.audioGainNode && window.appSettings && window.appSettings.bgAudioVolume !== undefined) {
            window.audioGainNode.gain.value = window.appSettings.bgAudioVolume;
        }
    }

    function toggleBgAudio() {
    const audioElem = document.getElementById('bgAudioElement');
    if (!audioElem) return;
    initWebAudio(audioElem);
    const playIcon = document.getElementById('audioIconPlay');
    const pauseIcon = document.getElementById('audioIconPause');
    const btnText = document.getElementById('audioBtnText');
    
    if (audioElem.paused) {
        audioElem.play().then(() => {
            if(playIcon) playIcon.style.display = 'none';
            if(pauseIcon) pauseIcon.style.display = 'inline-block';
            if(btnText) btnText.innerText = 'Pause Mantra';
        }).catch(e => console.error('Audio play failed', e));
    } else {
        audioElem.pause();
        if(playIcon) playIcon.style.display = 'inline-block';
        if(pauseIcon) pauseIcon.style.display = 'none';
        if(btnText) btnText.innerText = 'Play Mantra';
    }
}
window.userHasInteracted = false;
const globalInteractionHandler = () => {
    window.userHasInteracted = true;
    const audioElem = document.getElementById('bgAudioElement');
    if (audioElem && audioElem.src && audioElem.paused && window.bgAudioEnabled) {
        initWebAudio(audioElem);
        audioElem.play().then(() => {
            const playIcon = document.getElementById('audioIconPlay');
            const pauseIcon = document.getElementById('audioIconPause');
            const btnText = document.getElementById('audioBtnText');
            if(playIcon) playIcon.style.display = 'none';
            if(pauseIcon) pauseIcon.style.display = 'inline-block';
            if(btnText) btnText.innerText = 'Pause Mantra';
        }).catch(e => {});
    }
    document.removeEventListener('click', globalInteractionHandler);
    document.removeEventListener('touchstart', globalInteractionHandler);
};
document.addEventListener('click', globalInteractionHandler);
document.addEventListener('touchstart', globalInteractionHandler);

    async function loadAppearanceSettingsHome() {
        const renderSettings = (settings) => {
            if (!settings) return;
            window.appSettings = settings;
            try { appSettings = settings; } catch(e) {}
            if (settings.estYear) document.getElementById('displayEstYear').textContent = settings.estYear;
if (settings.bgAudioUrl) {
    const audioElem = document.getElementById('bgAudioElement');
    const container = document.getElementById('footerAudioContainer');
    if (audioElem && container) {
        audioElem.src = settings.bgAudioUrl;
        audioElem.volume = settings.bgAudioVolume !== undefined ? settings.bgAudioVolume : 0.5;
        container.style.display = 'flex';
        window.bgAudioEnabled = true;
        if (window.userHasInteracted && audioElem.paused) {
            audioElem.play().then(() => {
                const playIcon = document.getElementById('audioIconPlay');
                const pauseIcon = document.getElementById('audioIconPause');
                const btnText = document.getElementById('audioBtnText');
                if(playIcon) playIcon.style.display = 'none';
                if(pauseIcon) pauseIcon.style.display = 'inline-block';
                if(btnText) btnText.innerText = 'Pause Mantra';
            }).catch(e => {});
        }
    }
}
            const regNoElem = document.getElementById('displayRegNo');
            if (settings.regNo && regNoElem) regNoElem.textContent = settings.regNo;
            const navTitleElem = document.getElementById('displayNavbarTitle');
            if (settings.navbarTitle && navTitleElem) navTitleElem.textContent = settings.navbarTitle;

            const heroImg = document.getElementById('heroBannerImg');
            if (settings.heroBannerImage) {
                if (heroImg) {
                    if (settings.heroBannerImage.startsWith('data:image') || settings.heroBannerImage.startsWith('http')) {
                        heroImg.src = settings.heroBannerImage;
                    } else {
                        const newSrc = 'uploads/' + settings.heroBannerImage;
                        if (settings.heroBannerImage !== 'hero_banner.png' && !heroImg.src.includes(newSrc)) {
                            heroImg.src = newSrc;
                        }
                    }
                    heroImg.style.display = 'block';
                }
            }
            
            const desktopElem = document.getElementById('desktopTopHeaderImg');
            if (desktopElem) {
                const deskImg = settings.websiteHeaderImage || settings.topHeaderBannerImage || settings.headerBannerImage;
                if (deskImg) {
                    const newSrc = (deskImg.startsWith('data:image') || deskImg.startsWith('http')) ? deskImg : ('uploads/' + deskImg);
                    const t = new Image(); t.onload = () => desktopElem.src = newSrc; t.src = newSrc;
                }
            }
            const mobileElem = document.getElementById('mobileTopHeaderImg');
            if (mobileElem) {
                const mobImg = settings.posterHeaderImage || settings.topHeaderBannerImage || settings.websiteHeaderImage || settings.headerBannerImage;
                if (mobImg) {
                    const newSrc = (mobImg.startsWith('data:image') || mobImg.startsWith('http')) ? mobImg : ('uploads/' + mobImg);
                    const t = new Image(); t.onload = () => mobileElem.src = newSrc; t.src = newSrc;
                }
            }
            
            // Populate Mandal Parichay (About Section) on Home Page
            const aboutPhotoElem = document.getElementById('aboutGanpatiPhoto');
            if (aboutPhotoElem) {
                let newSrc = null;
                if (settings.aboutMandalPhoto) {
                    newSrc = settings.aboutMandalPhoto;
                } else if (settings.heroBannerImage) {
                    newSrc = settings.heroBannerImage.startsWith('data:') || settings.heroBannerImage.startsWith('http') ? settings.heroBannerImage : (settings.heroBannerImage.startsWith('uploads/') ? settings.heroBannerImage : 'uploads/' + settings.heroBannerImage);
                }
                if (newSrc) {
                    const t = new Image(); t.onload = () => aboutPhotoElem.src = newSrc; t.src = newSrc;
                }
            }
            if (settings.aboutMandalTitle) {
                const titleElem = document.getElementById('aboutTitleText');
                if (titleElem) titleElem.textContent = settings.aboutMandalTitle;
            }
            if (settings.aboutMandalSubtitle) {
                const subElem = document.getElementById('aboutSubtitleText');
                if (subElem) subElem.textContent = settings.aboutMandalSubtitle;
            }
            if (settings.aboutMandalDetails && settings.aboutMandalDetails.trim() !== "") {
                const container = document.getElementById('aboutDetailsContainer');
                if (container) {
                    const paras = settings.aboutMandalDetails.split('\n').filter(p => p.trim() !== "");
                    let html = '';
                    paras.forEach((p, idx) => {
                        if (idx === paras.length - 1 && (p.includes('॥') || p.includes('🚩'))) {
                            html += `<p style="text-align: center; color: #ffeb3b; font-weight: 700; margin-top: 25px; font-size: 1.3rem; border-top: 1px dashed rgba(255,255,255,0.2); padding-top: 18px;">${p}</p>`;
                        } else {
                            html += `<p>${p}</p>`;
                        }
                    });
                    container.innerHTML = html;
                }
            }
            
            // Populate Donation Details
            if (settings.donateAccName) document.getElementById('bankAccName').textContent = settings.donateAccName;
            if (settings.donateAccNo) document.getElementById('bankAccNo').textContent = settings.donateAccNo;
            if (settings.donateIFSC) document.getElementById('bankIFSC').textContent = settings.donateIFSC;
            if (settings.donateBranch) document.getElementById('bankBranch').textContent = settings.donateBranch;
            
            if (settings.donateQRCode) {
                const qrImg = document.getElementById('donationQRImg');
                if (qrImg) qrImg.src = settings.donateQRCode;
                const footerQrImg = document.getElementById('footerDonationQRImg');
                if (footerQrImg) footerQrImg.src = settings.donateQRCode;
            }
            
            // Custom Posters Titles on Buttons
            if (settings.varganiPosterBtnName) {
                const vBtnText = document.getElementById('varganiBtnText');
                if (vBtnText) vBtnText.textContent = settings.varganiPosterBtnName;
            } else if (settings.varganiAabharTitle) {
                const vBtnText = document.getElementById('varganiBtnText');
                if (vBtnText) vBtnText.textContent = settings.varganiAabharTitle;
            }
            
            if (settings.aagmanPosterBtnName) {
                const aBtnText = document.getElementById('aagmanBtnText');
                if (aBtnText) aBtnText.textContent = settings.aagmanPosterBtnName;
            } else if (settings.aagmanSohalaTitle) {
                const aBtnText = document.getElementById('aagmanBtnText');
                if (aBtnText) aBtnText.textContent = settings.aagmanSohalaTitle;
            }
            
            if (settings.mahaprasadPosterBtnName) {
                const mBtnText = document.getElementById('mahaprasadBtnText');
                if (mBtnText) mBtnText.textContent = settings.mahaprasadPosterBtnName;
            } else if (settings.mahaprasadNimantranTitle) {
                const mBtnText = document.getElementById('mahaprasadBtnText');
                if (mBtnText) mBtnText.textContent = settings.mahaprasadNimantranTitle;
            }
            
            if (settings.visarjanSohalaTitle) {
                const visBtnText = document.getElementById('visarjanBtnText');
                if (visBtnText) visBtnText.textContent = settings.visarjanSohalaTitle;
            }
            
            if (settings.customEventTitle) {
                const custBtnText = document.getElementById('customEventBtnText');
                if (custBtnText) custBtnText.textContent = settings.customEventTitle;
            }

            // Card Badges & Descriptions
            if (settings.varganiCardBadge) {
                const el = document.getElementById('varganiBadgeDisplay');
                if (el) el.textContent = settings.varganiCardBadge;
            }
            if (settings.mahaprasadCardBadge) {
                const el = document.getElementById('mahaprasadBadgeDisplay');
                if (el) el.textContent = settings.mahaprasadCardBadge;
            }
            if (settings.aagmanCardBadge) {
                const el = document.getElementById('aagmanBadgeDisplay');
                if (el) el.textContent = settings.aagmanCardBadge;
            }
            if (settings.visarjanCardBadge) {
                const el = document.getElementById('visarjanBadgeDisplay');
                if (el) el.textContent = settings.visarjanCardBadge;
            }
            if (settings.customEventCardBadge) {
                const el = document.getElementById('customEventBadgeDisplay');
                if (el) el.textContent = settings.customEventCardBadge;
            }

            const updateDescDisplay = (id, text) => {
                const el = document.getElementById(id);
                if (!el) return;
                if (text && String(text).trim() !== '') {
                    el.textContent = String(text).trim();
                    el.style.display = 'block';
                } else {
                    el.textContent = '';
                    el.style.display = 'none';
                }
            };

            updateDescDisplay('varganiDescDisplay', settings.varganiCardDesc);
            updateDescDisplay('mahaprasadDescDisplay', settings.mahaprasadCardDesc);
            updateDescDisplay('aagmanDescDisplay', settings.aagmanCardDesc);
            updateDescDisplay('visarjanDescDisplay', settings.visarjanCardDesc);
            updateDescDisplay('customEventDescDisplay', settings.customEventCardDesc);

            // Poster Visibility Toggles
            const isPosterOn = (val) => !(val === false || val === 0 || val === '0' || String(val).trim().toLowerCase() === 'false' || String(val).trim().toLowerCase() === 'off');
            const showVargani = isPosterOn(settings.showVarganiPoster);
            const showMahaprasad = isPosterOn(settings.showMahaprasadPoster);
            const showAagman = isPosterOn(settings.showAagmanPoster);
            const showVisarjan = isPosterOn(settings.showVisarjanPoster);
            const showCustomEvent = isPosterOn(settings.showCustomEventPoster);

            const vCard = document.getElementById('varganiPosterCard');
            const mCard = document.getElementById('mahaprasadPosterCard');
            const aCard = document.getElementById('aagmanPosterCard');
            const visCard = document.getElementById('visarjanPosterCard');
            const cCard = document.getElementById('customEventPosterCard');

            if (vCard) vCard.style.display = showVargani ? 'flex' : 'none';
            if (mCard) mCard.style.display = showMahaprasad ? 'flex' : 'none';
            if (aCard) aCard.style.display = showAagman ? 'flex' : 'none';
            if (visCard) visCard.style.display = showVisarjan ? 'flex' : 'none';
            if (cCard) cCard.style.display = showCustomEvent ? 'flex' : 'none';

            const anyPosterVisible = showVargani || showMahaprasad || showAagman || showVisarjan || showCustomEvent;
            const showcaseBox = document.getElementById('posterShowcaseContainer');
            if (showcaseBox) {
                showcaseBox.style.display = anyPosterVisible ? 'block' : 'none';
            }
            
            // Donation buttons
            if (settings.donationPosterBtnName) {
                const donDownloadBtns = document.querySelectorAll('.donation-download-btn');
                donDownloadBtns.forEach(btn => btn.innerHTML = '<i class="fas fa-download"></i> ' + settings.donationPosterBtnName);
                const donShareBtns = document.querySelectorAll('.donation-share-btn');
                donShareBtns.forEach(btn => btn.innerHTML = '<i class="fas fa-share-alt"></i> शेअर करा');
            }
            
            // Load Aarti Media
            const aartiMediaContainer = document.getElementById('aartiMediaContainer');
            const aartiAudioWrapper = document.getElementById('aartiAudioWrapper');
            const aartiAudioPlayer = document.getElementById('aartiAudioPlayer');
            const aartiPdfWrapper = document.getElementById('aartiPdfWrapper');
            const aartiPdfLink = document.getElementById('aartiPdfLink');
            
            if (aartiMediaContainer) aartiMediaContainer.style.display = 'flex';
            if (aartiAudioWrapper) aartiAudioWrapper.style.display = 'flex';
            if (aartiPdfWrapper) aartiPdfWrapper.style.display = 'block';

            if (settings.aartiAudioPath && aartiAudioPlayer) {
                aartiAudioPlayer.src = settings.aartiAudioPath;
            }
            if (settings.aartiPdfPath && aartiPdfLink) {
                aartiPdfLink.href = settings.aartiPdfPath;
            }
        };

        // 1. INSTANT LOAD from localStorage cache
        try {
            const cachedSettings = localStorage.getItem('settingsCache');
            if (cachedSettings) {
                renderSettings(JSON.parse(cachedSettings));
            }
        } catch(ce) {}

        // 2. BACKGROUND UPDATE from API
        try {
            const response = await fetch('/api/settings?_=' + Date.now(), { cache: 'no-store' });
            const result = await response.json();
            if (result.success) {
                localStorage.setItem('settingsCache', JSON.stringify(result.data));
                renderSettings(result.data);
            } else {
                const heroImg = document.getElementById('heroBannerImg');
                if (heroImg) heroImg.style.opacity = '1';
            }
        } catch (e) {
            console.error('Error loading appearance settings:', e);
            const heroImg = document.getElementById('heroBannerImg');
            if (heroImg) heroImg.style.opacity = '1';
        }
    }

    
    

        async function loadCommitteeDataHome() {
        // Function to render committee HTML
        const renderCommittee = (data) => {
            const grid = document.querySelector('.committee-grid');
            if (!grid) return;
            
            grid.innerHTML = '';
            
            const topRoles = ['president', 'treasurer'];
            const processedData = data.map(m => {
                let p = m.photoUrl;
                if (p && !p.startsWith('data:') && !p.includes('?t=')) {
                    p += (p.includes('?') ? '&' : '?') + 't=' + Date.now();
                }
                return { ...m, photoUrl: p };
            });
            const topMembers = processedData.filter(m => topRoles.includes(m.role));
            const otherMembers = processedData.filter(m => !topRoles.includes(m.role));
            
            let html = '';
            
            const generateMemberHTML = (member) => {
                let roleName = member.designation;
                if (!roleName) {
                    roleName = 'सदस्य';
                    if (member.role === 'president') roleName = 'अध्यक्ष';
                    else if (member.role === 'treasurer') roleName = 'खजिनदार';
                }
                
                let photoUrl = member.photoUrl;
                if (!photoUrl) {
                    photoUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e0e0e0'/%3E%3Ccircle cx='50' cy='40' r='20' fill='%23bdbdbd'/%3E%3Cpath d='M20,90 Q50,50 80,90' stroke='%23bdbdbd' stroke-width='10' fill='none'/%3E%3C/svg%3E";
                }
                const mobileHtml = member.mobile ? `<p class="member-phone">मो.नं ${member.mobile}</p>` : '<p class="member-phone" style="display:none;"></p>';
                const memberName = member.name || 'नाव टाका';
                
                return `
                <div class="committee-member" onclick="openLightbox('${photoUrl}')" style="cursor: pointer;">
                    <div class="member-photo-frame">
                        <img src="${photoUrl}" alt="${roleName}" class="member-photo" ${member.role === 'president' ? 'style="object-position: center 10%;"' : ''}>
                    </div>
                    <h3 class="member-role">${roleName}</h3>
                    <p class="member-name">${memberName}</p>
                    ${mobileHtml}
                </div>
                `;
            };
            
            if (topMembers.length > 0) {
                html += '<div class="committee-row-2">';
                topMembers.forEach(member => {
                    html += generateMemberHTML(member);
                });
                html += '</div>';
            }
            
            if (otherMembers.length > 0) {
                html += '<div class="committee-members-wrap">';
                otherMembers.forEach(member => {
                    html += generateMemberHTML(member);
                });
                html += '</div>';
            }
            
            grid.innerHTML = html;
            
            const defaultPhoto = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e0e0e0'/%3E%3Ccircle cx='50' cy='40' r='20' fill='%23bdbdbd'/%3E%3Cpath d='M20,90 Q50,50 80,90' stroke='%23bdbdbd' stroke-width='10' fill='none'/%3E%3C/svg%3E";
            
            if (document.getElementById('contact-card-president')) document.getElementById('contact-card-president').style.display = 'none';
            if (document.getElementById('contact-card-treasurer')) document.getElementById('contact-card-treasurer').style.display = 'none';
            
            topMembers.forEach(member => {
                if (member.role === 'president') {
                    if (document.getElementById('contact-card-president')) {
                        document.getElementById('contact-card-president').style.display = 'flex';
                        document.getElementById('contact-president-name').textContent = member.name || 'नाव टाका';
                        document.getElementById('contact-president-mobile').textContent = member.mobile ? `मो.नं ${member.mobile}` : '';
                        document.getElementById('contact-president-photo').src = member.photoUrl || defaultPhoto;
                        
                        const waLink = document.getElementById('contact-president-wa');
                        if (member.mobile) {
                            waLink.style.display = 'inline-flex';
                            waLink.href = `https://wa.me/91${member.mobile}?text=नमस्कार%20${member.name},%20शिवसृष्टी%20मंडळाबाबत%20संपर्क%20साधत%20आहे.`;
                        } else {
                            waLink.style.display = 'none';
                        }
                    }
                } else if (member.role === 'treasurer') {
                    if (document.getElementById('contact-card-treasurer')) {
                        document.getElementById('contact-card-treasurer').style.display = 'flex';
                        document.getElementById('contact-treasurer-name').textContent = member.name || 'नाव टाका';
                        document.getElementById('contact-treasurer-mobile').textContent = member.mobile ? `मो.नं ${member.mobile}` : '';
                        document.getElementById('contact-treasurer-photo').src = member.photoUrl || defaultPhoto;
                        
                        const waLink = document.getElementById('contact-treasurer-wa');
                        if (member.mobile) {
                            waLink.style.display = 'inline-flex';
                            waLink.href = `https://wa.me/91${member.mobile}?text=नमस्कार%20${member.name},%20शिवसृष्टी%20मंडळाबाबत%20संपर्क%20साधत%20आहे.`;
                        } else {
                            waLink.style.display = 'none';
                        }
                    }
                }
            });
        };

        // 1. INSTANT LOAD: immediately render from localStorage cache without waiting for server network delay!
        try {
            const cachedData = localStorage.getItem('committeeCache');
            if (cachedData) {
                const parsedCache = JSON.parse(cachedData);
                if (parsedCache && parsedCache.length > 0) {
                    window.currentCommitteeData = parsedCache;
                    renderCommittee(parsedCache);
                }
            }
        } catch (ce) {}

        // 2. BACKGROUND UPDATE: fetch freshest updates silently and re-render if updated
        try {
            const response = await fetch('/api/committee?t=' + Date.now(), { cache: 'no-store', headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' } });
            const result = await response.json();
            if (result.success && Array.isArray(result.data)) {
                window.currentCommitteeData = result.data;
                localStorage.setItem('committeeCache', JSON.stringify(result.data));
                renderCommittee(result.data);
            }
        } catch(e) {
    console.error('Failed to load committee from API', e);
} finally {
    const grid = document.querySelector('.committee-grid');
    if (grid && grid.innerHTML.includes('लोड होत आहे')) {
        grid.innerHTML = '<div style="text-align: center; width: 100%; color: #ccc; padding: 20px;"><p>माहिती लवकरच उपलब्ध होईल.</p></div>';
    }
}
    }

    function isYearVisible(year) {
        return yearVisibilityMap[year] === true;
    }

    async function renderVisibleYearSections() {
        const container = document.getElementById('visibleYearsContent');
        const outer = document.getElementById('visibleYearsContainer');
        const select = document.getElementById('visibleYearSelect');
        if (!container || !outer || !select) return;

        try {
            const [r, visResponse, setResponse] = await Promise.all([
                fetch(API_URL + '/api/years'),
                fetch('/api/year-visibility'),
                fetch('/api/settings')
            ]);
            const d = await r.json();
            const visResult = await visResponse.json();
            const setResult = await setResponse.json();
            
            if (visResult.success) {
                yearVisibilityMap = visResult.data;
            }
            if (setResult.success) {
                appSettings = setResult.data;
            }
            const apiYears = (d.success && d.data) ? d.data : [];

            let panelYears = appSettings['customYearPanels'] || [];
            if (!Array.isArray(panelYears)) panelYears = [];

            const allYears = [...new Set([...apiYears, ...panelYears])].filter(y => isYearVisible(y)).sort().reverse();

            select.style.display = allYears.length ? '' : 'none';
            const selContainer = select.closest('.year-selector-container');
            if (selContainer) selContainer.style.display = allYears.length ? '' : 'none';
            const prevValue = select.value;
            select.innerHTML = '<option value="">वर्ष निवडा</option>';
            allYears.forEach(y => {
                const opt = document.createElement('option');
                opt.value = y;
                opt.textContent = y;
                select.appendChild(opt);
            });

            const selectedYear = (prevValue && allYears.includes(prevValue)) ? prevValue : (allYears.length ? allYears[0] : '');
            select.value = selectedYear;
            select.setAttribute('value', selectedYear);

            if (allYears.length === 0) {
                container.innerHTML = '<div class="year-selector-container" style="justify-content:center; padding: 35px 20px; text-align:center; width:100%; box-sizing:border-box; margin: 0 auto; animation: none !important; transform: none !important;"><p style="font-weight:600; color:#ffffff !important; font-size: 16px; margin: 0; width: 100%;">सदर माहिती अद्ययावत करण्यात येत असून, लवकरच उपलब्ध करून देण्यात येईल..!!!</p></div>';
            } else if (selectedYear) {
                await loadVisibleYearData(selectedYear, container);
            } else {
                container.innerHTML = '<div class="year-selector-container" style="justify-content:center; padding: 35px 20px; text-align:center; width:100%; box-sizing:border-box; margin: 0 auto; animation: none !important; transform: none !important;"><p style="font-weight:600; color:#ffffff !important; font-size: 16px; margin: 0; width: 100%;">कृपया वरील यादीतून वर्ष निवडा.</p></div>';
            }

            if (currentTab === 'ganeshotsav') {
                outer.style.display = 'block';
            } else {
                outer.style.display = 'none';
            }

            select.onchange = async function() {
                this.setAttribute('value', this.value);
                if (this.value) {
                    await loadVisibleYearData(this.value, container);
                } else {
                    container.innerHTML = '<div class="year-selector-container" style="justify-content:center; padding: 35px 20px; text-align:center; width:100%; box-sizing:border-box; margin: 0 auto; animation: none !important; transform: none !important;"><p style="font-weight:600; color:#ffffff !important; font-size: 16px; margin: 0; width: 100%;">कृपया वरील यादीतून वर्ष निवडा.</p></div>';
                }
            };
        } catch (e) {
            console.error('Error loading years:', e);
            container.innerHTML = '<div class="year-selector-container" style="justify-content:center; padding: 35px 20px; text-align:center; width:100%; box-sizing:border-box; margin: 0 auto; animation: none !important; transform: none !important;"><p style="font-weight:600; color:#ffffff !important; font-size: 16px; margin: 0; width: 100%;">सदर माहिती अद्ययावत करण्यात येत असून, लवकरच उपलब्ध करून देण्यात येईल..!!!</p></div>';
            if (currentTab === 'ganeshotsav') {
                outer.style.display = 'block';
            } else {
                outer.style.display = 'none';
            }
        }
    }

    async function loadVisibleYearData(year, container) {
        try {
            const visible = isYearVisible(year);
            if (!visible) {
                container.innerHTML = '<div class="year-selector-container" style="justify-content:center; padding: 35px 20px; text-align:center; width:100%; box-sizing:border-box; margin: 0 auto; animation: none !important; transform: none !important;"><p style="font-weight:600; color:#ffffff !important; font-size: 16px; margin: 0; width: 100%;">सदर माहिती अद्ययावत करण्यात येत असून, लवकरच उपलब्ध करून देण्यात येईल..!!!</p></div>';
                return;
            }
            const r = await fetch(API_URL + '/api/entries?year=' + year);
            const d = await r.json();
            const entries = (d && d.success && Array.isArray(d.data)) ? d.data : [];

            currentYearEntries = entries;
            currentSelectedYear = year;
            currentYearPage = 1;
            renderVisibleYearData(container);
        } catch (e) {
            console.error('Error loading year ' + year, e);
            currentYearEntries = [];
            currentSelectedYear = year;
            currentYearPage = 1;
            renderVisibleYearData(container);
        }
    }

    function changeYearPage(delta) {
        currentYearPage += delta;
        renderVisibleYearData();
    }

    function renderVisibleYearData(container) {
        if (!container) container = document.getElementById('visibleYearsContent');
        const year = currentSelectedYear;
        const entries = currentYearEntries;

        let finalBalance = 0, totalIn = 0, totalOut = 0;
        entries.forEach(e => {
            const ci = parseFloat(e.cash_in) || 0;
            const co = parseFloat(e.cash_out) || 0;
            finalBalance += ci - co;
            totalIn += ci;
            totalOut += co;
        });

        const isMobile = window.innerWidth <= 768;
        const TRANSACTIONS_PER_PAGE = 10;
        const totalPages = Math.ceil(entries.length / TRANSACTIONS_PER_PAGE) || 1;
        
        if (currentYearPage > totalPages) currentYearPage = totalPages;
        if (currentYearPage < 1) currentYearPage = 1;
        
        const from = (currentYearPage - 1) * TRANSACTIONS_PER_PAGE;
        const to = Math.min(from + TRANSACTIONS_PER_PAGE, entries.length);

        let rows = '';
        let runningBalance = 0;
        
        for (let i = 0; i < from; i++) {
            const ci = parseFloat(entries[i].cash_in) || 0;
            const co = parseFloat(entries[i].cash_out) || 0;
            runningBalance += ci - co;
        }

        for (let i = from; i < to; i++) {
            const e = entries[i];
            const ci = parseFloat(e.cash_in) || 0;
            const co = parseFloat(e.cash_out) || 0;
            runningBalance += ci - co;
            const modeClass = e.mode === 'Online' ? 'online' : 'cash';
            rows += '<tr><td>' + (i + 1) + '</td><td class="remark">' + e.name + '</td><td class="date">' + formatDate(e.date) + '</td><td><span class="mode-badge ' + modeClass + '">' + e.mode + '</span></td><td class="cash-in-cell">' + (ci ? '\u20B9' + ci : '-') + '</td><td class="cash-out-cell">' + (co ? '\u20B9' + co : '-') + '</td><td class="balance-cell">\u20B9' + runningBalance + '</td></tr>';
        }
        if (entries.length === 0) {
            rows = '<tr><td colspan="7" style="text-align:center; padding: 25px 20px; color:#ffffff; font-weight:600;">कोणतीही नोंद उपलब्ध नाही</td></tr>';
        }

        let html = '<div class="year-section">';
        html += `<div class="year-section-header"><h2>${year} - Cashbook</h2><div class="section-actions">`;
        html += `<button class="btn btn-pdf-view" onclick="viewPDFYear(\'${year}\', this)">View PDF</button>`;
        html += `<button class="btn btn-pdf-download" onclick="downloadPDFYear(\'${year}\', this)">Download PDF</button>`;
        html += '</div></div>';

        html += '<div class="summary-cards">';
        html += '<div class="card card-cash-in"><div class="card-glass"><div class="card-header"><h3>Total Cash In</h3></div><p class="amount">\u20B9' + totalIn + '</p></div></div>';
        html += '<div class="card card-cash-out"><div class="card-glass"><div class="card-header"><h3>Total Cash Out</h3></div><p class="amount">\u20B9' + totalOut + '</p></div></div>';
        html += '<div class="card card-balance"><div class="card-glass"><div class="card-header"><h3>Final Balance</h3></div><p class="amount">\u20B9' + finalBalance + '</p></div></div>';
        html += '</div>';

        html += '<div class="section-actions mobile-only">';
        html += `<button class="btn btn-pdf-view" onclick="viewPDFYear(\'${year}\', this)">View PDF</button>`;
        html += `<button class="btn btn-pdf-download" onclick="downloadPDFYear(\'${year}\', this)">Download PDF</button>`;
        html += '</div>';

        html += `<div class="table-scroll"><table><thead><tr><th>#</th><th>Name</th><th>Date</th><th>Mode</th><th>Cash In</th><th>Cash Out</th><th>Balance</th></tr></thead><tbody>${rows}</tbody></table></div>`;
        
        if (totalPages > 1) {
            html += '<div class="pdf-pagination table-pagination">';
            html += '<button class="btn btn-secondary" onclick="changeYearPage(-1)" ' + (currentYearPage === 1 ? 'disabled' : '') + '>Previous</button>';
            html += '<span class="pdf-page-info">Page ' + currentYearPage + ' / ' + totalPages + '</span>';
            html += '<button class="btn btn-secondary" onclick="changeYearPage(1)" ' + (currentYearPage === totalPages ? 'disabled' : '') + '>Next</button>';
            html += '</div>';
        }

        html += '</div>';

        container.innerHTML = html;
    }

    async function generatePDFFromHTML(htmlContent, download, filename) {
        if (!download) {
            const newWindow = window.open('', '_blank');
            if (!newWindow) {
                alert('Please allow popups for this website to view/download PDFs.');
                return;
            }
            newWindow.document.write(htmlContent);
            newWindow.document.close();
            setTimeout(() => { newWindow.document.title = 'View Cashbook'; }, 500);
            return;
        }

        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.width = '794px';
        iframe.style.height = '1123px';
        iframe.style.left = '-9999px';
        iframe.style.top = '-9999px';
        document.body.appendChild(iframe);
        
        iframe.contentDocument.open();
        iframe.contentDocument.write(htmlContent);
        iframe.contentDocument.close();
        
        try { await iframe.contentDocument.fonts.ready; } catch(e){}
        await new Promise(r => setTimeout(r, 1000));
        
        
        // --- PAGE BREAK AVOIDANCE LOGIC ---
        const pageHeightInDOM = (794 * 297) / 210;
        const elementsToAvoidBreak = iframe.contentDocument.querySelectorAll('tr, .pdf-page-break-avoid');
        for (let i = 0; i < elementsToAvoidBreak.length; i++) {
            const el = elementsToAvoidBreak[i];
            const rect = el.getBoundingClientRect();
            const absTop = rect.top + iframe.contentWindow.scrollY;
            const absBottom = rect.bottom + iframe.contentWindow.scrollY;
            
            // Allow 2px tolerance
            const startPage = Math.floor((absTop + 2) / pageHeightInDOM);
            const endPage = Math.floor((absBottom - 2) / pageHeightInDOM);
            
            if (startPage !== endPage) {
                const nextPageTop = (startPage + 1) * pageHeightInDOM;
                const pushAmount = Math.ceil(nextPageTop - absTop) + 1; // 1px safe margin
                
                if (el.tagName.toLowerCase() === 'tr') {
                    const spacer = iframe.contentDocument.createElement('tr');
                    spacer.style.height = pushAmount + 'px';
                    spacer.innerHTML = '<td colspan="100%" style="border:none; padding:0; margin:0; height:' + pushAmount + 'px;"></td>';
                    el.parentNode.insertBefore(spacer, el);
                } else {
                    const currentMargin = parseFloat(iframe.contentWindow.getComputedStyle(el).marginTop) || 0;
                    el.style.marginTop = (currentMargin + pushAmount) + 'px';
                }
            }
        }
        // --- END PAGE BREAK AVOIDANCE LOGIC ---
        
        iframe.style.height = Math.max(1123, iframe.contentDocument.body.scrollHeight) + 'px';

        
        const canvas = await html2canvas(iframe.contentDocument.body, {
            scale: 2, windowWidth: 794, width: 794, useCORS: true, backgroundColor: '#ffffff'
        });
        
        document.body.removeChild(iframe);
        
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const pageHeightInPx = (canvas.width * pdfHeight) / pdfWidth;
        const totalPages = Math.ceil(canvas.height / pageHeightInPx);
        
        for (let i = 0; i < totalPages; i++) {
            if (i > 0) pdf.addPage();
            
            const pageCanvas = document.createElement('canvas');
            pageCanvas.width = canvas.width;
            pageCanvas.height = Math.min(pageHeightInPx, canvas.height - i * pageHeightInPx);
            
            const ctx = pageCanvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
            ctx.drawImage(canvas, 0, i * pageHeightInPx, canvas.width, pageCanvas.height, 0, 0, pageCanvas.width, pageCanvas.height);
            
            const imgData = pageCanvas.toDataURL('image/jpeg', 0.95);
            const drawHeight = (pageCanvas.height * pdfWidth) / pageCanvas.width;
            
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, drawHeight);
        }
        
        pdf.save(filename || 'Cashbook.pdf');
    }

    async function viewPDFYear(year, btn) {
        const originalText = btn ? btn.innerHTML : 'View PDF';
        if (btn) { btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> कृपया थांबा...'; btn.disabled = true; }
        await new Promise(r => setTimeout(r, 50));
        try {
            let entries = [];
            if (year === currentSelectedYear && currentYearEntries.length) {
                entries = currentYearEntries;
            } else {
                const r = await fetch(API_URL + '/api/entries?year=' + year);
                const d = await r.json();
                if (!d.success || !d.data.length) { alert('No entries for ' + year); if (btn) { btn.innerHTML = originalText; btn.disabled = false; } return; }
                entries = d.data;
            }
            const logoDataURL = await loadLogoForCover();
            const html = await generatePDFHTML(entries, year, logoDataURL);
            await generatePDFFromHTML(html, false);
        } catch(e) { alert('Error: ' + e.message); }
        if (btn) { btn.innerHTML = originalText; btn.disabled = false; }
    }

    async function downloadPDFYear(year, btn) {
        const originalText = btn ? btn.innerHTML : 'Download PDF';
        if (btn) { btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> कृपया थांबा...'; btn.disabled = true; }
        await new Promise(r => setTimeout(r, 50));
        try {
            let entries = [];
            if (year === currentSelectedYear && currentYearEntries.length) {
                entries = currentYearEntries;
            } else {
                const r = await fetch(API_URL + '/api/entries?year=' + year);
                const d = await r.json();
                if (!d.success || !d.data.length) { alert('No entries for ' + year); if (btn) { btn.innerHTML = originalText; btn.disabled = false; } return; }
                entries = d.data;
            }
            const logoDataURL = await loadLogoForCover();
            const html = await generatePDFHTML(entries, year, logoDataURL);
            await generatePDFFromHTML(html, true, `Cashbook_${year}.pdf`);
        } catch(e) { alert('Error: ' + e.message); }
        if (btn) { btn.innerHTML = originalText; btn.disabled = false; }
    }

    function formatPDFCurrency(amount) {
        const formatted = amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        return '₹' + formatted;
    }

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        if (isNaN(date)) return dateStr;
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const day = date.getDate().toString().padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `<span class="date-dm">${day} ${month}</span> <span class="date-y">${year}</span>`;
    }

    async function generatePDFHTML(entries, year, logoDataURL) {
        let totalCashIn = 0, totalCashOut = 0, runningBalance = 0;
        const rows = entries.map((entry, index) => {
            runningBalance += entry.cash_in - entry.cash_out;
            totalCashIn += entry.cash_in;
            totalCashOut += entry.cash_out;
            return '<tr><td class="sr-no">' + (index+1) + '</td><td class="remark">' + entry.name + '</td><td class="date">' + formatDate(entry.date) + '</td><td class="mode ' + (entry.mode === 'Online' ? 'online' : 'cash') + '">' + entry.mode + '</td><td class="cash-in-cell">' + (entry.cash_in > 0 ? formatPDFCurrency(entry.cash_in) : '-') + '</td><td class="cash-out-cell">' + (entry.cash_out > 0 ? formatPDFCurrency(entry.cash_out) : '-') + '</td><td class="balance-cell">' + formatPDFCurrency(runningBalance) + '</td></tr>';
        }).join('');
        const finalBalance = totalCashIn - totalCashOut;
        const logoSrc = logoDataURL || 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>\uD83D\uDE4F</text></svg>';
        const s = getPDFSettings(year);
        let pdfHeaderImg = 'logo/pdf_header_banner_opt.jpg?v=' + Date.now();
        try {
            let cachedObj = null;
            if (typeof appSettings !== 'undefined' && appSettings && (appSettings.posterHeaderImage || appSettings.topHeaderBannerImage || appSettings.websiteHeaderImage || appSettings.headerBannerImage)) {
                cachedObj = appSettings;
            } else if (typeof window !== 'undefined' && window.appSettings && (window.appSettings.posterHeaderImage || window.appSettings.topHeaderBannerImage || window.appSettings.websiteHeaderImage || window.appSettings.headerBannerImage)) {
                cachedObj = window.appSettings;
            } else {
                const stored = localStorage.getItem('settingsCache');
                if (stored) cachedObj = JSON.parse(stored);
            }
            if (cachedObj) {
                const mobImg = cachedObj.posterHeaderImage || cachedObj.topHeaderBannerImage || cachedObj.websiteHeaderImage || cachedObj.headerBannerImage;
                if (mobImg) {
                    pdfHeaderImg = (mobImg.startsWith('data:image') || mobImg.startsWith('http')) ? mobImg : ('uploads/' + mobImg);
                    if (!pdfHeaderImg.startsWith('data:image')) {
                        pdfHeaderImg += (pdfHeaderImg.includes('?') ? '&' : '?') + 'v=' + Date.now();
                    }
                }
            }
            if (pdfHeaderImg.startsWith('logo/pdf_header_banner_opt.jpg') && typeof document !== 'undefined') {
                const mobElem = document.getElementById('mobileTopHeaderImg');
                if (mobElem && mobElem.src && !mobElem.src.includes('pdf_header_banner_opt.jpg')) {
                    pdfHeaderImg = mobElem.src;
                    if (!pdfHeaderImg.startsWith('data:image') && !pdfHeaderImg.includes('v=')) {
                        pdfHeaderImg += (pdfHeaderImg.includes('?') ? '&' : '?') + 'v=' + Date.now();
                    }
                }
            }
        } catch(e) {}
        
                // Dynamic Committee Signatures
                let presidentName = "तेजस फटांगरे";
                let presidentPhone = "9370599259";
                let treasurerName = "धनंजय रणाते";
                let treasurerPhone = "9322134560";
                
                if (window.currentCommitteeData) {
                    const pres = window.currentCommitteeData.find(m => m.role.includes("अध्यक्ष"));
                    if(pres) { presidentName = pres.name; presidentPhone = pres.mobile; }
                    const treas = window.currentCommitteeData.find(m => m.role.includes("खजिनदार"));
                    if(treas) { treasurerName = treas.name; treasurerPhone = treas.mobile; }
                }
                
                let committeeHtml = '<div style="display:flex; justify-content:space-between; margin-top:30px; padding:0 30px;"><div style="text-align:center;"><div style="font-weight:800; font-size:20px; color:#5a2010; margin-bottom:5px;">अध्यक्ष</div><div style="font-weight:700; font-size:26px; color:#1a1a2e;">' + presidentName + '</div><div style="font-size:13px; color:#555555; margin-top:3px;">मो. नं - ' + presidentPhone + '</div></div><div style="text-align:center;"><div style="font-weight:800; font-size:20px; color:#5a2010; margin-bottom:5px;">खजिनदार</div><div style="font-weight:700; font-size:26px; color:#1a1a2e;">' + treasurerName + '</div><div style="font-size:13px; color:#555555; margin-top:3px;">मो. नं - ' + treasurerPhone + '</div></div></div>';
        try {
            const comRes = await fetch('/api/committee');
            const comData = await comRes.json();
            if (comData.success && comData.data && comData.data.length > 0) {
                committeeHtml = '<div class="pdf-page-break-avoid" style="page-break-inside:avoid; width:100%; margin-top:20px;">' +
                    '<div style="text-align:center; margin-bottom:15px;">' +
                        '<span style="color:#ff8c00; font-size:14px; margin-right:8px;">❖</span>' +
                        '<span style="font-size:17px; font-weight:800; color:#5a2010; letter-spacing:1px; text-shadow:0 1px 2px rgba(0,0,0,0.1);">उत्सव कार्यकारिणी</span>' +
                        '<span style="color:#ff8c00; font-size:14px; margin-left:8px;">❖</span>' +
                    '</div>' +
                    '<div style="display:flex; justify-content:center; flex-wrap:wrap; gap:12px; padding:0 10px;">';
                
                
                let orderedData = [...comData.data];
                const desiredOrder = [
                    "तेजस फटांगरे",
                    "धीरज झावरे",
                    "आदित्य मते",
                    "सार्थक माताडे",
                    "धनंजय रणाते",
                    "ओंकार वर्पे",
                    "तेजस देशमुख",
                    "तेजस वर्पे",
                    "वैभव सांगळे",
                    "निलेश कदम",
                    "शुभम पेटकर"
                ];
                orderedData.sort((a, b) => {
                    let nameA = a.name ? a.name.trim() : "";
                    let nameB = b.name ? b.name.trim() : "";
                    let indexA = desiredOrder.indexOf(nameA);
                    let indexB = desiredOrder.indexOf(nameB);
                    if (indexA === -1) indexA = 999;
                    if (indexB === -1) indexB = 999;
                    return indexA - indexB;
                });
                
                let rowsData = [];
                for (let i = 0; i < orderedData.length; i += 4) {
                    rowsData.push(orderedData.slice(i, i + 4));
                }

                // Clear any gap on the main container since we are creating row divs
                committeeHtml = committeeHtml.replace('gap:15px 0px;', 'gap:0px; flex-direction:column; align-items:center;');
                committeeHtml = committeeHtml.replace('gap:15px 5px;', 'gap:0px; flex-direction:column; align-items:center;');

                rowsData.forEach((rowGroup, rowIndex) => {
                    // Small margin-bottom for vertical gap
                    let marginBottom = rowIndex < rowsData.length - 1 ? '10px' : '0px';
                    committeeHtml += '<div style="display:flex; justify-content:center; gap:0px; margin-bottom:' + marginBottom + '; width:100%;">';
                    
                    rowGroup.forEach(m => {
                        let d = m.designation || '';
                        if (!d) {
                            if (m.role === 'president') d = 'अध्यक्ष';
                            else if (m.role === 'treasurer') d = 'खजिनदार';
                            else d = 'सदस्य';
                        }
                        
                        committeeHtml += '<div style="text-align:center; flex: 0 0 160px; max-width:160px; padding: 0 5px;">' +
                            '<div style="font-weight:700; font-size:15px; color:#1a1a2e; margin-bottom:2px;">' + (m.name || '') + '</div>' +
                            '<div style="font-weight:600; font-size:12px; color:#5a2010;">' + d + '</div>' +
                        '</div>';
                    });
                    
                    committeeHtml += '</div>';
                });
                committeeHtml += '</div></div>';
            }
        } catch(e) { console.error('Error fetching committee for PDF', e); }
return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=794"><title>Cashbook ${year}</title><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"><style>@media print{@page{margin:0 !important;size:A4 portrait !important;}html,body{width:100% !important;height:100% !important;margin:0 !important;padding:0 !important;background:#ffffff !important;-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;}.cover-page,.inner-page{width:100% !important;max-width:100% !important;margin:0 !important;padding:0 !important;box-sizing:border-box !important;page-break-after:always;overflow:hidden !important;}}*{box-sizing:border-box;margin:0;padding:0;touch-action:manipulation;}body{font-family:'Poppins','Noto Sans Devanagari',sans-serif;background:#f5f0eb;color:#1a1a2e;font-size:10px;line-height:1.4;}.cover-page{width:210mm;height:297mm;margin:0 auto;background:linear-gradient(160deg,#1a0800 0%,#3d1508 25%,#5a2010 50%,#3d1508 75%,#1a0800 100%);position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;page-break-after:always;box-shadow:0 0 20px rgba(0,0,0,0.15);}.cover-page::before{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:radial-gradient(ellipse at 30% 20%,rgba(255,140,0,0.15) 0%,transparent 50%),radial-gradient(ellipse at 70% 80%,rgba(255,215,0,0.1) 0%,transparent 50%);pointer-events:none;}.cover-outer-border{position:absolute;top:8mm;left:8mm;right:8mm;bottom:8mm;border:5px solid #ff8c00;border-radius:25px;box-shadow:0 0 30px rgba(255,140,0,0.3),inset 0 0 30px rgba(255,140,0,0.1);}.cover-inner-border{position:absolute;top:11mm;left:11mm;right:11mm;bottom:11mm;border:3px solid rgba(255,215,0,0.4);border-radius:20px;}.cover-corner{position:absolute;width:60px;height:60px;border:5px solid #ffd700;}.cover-corner.tl{top:14mm;left:14mm;border-right:none;border-bottom:none;border-radius:15px 0 0 0;}.cover-corner.tr{top:14mm;right:14mm;border-left:none;border-bottom:none;border-radius:0 15px 0 0;}.cover-corner.bl{bottom:14mm;left:14mm;border-right:none;border-top:none;border-radius:0 0 0 15px;}.cover-corner.br{bottom:14mm;right:14mm;border-left:none;border-top:none;border-radius:0 0 15px 0;}.cover-content{position:relative;z-index:10;display:flex;flex-direction:column;align-items:center;padding:30px;margin-top:-40px;}.cover-logo-wrap{width:350px;max-width:85vw;height:350px;max-height:85vw;position:relative;margin-bottom:25px;}.cover-logo-glow{position:absolute;top:-30px;left:-30px;right:-30px;bottom:-30px;background:radial-gradient(circle,rgba(255,140,0,0.7) 0%,rgba(255,140,0,0.3) 40%,transparent 70%);border-radius:50%;}.cover-logo-ring{position:absolute;top:-15px;left:-15px;right:-15px;bottom:-15px;border:6px solid rgba(255,215,0,0.7);border-radius:50%;}.cover-logo-ring2{position:absolute;top:-25px;left:-25px;right:-25px;bottom:-25px;border:4px solid rgba(255,215,0,0.3);border-radius:50%;}.cover-logo{width:100%;height:100%;border-radius:50%;border:6px solid #ffd700;box-shadow:0 0 0 6px #ffffff,0 0 60px rgba(255,140,0,0.8),0 10px 30px rgba(0,0,0,0.8);background-color:rgba(255,255,255,0.98);background-size:cover;background-position:center;background-repeat:no-repeat;position:relative;z-index:2;box-sizing:border-box;}.cover-mandal-name{font-size:30px;white-space:normal;font-weight:900;color:#ffd700;text-align:center;letter-spacing:2px;text-shadow:0 0 30px rgba(255,215,0,0.6),0 3px 10px rgba(0,0,0,0.7);line-height:1.4;border-left:6px solid #dc2626;border-right:6px solid #dc2626;padding:10px 35px;margin-top:10px;}.cover-divider{width:350px;max-width:80vw;height:4px;background:linear-gradient(90deg,transparent,#ffd700,#ff8c00,#ffd700,transparent);margin:18px auto;border-radius:3px;box-shadow:0 0 15px rgba(255,215,0,0.4);}.cover-subtitle{font-size:24px;font-weight:700;color:#ff8c00;text-align:center;letter-spacing:2px;margin-bottom:0;text-shadow:0 0 20px rgba(255,140,0,0.5);}.cover-tagline{font-size:24px;font-weight:700;color:#ff8c00;text-align:center;letter-spacing:2px;text-shadow:0 0 20px rgba(255,140,0,0.5);margin-bottom:0;}.cover-year-box{margin-top:30px;padding:15px 50px;border:3px solid #ffd700;border-radius:35px;background:linear-gradient(135deg,rgba(255,140,0,0.15),rgba(255,215,0,0.1));text-align:center;box-shadow:0 0 30px rgba(255,215,0,0.2);}.cover-year-label{font-size:30px;font-weight:800;color:#ffd700;display:inline-block;margin-right:12px;margin-bottom:0;letter-spacing:1px;text-shadow:0 0 25px rgba(255,215,0,0.5);}.cover-year-val{font-size:30px;font-weight:800;color:#ffd700;text-shadow:0 0 25px rgba(255,215,0,0.5);}.cover-footer{position:absolute;bottom:15mm;left:0;right:0;text-align:center;z-index:10;}.cover-footer-om{font-size:20px;color:#ffd700;margin-bottom:8px;letter-spacing:3px;}.cover-footer p{font-size:10px;color:#8b7355;letter-spacing:1.5px;line-height:1.6;}.inner-page{width:210mm;min-height:297mm;margin:0 auto;background:#fefcf9;page-break-after:always;position:relative;box-shadow:0 0 20px rgba(0,0,0,0.15);}.page-header-bar{background:linear-gradient(135deg,#b8860b 0%,#d4a017 40%,#b8860b 100%);position:relative;display:flex;align-items:center;justify-content:center;height:85px;}.page-header-bar::after{content:'';position:absolute;bottom:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#b8860b,#d4a017,#b8860b);}.header-info{position:absolute;left:0;right:0;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:2;}.header-info h1{font-size:26px;font-weight:900;color:#ffffff;letter-spacing:1px;text-shadow:0 2px 6px rgba(0,0,0,0.2);margin:0 0 4px 0;line-height:1.3;display:block;}.header-info p{font-size:16px;color:#ffffff;margin:0;font-weight:600;display:block;}.page-body{padding:18px 15px 15px;}.summary-section{margin-bottom:16px;}.summary-title{font-size:16px;margin-top:15px;font-weight:800;color:#5a2010;text-align:center;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;}.summary-title::after{content:'';display:block;width:70px;height:3px;background:linear-gradient(90deg,#ff8c00,#ffd700);margin:5px auto 0;border-radius:2px;}.summary-row{display:flex;gap:10px;}.sum-card{flex:1;padding:12px 10px;border-radius:10px;text-align:center;position:relative;overflow:hidden;}.sum-card::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;}.sum-card.green{background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:2px solid #86efac;}.sum-card.green::before{background:linear-gradient(90deg,#22c55e,#16a34a);}.sum-card.red{background:linear-gradient(135deg,#fef2f2,#fee2e2);border:2px solid #fca5a5;}.sum-card.red::before{background:linear-gradient(90deg,#ef4444,#dc2626);}.sum-card.purple{background:linear-gradient(135deg,#faf5ff,#f3e8ff);border:2px solid #d8b4fe;}.sum-card.purple::before{background:linear-gradient(90deg,#a855f7,#9333ea);}.sum-card h4{font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#888;margin:0 0 6px;}.sum-card .val{font-size:16px;font-weight:900;}.sum-card.green .val{color:#16a34a;}.sum-card.red .val{color:#dc2626;}.sum-card.purple .val{color:#9333ea;}.table-section{margin-top:12px;}.table-heading{font-size:11px;font-weight:800;color:#5a2010;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px;padding-left:14px;position:relative;}.table-heading::before{content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);width:8px;height:8px;background:#ff8c00;border-radius:50%;}.table-heading::after{content:'';display:block;width:50px;height:3px;background:linear-gradient(90deg,#ff8c00,#ffd700);margin-top:5px;border-radius:2px;}.data-table{width:100%;table-layout:fixed;border-collapse:collapse;border-radius:6px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.08);border:1.5px solid #bbbbbb;}.data-table thead{background:#f8f4f0;}.data-table th{color:#000000 !important;padding:10px 8px;font-size:13px;font-weight:900 !important;text-transform:uppercase;letter-spacing:0.3px;border:1px solid #bbbbbb;text-align:left;}.data-table th.right-align{text-align:right;}.data-table td{padding:8px;font-size:13px;border:1px solid #dddddd;word-break:break-word;}.data-table tbody tr:nth-child(odd){background:#ffffff;}.data-table tbody tr:nth-child(even){background:#f9f9f9;}.data-table .sr-no{text-align:center;font-weight:600;color:#000000;width:6%;}.data-table .remark{font-weight:600;color:#000000;width:28%;}.data-table .date{color:#000000;font-weight:500;width:13%;}.data-table .mode{text-align:center;font-weight:600;width:9%;color:#000000;}.data-table .cash-in-cell{text-align:right;font-weight:700;color:#16a34a;width:14%;}.data-table .cash-out-cell{text-align:right;font-weight:700;color:#dc2626;width:14%;}.data-table .balance-cell{text-align:right;font-weight:800;color:#7c3aed;width:16%;}.page-footer{margin-top:15px;text-align:center;}.page-footer .org{font-size:16px;font-weight:800;color:#1e293b;margin-bottom:8px;}.page-footer .dev{font-size:13px;color:#475569;font-weight:600;}.page-footer .dt{font-size:11px;color:#64748b;margin-top:5px;}</style></head><body><div class="cover-page"><div class="cover-outer-border"></div><div class="cover-inner-border"></div><div class="cover-corner tl"></div><div class="cover-corner tr"></div><div class="cover-corner bl"></div><div class="cover-corner br"></div><div class="cover-content"><div class="cover-logo-wrap"><div class="cover-logo-glow"></div><div class="cover-logo-ring"></div><div class="cover-logo-ring2"></div><div class="cover-logo" style="background-image: url('${logoSrc}');"></div></div><div class="cover-mandal-name">${s.orgName.includes('शिवसृष्टी') ? '<div style="font-size:1.9em; font-weight:900; color:#ffd700; text-shadow:0 0 25px rgba(255,140,0,1); line-height:1.2; margin-bottom:12px;">शिवसृष्टी</div><div style="font-size:1.1em; font-weight:800; color:#ffcc00; margin-bottom:5px;">सार्वजनिक उत्सव मंडळ</div>' : s.orgName}</div><div class="cover-divider"></div><div style="display:flex;align-items:baseline;justify-content:center;flex-wrap:wrap;gap:15px;margin-bottom:10px;text-align:center;"><span class="cover-subtitle" style="display:inline;">${s.subtitle}</span><span class="cover-tagline" style="display:inline;">${s.tagline === 'Ganpati Festival Cashbook' ? 'वर्ष : आठवे' : s.tagline}</span></div><div class="cover-year-box"><span class="cover-year-label">सन</span><span class="cover-year-val">${year}</span></div></div><div class="cover-footer"><div class="cover-footer-om">ॐ गण गणपतये नमः</div><p>Developed by | Dhananjay Ranate</p></div></div><div class="inner-page"><div style="width:100%;border-bottom:3px solid #ff8c00;padding:8px;box-sizing:border-box;"><img src="${pdfHeaderImg}" style="width:100%;height:170px;object-fit:fill;display:block;border:2px solid #ffd700;border-radius:8px;box-shadow:0 4px 15px rgba(255, 215, 0, 0.45);" alt="Header"></div><div class="page-body"><div class="summary-section"><div style="text-align:center; font-size:13px; font-weight:600; margin-bottom:15px; margin-top:-5px; color:#1a1a2e;">अधिकृत वेबसाईट : <a href="https://shivsrushti-utsav-mandal.onrender.com" target="_blank" style="color:#0000ee; text-decoration:none;">https://shivsrushti-utsav-mandal.onrender.com</a></div><div class="summary-title">आर्थिक अहवाल</div><div class="summary-row"><div class="sum-card green"><h4>Total Cash In</h4><div class="val">${formatPDFCurrency(totalCashIn)}</div></div><div class="sum-card red"><h4>Total Cash Out</h4><div class="val">${formatPDFCurrency(totalCashOut)}</div></div><div class="sum-card purple"><h4>Final Balance</h4><div class="val">${formatPDFCurrency(finalBalance)}</div></div></div></div><div class="table-section"><div class="table-heading">Transaction Records</div><table class="data-table"><thead><tr><th class="sr-no">#</th><th class="remark">Name</th><th class="date">Date</th><th class="mode">Mode</th><th class="right-align">Cash In</th><th class="right-align">Cash Out</th><th class="right-align">Balance</th></tr></thead><tbody>${rows}</tbody></table></div><div style=\"page-break-inside:avoid;break-inside:avoid;-webkit-column-break-inside:avoid;width:100%;\"><div style=\"height:1.5px;background:linear-gradient(90deg,#ff8c00,#ffd700,#ff8c00);margin:12px 0 8px 0;border-radius:2px;\"></div>${committeeHtml}<div class="page-footer" style=\"margin-top:15px; padding-bottom:20px;\"><div class="dev" style=\"font-size:13px; color:#475569; font-weight:600; text-align:center;\">Developed by | Dhananjay Ranate</div></div></div></div></div></body></html>`;
    }

    function renderPDFCards(from, to) {
        const slice = uploadedPDFsData.slice(from, to);
        return slice.map((pdf, idx) => {
            const s = getPDFSettings(pdf.year);
            const pOrg = pdf.orgName || s.orgName;
            const pSub = pdf.subtitle || s.subtitle;
            const pTag = pdf.tagline || s.tagline;
            const escSub = (pdf.subtitle || '').replace(/'/g, "\\'");
            const escTag = (pdf.tagline || '').replace(/'/g, "\\'");
            const escOrg = (pdf.orgName || '').replace(/'/g, "\\'");
            return `
            <div class="pdf-card-home" style="animation-delay: ${idx * 0.1}s">
                <div class="pdf-card-cover-mini">
                    <div class="mini-mandal">${pOrg}</div>
                    <div class="mini-divider"></div>
                    <div class="mini-subtitle">${pSub}</div>
                    <div class="mini-tagline">${pTag}</div>
                    <div class="mini-year">${pdf.year}</div>
                </div>
                <div class="pdf-card-title">${pdf.displayName.replace('.pdf', '')}</div>
                <div class="pdf-card-actions">
                    <button onclick="viewPDFHome('${pdf.filename}', '${pdf.year}', '${escSub}', '${escTag}', '${escOrg}', this)" class="pdf-card-btn view">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        View
                    </button>
                    <button onclick="downloadPDFHome('${pdf.filename}', '${pdf.year}', '${escSub}', '${escTag}', '${escOrg}', this)" class="pdf-card-btn download">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Download
                    </button>
                </div>
            </div>`;
        }).join('');
    }

    function renderPagination() {
        const perPage = getPDFsPerPage();
        const totalPages = Math.ceil(uploadedPDFsData.length / perPage);
        return `
            <div class="pdf-pagination">
                <button class="btn btn-secondary ripple" onclick="goToPDFPage(${uploadedPDFsPage - 1})" ${uploadedPDFsPage === 0 ? 'disabled' : ''}>
                    Previous
                </button>
                <span class="pdf-page-info">page ${uploadedPDFsPage + 1}/${totalPages}</span>
                <button class="btn btn-secondary ripple" onclick="goToPDFPage(${uploadedPDFsPage + 1})" ${uploadedPDFsPage >= totalPages - 1 ? 'disabled' : ''}>
                    Next
                </button>
            </div>
        `;
    }

    async function loadUploadedPDFsHome() {
        const grid = document.getElementById('uploadedPdfsGrid');
        if (!grid) { console.warn('[PDF] uploadedPdfsGrid not found'); return; }
        const prevContainer = document.getElementById('previousYearsContainer');
        if (prevContainer) prevContainer.classList.add('visible');

        try {
            console.log('[PDF] Fetching /api/uploaded-pdfs...');
            const response = await fetch(API_URL + '/api/uploaded-pdfs');
            const result = await response.json();
            console.log('[PDF] API Response:', JSON.stringify({ success: result.success, dataCount: result.data ? result.data.length : 0 }));
            if (result.data && result.data.length > 0) {
                console.log('[PDF] All PDFs:', result.data.map(p => ({ filename: p.filename, year: p.year, showOnHome: p.showOnHome })));
            }

            if (result.success && result.data && result.data.length > 0) {
                uploadedPDFsData = result.data;
                console.log('[PDF] Displaying all uploaded PDFs:', uploadedPDFsData.length, 'PDFs visible');
                if (uploadedPDFsData.length === 0) {
                    grid.innerHTML = '<div class="year-selector-container" style="justify-content:center; padding: 35px 20px; text-align:center; width:100%; box-sizing:border-box; grid-column: 1 / -1; margin: 0 auto; animation: none !important; transform: none !important;"><p style="font-weight:600; color:#ffffff !important; font-size: 16px; margin: 0; width: 100%;">सदर माहिती अद्ययावत करण्यात येत असून, लवकरच उपलब्ध करून देण्यात येईल..!!!</p></div>';
                    return;
                }
                uploadedPDFsPage = 0;
                const perPage = getPDFsPerPage();
                const to = Math.min(perPage, uploadedPDFsData.length);
                grid.innerHTML = renderPDFCards(0, to) + renderPagination();
                console.log('[PDF] Rendered', to, 'PDF cards');
            } else {
                console.warn('[PDF] No data or success=false');
                grid.innerHTML = '<div class="year-selector-container" style="justify-content:center; padding: 35px 20px; text-align:center; width:100%; box-sizing:border-box; grid-column: 1 / -1; margin: 0 auto; animation: none !important; transform: none !important;"><p style="font-weight:600; color:#ffffff !important; font-size: 16px; margin: 0; width: 100%;">सदर माहिती अद्ययावत करण्यात येत असून, लवकरच उपलब्ध करून देण्यात येईल..!!!</p></div>';
            }
        } catch (error) {
            console.error('[PDF] Error loading PDFs:', error);
            grid.innerHTML = '<div class="year-selector-container" style="justify-content:center; padding: 35px 20px; text-align:center; width:100%; box-sizing:border-box; grid-column: 1 / -1; margin: 0 auto; animation: none !important; transform: none !important;"><p style="font-weight:600; color:#ffffff !important; font-size: 16px; margin: 0; width: 100%;">सदर माहिती अद्ययावत करण्यात येत असून, लवकरच उपलब्ध करून देण्यात येईल..!!!</p></div>';
        }
    }

    function goToPDFPage(page) {
        const grid = document.getElementById('uploadedPdfsGrid');
        if (!grid) return;
        const perPage = getPDFsPerPage();
        const totalPages = Math.ceil(uploadedPDFsData.length / perPage);
        if (page < 0 || page >= totalPages) return;
        uploadedPDFsPage = page;
        const from = page * perPage;
        const to = Math.min(from + perPage, uploadedPDFsData.length);
        grid.innerHTML = renderPDFCards(from, to) + renderPagination();
    }

    // ===== CLIENT-SIDE COVER PDF GENERATION FOR UPLOADED PDFs =====
    // Generates the same rich cover page as panel-generated PDFs,
    // then merges it with uploaded PDF content via pdf-lib.

    function loadLogoForCover() {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement('canvas');
                canvas.width = this.naturalWidth;
                canvas.height = this.naturalHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(this, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = () => resolve('');
            img.src = 'logo/pdf_logo.jpeg';
        });
    }

    function createCoverHTML(year, logoSrc, pdfSubtitle, pdfTagline, pdfOrgName) {
        const fb = getPDFSettings(year);
        const s = {
            orgName: pdfOrgName || fb.orgName,
            subtitle: pdfSubtitle || fb.subtitle,
            tagline: pdfTagline || fb.tagline
        };
        return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
@media print {
  @page { margin: 0 !important; size: A4 portrait !important; }
  html, body { width: 100% !important; height: 100% !important; margin: 0 !important; padding: 0 !important; background: #ffffff !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  .cover-page { width: 100% !important; max-width: 100% !important; margin: 0 !important; box-sizing: border-box !important; page-break-after: always; overflow: hidden !important; }
}
@media screen and (max-width: 768px) {
  body { background: #1a0800 !important; margin: 0 !important; padding: 0 !important; }
  .cover-page { width: 100% !important; max-width: 100% !important; min-height: 100vh !important; height: auto !important; margin: 0 !important; box-shadow: none !important; }
}
* { box-sizing: border-box; margin: 0; padding: 0; touch-action: manipulation; }
body { font-family: 'Poppins', 'Noto Sans Devanagari', sans-serif; background: #f5f0eb; color: #1a1a2e; font-size: 10px; line-height: 1.4; }
.cover-page { width: 210mm; height: 297mm; margin: 0 auto; background: linear-gradient(160deg, #1a0800 0%, #3d1508 25%, #5a2010 50%, #3d1508 75%, #1a0800 100%); position: relative; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; page-break-after: always; box-shadow: 0 0 20px rgba(0,0,0,0.15); }
.cover-page::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(ellipse at 30% 20%, rgba(255,140,0,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(255,215,0,0.1) 0%, transparent 50%); pointer-events: none; }
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
.cover-logo { width: 100%; height: 100%; border-radius: 50%; border: 6px solid #ffd700; box-shadow: 0 0 0 6px #ffffff, 0 0 60px rgba(255,140,0,0.8), 0 10px 30px rgba(0,0,0,0.8); background-color: rgba(255,255,255,0.98); background-size: cover; background-position: center; background-repeat: no-repeat; position: relative; z-index: 2; box-sizing: border-box; }
.cover-mandal-name { font-size: 30px; white-space: normal; font-weight: 900; color: #ffd700; text-align: center; letter-spacing: 2px; text-shadow: 0 0 30px rgba(255,215,0,0.6), 0 3px 10px rgba(0,0,0,0.7); line-height: 1.4; border-left: 6px solid #dc2626; border-right: 6px solid #dc2626; padding: 10px 35px; margin-top: 10px; }
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
  <div class="cover-corner tl"></div>
  <div class="cover-corner tr"></div>
  <div class="cover-corner bl"></div>
  <div class="cover-corner br"></div>
  <div class="cover-content">
    <div class="cover-logo-wrap">
      <div class="cover-logo-glow"></div>
      <div class="cover-logo-ring"></div>
      <div class="cover-logo-ring2"></div>
      <div class="cover-logo" style="background-image: url('${logoSrc}');"></div>
    </div>
    <div class="cover-mandal-name">${s.orgName.includes('शिवसृष्टी') ? '<div style="font-size:1.9em; font-weight:900; color:#ffd700; text-shadow:0 0 25px rgba(255,140,0,1); line-height:1.2; margin-bottom:12px;">शिवसृष्टी</div><div style="font-size:1.1em; font-weight:800; color:#ffcc00; margin-bottom:5px;">सार्वजनिक उत्सव मंडळ</div>' : s.orgName}</div>
    <div class="cover-divider"></div>
    <div style="display:flex;align-items:baseline;justify-content:center;flex-wrap:wrap;gap:15px;margin-bottom:10px;text-align:center;">
      <span class="cover-subtitle" style="display:inline;">${s.subtitle}</span>
      <span class="cover-tagline" style="display:inline;">${s.tagline === 'Ganpati Festival Cashbook' ? 'वर्ष : आठवे' : s.tagline}</span>
    </div>
    <div class="cover-year-box">
      <span class="cover-year-label">सन</span>
      <span class="cover-year-val">${year}</span>
    </div>
  </div>
  <div class="cover-footer">
    <div class="cover-footer-om">\u0950 \u0917\u0923 \u0917\u0923\u092A\u0924\u092F\u0947 \u0928\u092E\u0903</div>
    <p>Developed by | Dhananjay Ranate</p>
  </div>
</div>
</body></html>`;
    }

    let cachedLogo = '';

    
    async function loadPDFLibraries() {
        if (window.jsPDF && window.html2canvas && window.PDFLib) return true;
        
        return new Promise((resolve, reject) => {
            let loaded = 0;
            const scripts = [
                'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js'
            ];
            
            function loadNext() {
                if (loaded >= scripts.length) {
                    resolve(true);
                    return;
                }
                const s = document.createElement('script');
                s.src = scripts[loaded];
                s.onload = () => { loaded++; loadNext(); };
                s.onerror = reject;
                document.head.appendChild(s);
            }
            loadNext();
        });
    }

    async function generateAndOpenMergedPDF(filename, year, download, pdfSubtitle, pdfTagline, pdfOrgName) {
        await loadPDFLibraries();
        window.jsPDF = window.jspdf.jsPDF;
        try {
            const logoDataURL = await loadLogoForCover();
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
            
            const { PDFDocument } = window.PDFLib;
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
                a.download = `Ganpati_Cashbook_${year}.pdf`;
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

    async function viewPDFHome(filename, year, subtitle, tagline, orgName, btn) {
        const originalText = btn ? btn.innerHTML : 'View';
        if (btn) { btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> कृपया थांबा...'; btn.disabled = true; }
        await new Promise(r => setTimeout(r, 50));
        await generateAndOpenMergedPDF(filename, year, false, subtitle, tagline, orgName);
        if (btn) { btn.innerHTML = originalText; btn.disabled = false; }
    }

    async function downloadPDFHome(filename, year, subtitle, tagline, orgName, btn) {
        const originalText = btn ? btn.innerHTML : 'Download';
        if (btn) { btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> कृपया थांबा...'; btn.disabled = true; }
        await new Promise(r => setTimeout(r, 50));
        await generateAndOpenMergedPDF(filename, year, true, subtitle, tagline, orgName);
        if (btn) { btn.innerHTML = originalText; btn.disabled = false; }
    }
    