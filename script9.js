
    let cachedDonationCanvas = null;
    let cachedCustomCanvases = { vargani: null, mahaprasad: null, aagman: null };
    let preFetchedImageCache = {};

    function isInAppBrowser() {
        const ua = navigator.userAgent || navigator.vendor || window.opera || '';
        return /WhatsApp|Instagram|FBAN|FBAV|LinkedIn|Line|Twitter|Telegram/i.test(ua);
    }

    async function fetchImageAsBase64(url) {
        if (!url) return '';
        if (url.startsWith('data:image')) return url;
        if (preFetchedImageCache[url]) return preFetchedImageCache[url];
        try {
            const separator = url.includes('?') ? '&' : '?';
            const cacheBusterUrl = url + separator + 'cors_ignore_cache=' + Date.now();
            const res = await fetch(cacheBusterUrl, { mode: 'cors', credentials: 'omit' });
            if (!res.ok) throw new Error('Network res not ok');
            const blob = await res.blob();
            const base64 = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = () => resolve(url);
                reader.readAsDataURL(blob);
            });
            preFetchedImageCache[url] = base64;
            return base64;
        } catch (err) {
            console.warn('Failed to fetch image as base64, falling back to raw url:', url, err);
            return url;
        }
    }

    // Automatically pre-render canvases silently after page load to prevent mobile browser User Gesture timeout errors during share/download!
    window.addEventListener('load', () => {
        setTimeout(async () => {
            try {
                if (typeof loadPDFLibraries === 'function') await loadPDFLibraries();
                const s = window.appSettings || (typeof appSettings !== 'undefined' ? appSettings : {}) || {};
                if (s && s.pdfCustomSettings && s.pdfCustomSettings.headerLogoUrl) {
                    await fetchImageAsBase64(s.pdfCustomSettings.headerLogoUrl);
                }
                await captureDonationPoster();
                await captureCustomPoster('vargani');
                await captureCustomPoster('mahaprasad');
                await captureCustomPoster('aagman');
                console.log('All posters pre-rendered in background for zero-latency mobile sharing!');
            } catch(e) {
                console.log('Background poster pre-render info:', e);
            }
        }, 2000);
    });

    async function captureDonationPoster(forceRefresh = false) {
        if (!forceRefresh && cachedDonationCanvas) return cachedDonationCanvas;
        
        if (typeof html2canvas === 'undefined') {
            await loadPDFLibraries();
        }
        
        const clone = document.createElement('div');
        clone.style.position = 'absolute';
        clone.style.left = '-9999px';
        clone.style.top = '-9999px';
        clone.style.width = '900px';
        clone.style.maxWidth = '900px';
        clone.style.background = 'radial-gradient(circle at center, #3e0000 0%, #1a0000 100%)';
        clone.style.overflow = 'hidden';
        clone.style.border = '1px solid #3e0000';
        clone.style.padding = '30px';
        clone.style.display = 'flex';
        clone.style.flexDirection = 'column';
        clone.style.alignItems = 'center';
        
        // Add 4 premium corner accents
        const createCorner = (top, right, bottom, left) => {
            const c = document.createElement('div');
            c.style.position = 'absolute';
            c.style.width = '30px';
            c.style.height = '30px';
            c.style.border = '3px solid #ff8c00';
            c.style.zIndex = '0';
            if(top) { c.style.top = '10px'; c.style.borderBottom = 'none'; }
            if(bottom) { c.style.bottom = '10px'; c.style.borderTop = 'none'; }
            if(left) { c.style.left = '10px'; c.style.borderRight = 'none'; }
            if(right) { c.style.right = '10px'; c.style.borderLeft = 'none'; }
            return c;
        };
        clone.appendChild(createCorner(true, false, false, true));
        clone.appendChild(createCorner(true, true, false, false));
        clone.appendChild(createCorner(false, false, true, true));
        clone.appendChild(createCorner(false, true, true, false));

        // Inner glowing border
        const innerBorder = document.createElement('div');
        innerBorder.style.position = 'absolute';
        innerBorder.style.top = '15px';
        innerBorder.style.left = '15px';
        innerBorder.style.right = '15px';
        innerBorder.style.bottom = '15px';
        innerBorder.style.border = '1px solid rgba(255, 215, 0, 0.2)';
        innerBorder.style.zIndex = '0';
        innerBorder.style.pointerEvents = 'none';
        clone.appendChild(innerBorder);
        
        document.body.appendChild(clone);

        // 1. Header Wrapper (Image + Website Link)
        const headerWrapper = document.createElement('div');
        headerWrapper.style.position = 'relative';
        headerWrapper.style.width = '100%';
        headerWrapper.style.height = '260px';
        headerWrapper.style.zIndex = '10';
        
        const mandalPoster = document.createElement('img');
        mandalPoster.crossOrigin = 'anonymous';
        mandalPoster.style.width = '100%';
        mandalPoster.style.height = '100%';
        mandalPoster.style.objectFit = 'fill';
        mandalPoster.style.display = 'block';
        mandalPoster.style.border = '2px solid #ffd700';
        mandalPoster.style.borderRadius = '6px';
        mandalPoster.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.45)';
        mandalPoster.style.boxSizing = 'border-box';

        let headerUrl = 'logo/Receipt.jpeg';
        const customHeader = (window.appSettings && (window.appSettings.posterHeaderImage || window.appSettings.topHeaderBannerImage || window.appSettings.headerBannerImage)) || null;
        if (customHeader) {
            headerUrl = (customHeader.startsWith('data:image') || customHeader.startsWith('http')) ? customHeader : ('uploads/' + customHeader);
        }
        const headerBase64 = await fetchImageAsBase64(headerUrl);

        await new Promise((resolve) => {
            mandalPoster.onload = resolve;
            mandalPoster.onerror = resolve;
            mandalPoster.src = headerBase64 || headerUrl;
            headerWrapper.appendChild(mandalPoster);
        });
        
        clone.appendChild(headerWrapper);

        const tempWebsiteUrl = document.createElement('div');
        tempWebsiteUrl.style.position = 'relative';
        tempWebsiteUrl.style.zIndex = '10';
        tempWebsiteUrl.style.marginTop = '12px';
        tempWebsiteUrl.style.marginBottom = '5px';
        tempWebsiteUrl.style.color = '#e0e0e0';
        tempWebsiteUrl.style.textAlign = 'center';
        tempWebsiteUrl.style.fontSize = '16px';
        tempWebsiteUrl.style.fontFamily = "'Poppins', sans-serif";
        tempWebsiteUrl.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
        tempWebsiteUrl.style.width = '100%';
        tempWebsiteUrl.innerHTML = 'अधिकृत वेबसाईट : &nbsp;&nbsp; <span style="color: #ffd700;">https://shivsrushti-utsav-mandal.onrender.com</span>';
        clone.appendChild(tempWebsiteUrl);

        // 2. Donation Title with Inline Lines
        const posterTitleHtml = `
            <div style="display: flex; justify-content: center; align-items: center; margin: 20px 0; padding: 2px 0; position: relative; z-index: 10; gap: 10px; white-space: nowrap;">
                  <div style="width: 120px; flex-shrink: 0; height: 2px; background: linear-gradient(to right, transparent, #ffd700);"></div>
                  <div style="color: #ffd700; font-size: 20px;">✧</div>
                  <div style="color: #ffd700; font-size: 30px; font-weight: bold; font-family: 'Mukta', sans-serif; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); margin: 0; line-height: 1;">देणगी</div>
                  <div style="color: #ffd700; font-size: 20px;">✧</div>
                  <div style="width: 120px; flex-shrink: 0; height: 2px; background: linear-gradient(to left, transparent, #ffd700);"></div>
              </div>`;
        clone.insertAdjacentHTML('beforeend', posterTitleHtml);

        // Committee Members Block removed as requested
        // 6. QR and Bank Details Two-Column Layout
        const orgName = (typeof appSettings !== 'undefined' && appSettings.pdfCustomSettings && appSettings.pdfCustomSettings.orgName) ? appSettings.pdfCustomSettings.orgName : 'शिवसृष्टी सार्वजनिक उत्सव मंडळ';
        const upiId = 'dhananjayranate@ybl';
        
        // Get bank details safely from the DOM (fallback to hardcoded if not found)
        const getSafeText = (id, fallback) => {
            const el = document.getElementById(id);
            return el ? el.textContent.trim() : fallback;
        };
        
        const accountName = getSafeText('bankAccName', 'Dhananjay Sachin Ranate');
        const accountNumber = getSafeText('bankAccNo', '322502010043655');
        const ifscCode = getSafeText('bankIfsc', 'UBIN0532258');
        const bankName = getSafeText('bankBranch', 'Union Bank Of India');

        // Fetch the uploaded QR code image from the DOM
        let qrDataUrl = 'https://res.cloudinary.com/vu0ccgsm/image/upload/v1784816369/shivsrushti_boyz_migration/wr3lj8n8z4qbymcgpnaw.jpg'; // default
        const qrImgDOM = document.getElementById('donationQRImg');
        if (qrImgDOM && qrImgDOM.src) {
            qrDataUrl = qrImgDOM.src;
        }
        const qrBase64 = await fetchImageAsBase64(qrDataUrl);
        if (qrBase64) {
            qrDataUrl = qrBase64;
        } else {
            qrDataUrl = qrDataUrl + (qrDataUrl.includes('?') ? '&' : '?') + 'not-from-cache-please=' + Date.now();
        }

        const columnsWrapper = document.createElement('div');
        columnsWrapper.style.display = 'flex';
        columnsWrapper.style.justifyContent = 'space-between';
        columnsWrapper.style.width = '100%';
        columnsWrapper.style.margin = '0';
        columnsWrapper.style.position = 'relative';
        columnsWrapper.style.zIndex = '10';
        columnsWrapper.style.gap = '20px';

        // Left Column (QR)
        const leftCol = document.createElement('div');
        leftCol.style.flex = '1';
        leftCol.style.border = '5px double white';
        leftCol.style.borderRadius = '15px';
        leftCol.style.padding = '20px';
        leftCol.style.position = 'relative';
        leftCol.style.display = 'flex';
        leftCol.style.flexDirection = 'column';
        leftCol.style.alignItems = 'center';
        leftCol.innerHTML = `

            
            <div style="background: #fff; padding: 10px; border-radius: 10px; margin-bottom: 20px;">
                <img src="${qrDataUrl}" crossorigin="anonymous" style="width: 100%; max-width: 180px; display: block;">
            </div>
            
            <div style="color: #fff; font-weight: bold; font-size: 24px; margin-bottom: 10px; font-family: 'Poppins', sans-serif;">मो.नं +91 9322134560</div>
            
            <div style="color: #ccc; font-size: 17px; margin-bottom: 15px; font-family: 'Poppins', sans-serif;">UPI ID : dhananjayranate@ybl</div>
            
            <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                <div style="background: #fff; color: #5f259f; font-weight: bold; padding: 3px 8px; border-radius: 5px; font-size: 12px;">PhonePe</div>
                <div style="background: #fff; color: #002970; font-weight: bold; padding: 3px 8px; border-radius: 5px; font-size: 12px;">Paytm</div>
                <div style="background: #fff; color: #ea4335; font-weight: bold; padding: 3px 8px; border-radius: 5px; font-size: 12px;">G Pay</div>
                <div style="background: #fff; color: #000; font-weight: bold; padding: 3px 8px; border-radius: 5px; font-size: 12px;">UPI</div>
            </div>
            
            <div style="color: #ffd700; font-size: 17px; font-weight: 500;">UPI द्वारे स्कॅन करून देणगी द्या</div>
            <div style="color: #ffd700; margin-top: 5px; font-size: 10px;">✧✧✧ ◉ ✧✧✧</div>
        `;
        columnsWrapper.appendChild(leftCol);

        // Right Column (Bank Details)
        const rightCol = document.createElement('div');
        rightCol.style.flex = '1';
        rightCol.style.border = '5px double white';
        rightCol.style.borderRadius = '15px';
        rightCol.style.padding = '20px';
        rightCol.style.position = 'relative';
        rightCol.style.display = 'flex';
        rightCol.style.flexDirection = 'column';
        rightCol.innerHTML = `

            
            <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 2px; position: relative; z-index: 10; gap: 10px; white-space: nowrap; width: 100%;">
                <div style="flex-grow: 1; max-width: 60px; height: 2px; background: linear-gradient(to right, transparent, #ffd700);"></div>
                <div style="color: #ffd700; font-size: 16px;">✧</div>
                <div style="color: #ffd700; font-size: 24px; font-weight: bold; font-family: 'Mukta', sans-serif; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); margin: 0; line-height: 1;">बँक खात्याचा तपशील</div>
                <div style="color: #ffd700; font-size: 16px;">✧</div>
                <div style="flex-grow: 1; max-width: 60px; height: 2px; background: linear-gradient(to left, transparent, #ffd700);"></div>
            </div>
            
            <div style="margin-bottom: 15px;">
                <div style="color: #aaa; font-size: 21px; margin-bottom: 8px;">खात्याचे नाव:</div>
                <div style="color: #fff; font-size: 23px; font-weight: 600; font-family: 'Poppins', sans-serif;">${accountName}</div>
            </div>
            <div style="border-bottom: 1px dotted rgba(255,255,255,0.2); margin-bottom: 15px;"></div>
            
            <div style="margin-bottom: 15px;">
                <div style="color: #aaa; font-size: 21px; margin-bottom: 8px;">खाते क्रमांक:</div>
                <div style="color: #fff; font-size: 23px; font-weight: 600; font-family: 'Poppins', sans-serif;">${accountNumber}</div>
            </div>
            <div style="border-bottom: 1px dotted rgba(255,255,255,0.2); margin-bottom: 15px;"></div>
            
            <div style="margin-bottom: 15px;">
                <div style="color: #aaa; font-size: 21px; margin-bottom: 8px;">IFSC कोड:</div>
                <div style="color: #fff; font-size: 23px; font-weight: 600; font-family: 'Poppins', sans-serif;">${ifscCode}</div>
            </div>
            <div style="border-bottom: 1px dotted rgba(255,255,255,0.2); margin-bottom: 15px;"></div>
            
            <div>
                <div style="color: #aaa; font-size: 21px; margin-bottom: 8px;">बँक व शाखा:</div>
                <div style="color: #fff; font-size: 23px; font-weight: 600; font-family: 'Poppins', sans-serif;">${bankName}</div>
            </div>
        `;
        columnsWrapper.appendChild(rightCol);
        clone.appendChild(columnsWrapper);

        // Full Committee Members List Block
        const committeeListBlock = document.createElement('div');
        committeeListBlock.style.width = '100%';
        committeeListBlock.style.marginTop = '30px';
        committeeListBlock.style.position = 'relative';
        committeeListBlock.style.zIndex = '10';
        
        let dynamicMembersHTML = '';
        if (window.currentCommitteeData && window.currentCommitteeData.length > 0) {
            const desiredOrder = ['तेजस फटांगरे', 'धीरज झावरे', 'आदित्य मते', 'सार्थक माताडे', 'धनंजय रणाते', 'ओंकार वर्पे', 'तेजस देशमुख', 'तेजस वर्पे', 'वैभव सांगळे', 'निलेश कदम', 'शुभम पेटकर'];
            let orderedData = [...window.currentCommitteeData];
            orderedData.sort((a, b) => {
                let indexA = desiredOrder.indexOf(a.name ? a.name.trim() : '');
                let indexB = desiredOrder.indexOf(b.name ? b.name.trim() : '');
                if (indexA === -1) indexA = 999;
                if (indexB === -1) indexB = 999;
                return indexA - indexB;
            });
            
            let rows = [];
            for (let i = 0; i < orderedData.length; i += 4) {
                rows.push(orderedData.slice(i, i + 4));
            }
            
            rows.forEach(row => {
                dynamicMembersHTML += '<div style="display: flex; flex-wrap: wrap; justify-content: center; width: 100%; margin-bottom: 20px;">';
                row.forEach(m => {
                    let d = m.designation || '';
                    if (!d) {
                        if (m.role === 'president') d = 'अध्यक्ष';
                        else if (m.role === 'vicePresident') d = 'उपाध्यक्ष / मनोरंजन व स्पर्धा प्रमुख';
                        else if (m.role === 'secretary') d = 'सचिव / डेकोरेशन प्रमुख';
                        else if (m.role === 'jointSecretary') d = 'सहसचिव / सहसमन्वयक';
                        else if (m.role === 'treasurer') d = 'खजिनदार / समन्वयक';
                        else if (m.role === 'jointTreasurer') d = 'सहखजिनदार';
                        else if (m.role === 'socialMediaHead') d = 'सोशल मीडिया प्रमुख';
                        else if (m.role === 'publicityHead') d = 'प्रसिद्धी प्रमुख';
                        else d = 'कार्यकारी सदस्य';
                    }
                    dynamicMembersHTML += `
                    <div style="width: 25%; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 5px;">
                        <span style="font-weight: bold; font-size: 26px; color: #fff; line-height: 1.1; font-family: 'Mukta', sans-serif;">${m.name || ''}</span>
                        <span style="color: #ffd700; font-size: 17px; margin-top: 5px; font-family: 'Poppins', sans-serif; line-height: 1.2;">${d}</span>
                    </div>`;
                });
                dynamicMembersHTML += '</div>';
            });
        } else {
            dynamicMembersHTML = `
                  <!-- Row 1: 4 Names -->
                  <div style="width: 25%; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 5px;">
                      <span style="font-weight: bold; font-size: 26px; color: #fff; line-height: 1.1; font-family: 'Mukta', sans-serif;">तेजस फटांगरे</span>
                      <span style="color: #ffd700; font-size: 17px; margin-top: 5px; font-family: 'Poppins', sans-serif; line-height: 1.2;">अध्यक्ष</span>
                  </div>
                  <div style="width: 25%; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 5px;">
                      <span style="font-weight: bold; font-size: 26px; color: #fff; line-height: 1.1; font-family: 'Mukta', sans-serif;">धीरज झावरे</span>
                      <span style="color: #ffd700; font-size: 17px; margin-top: 5px; font-family: 'Poppins', sans-serif; line-height: 1.2;">उपाध्यक्ष / मनोरंजन व स्पर्धा प्रमुख</span>
                  </div>
                  <div style="width: 25%; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 5px;">
                      <span style="font-weight: bold; font-size: 26px; color: #fff; line-height: 1.1; font-family: 'Mukta', sans-serif;">आदित्य मते</span>
                      <span style="color: #ffd700; font-size: 17px; margin-top: 5px; font-family: 'Poppins', sans-serif; line-height: 1.2;">सचिव / डेकोरेशन प्रमुख</span>
                  </div>
                  <div style="width: 25%; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 5px;">
                      <span style="font-weight: bold; font-size: 26px; color: #fff; line-height: 1.1; font-family: 'Mukta', sans-serif;">सार्थक माताडे</span>
                      <span style="color: #ffd700; font-size: 17px; margin-top: 5px; font-family: 'Poppins', sans-serif; line-height: 1.2;">सहसचिव / सहसमन्वयक</span>
                  </div>

                  <!-- Row 2: 4 Names -->
                  <div style="width: 25%; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 5px;">
                      <span style="font-weight: bold; font-size: 26px; color: #fff; line-height: 1.1; font-family: 'Mukta', sans-serif;">धनंजय रणाते</span>
                      <span style="color: #ffd700; font-size: 17px; margin-top: 5px; font-family: 'Poppins', sans-serif; line-height: 1.2;">खजिनदार / समन्वयक</span>
                  </div>
                  <div style="width: 25%; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 5px;">
                      <span style="font-weight: bold; font-size: 26px; color: #fff; line-height: 1.1; font-family: 'Mukta', sans-serif;">ओंकार वर्पे</span>
                      <span style="color: #ffd700; font-size: 17px; margin-top: 5px; font-family: 'Poppins', sans-serif; line-height: 1.2;">सहखजिनदार</span>
                  </div>
                  <div style="width: 25%; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 5px;">
                      <span style="font-weight: bold; font-size: 26px; color: #fff; line-height: 1.1; font-family: 'Mukta', sans-serif;">तेजस देशमुख</span>
                      <span style="color: #ffd700; font-size: 17px; margin-top: 5px; font-family: 'Poppins', sans-serif; line-height: 1.2;">सोशल मीडिया प्रमुख</span>
                  </div>
                  <div style="width: 25%; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 5px;">
                      <span style="font-weight: bold; font-size: 26px; color: #fff; line-height: 1.1; font-family: 'Mukta', sans-serif;">तेजस वर्पे</span>
                      <span style="color: #ffd700; font-size: 17px; margin-top: 5px; font-family: 'Poppins', sans-serif; line-height: 1.2;">प्रसिद्धी प्रमुख</span>
                  </div>

                  <!-- Row 3: 3 Names -->
                  <div style="width: 25%; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 5px;">
                      <span style="font-weight: bold; font-size: 26px; color: #fff; line-height: 1.1; font-family: 'Mukta', sans-serif;">वैभव सांगळे</span>
                      <span style="color: #ffd700; font-size: 17px; margin-top: 5px; font-family: 'Poppins', sans-serif; line-height: 1.2;">कार्यकारी सदस्य</span>
                  </div>
                  <div style="width: 25%; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 5px;">
                      <span style="font-weight: bold; font-size: 26px; color: #fff; line-height: 1.1; font-family: 'Mukta', sans-serif;">निलेश कदम</span>
                      <span style="color: #ffd700; font-size: 17px; margin-top: 5px; font-family: 'Poppins', sans-serif; line-height: 1.2;">कार्यकारी सदस्य</span>
                  </div>
                  <div style="width: 25%; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 5px;">
                      <span style="font-weight: bold; font-size: 26px; color: #fff; line-height: 1.1; font-family: 'Mukta', sans-serif;">शुभम पेटकर</span>
                      <span style="color: #ffd700; font-size: 17px; margin-top: 5px; font-family: 'Poppins', sans-serif; line-height: 1.2;">कार्यकारी सदस्य</span>
                  </div>
            `;
        }

        committeeListBlock.innerHTML = `              <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 30px; padding: 2px 0; position: relative; z-index: 10; gap: 10px; white-space: nowrap;">
                  <div style="width: 120px; flex-shrink: 0; height: 2px; background: linear-gradient(to right, transparent, #ffd700);"></div>
                  <div style="color: #ffd700; font-size: 20px;">✧</div>
                  <div style="color: #ffd700; font-size: 30px; font-weight: bold; font-family: 'Mukta', sans-serif; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); margin: 0; line-height: 1;">उत्सव कार्यकारिणी</div>
                  <div style="color: #ffd700; font-size: 20px;">✧</div>
                  <div style="width: 120px; flex-shrink: 0; height: 2px; background: linear-gradient(to left, transparent, #ffd700);"></div>
              </div>
              <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px 0; padding: 0 10px;">
                  ${dynamicMembersHTML}
              </div>`;
        clone.appendChild(committeeListBlock);

        // Footer Section
        const footerHtml = `
            <div style="width: 100%; text-align: center; margin-top: 40px; position: relative; z-index: 10;">
                <div style="color: #aaa; font-size: 17px; font-family: 'Poppins', sans-serif;">Developed by | Dhananjay Ranate</div>
                <div style="display: flex; align-items: center; justify-content: center; width: 100%; margin-top: 10px;">
                    <div style="flex-grow: 1; height: 1px; background: linear-gradient(to right, transparent, #ffd700, transparent);"></div>
                    <div style="color: #ffd700; margin: 0 15px; font-size: 16px;">✧ ◉ ✧</div>
                    <div style="flex-grow: 1; height: 1px; background: linear-gradient(to right, transparent, #ffd700, transparent);"></div>
                </div>
            </div>
        `;
        clone.insertAdjacentHTML('beforeend', footerHtml);

        const canvas = await html2canvas(clone, {
            scale: 4,
            useCORS: true,
            backgroundColor: '#1a1a1a',
            windowWidth: 1200
        });
        
        document.body.removeChild(clone);
        cachedDonationCanvas = canvas;
        return canvas;
    }

    async function captureCustomPoster(type, forceRefresh = false) {
        if (!forceRefresh && cachedCustomCanvases[type]) return cachedCustomCanvases[type];
        
        if (typeof html2canvas === 'undefined') {
            await loadPDFLibraries();
        }
        
        const clone = document.createElement('div');
        clone.style.position = 'absolute';
        clone.style.left = '-9999px';
        clone.style.top = '-9999px';
        clone.style.width = '900px';
        clone.style.maxWidth = '900px';
        clone.style.background = 'radial-gradient(circle at center, #3e0000 0%, #1a0000 100%)';
        clone.style.overflow = 'hidden';
        clone.style.border = '1px solid #3e0000';
        clone.style.padding = '30px';
        clone.style.display = 'flex';
        clone.style.flexDirection = 'column';
        clone.style.alignItems = 'center';
        
        // Add 4 premium corner accents
        const createCorner = (top, right, bottom, left) => {
            const c = document.createElement('div');
            c.style.position = 'absolute';
            c.style.width = '30px';
            c.style.height = '30px';
            c.style.border = '3px solid #ff8c00';
            c.style.zIndex = '0';
            if(top) { c.style.top = '10px'; c.style.borderBottom = 'none'; }
            if(bottom) { c.style.bottom = '10px'; c.style.borderTop = 'none'; }
            if(left) { c.style.left = '10px'; c.style.borderRight = 'none'; }
            if(right) { c.style.right = '10px'; c.style.borderLeft = 'none'; }
            return c;
        };
        clone.appendChild(createCorner(true, false, false, true));
        clone.appendChild(createCorner(true, true, false, false));
        clone.appendChild(createCorner(false, false, true, true));
        clone.appendChild(createCorner(false, true, true, false));

        // Inner glowing border
        const innerBorder = document.createElement('div');
        innerBorder.style.position = 'absolute';
        innerBorder.style.top = '15px';
        innerBorder.style.left = '15px';
        innerBorder.style.right = '15px';
        innerBorder.style.bottom = '15px';
        innerBorder.style.border = '1px solid rgba(255, 215, 0, 0.2)';
        innerBorder.style.zIndex = '0';
        innerBorder.style.pointerEvents = 'none';
        clone.appendChild(innerBorder);
        
        document.body.appendChild(clone);

        // 1. Header Wrapper (Image + Website Link)
        const headerWrapper = document.createElement('div');
        headerWrapper.style.position = 'relative';
        headerWrapper.style.width = '100%';
        headerWrapper.style.height = '260px';
        headerWrapper.style.zIndex = '10';
        
        const mandalPoster = document.createElement('img');
        mandalPoster.crossOrigin = 'anonymous';
        mandalPoster.style.width = '100%';
        mandalPoster.style.height = '100%';
        mandalPoster.style.objectFit = 'fill';
        mandalPoster.style.display = 'block';
        mandalPoster.style.border = '2px solid #ffd700';
        mandalPoster.style.borderRadius = '6px';
        mandalPoster.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.45)';
        mandalPoster.style.boxSizing = 'border-box';

        let headerUrl = 'logo/Receipt.jpeg';
        const customHeader = (window.appSettings && (window.appSettings.posterHeaderImage || window.appSettings.topHeaderBannerImage || window.appSettings.headerBannerImage)) || null;
        if (customHeader) {
            headerUrl = (customHeader.startsWith('data:image') || customHeader.startsWith('http')) ? customHeader : ('uploads/' + customHeader);
        }
        const headerBase64 = await fetchImageAsBase64(headerUrl);

        await new Promise((resolve) => {
            mandalPoster.onload = resolve;
            mandalPoster.onerror = resolve;
            mandalPoster.src = headerBase64 || headerUrl;
            headerWrapper.appendChild(mandalPoster);
        });
        
        clone.appendChild(headerWrapper);

        const tempWebsiteUrl = document.createElement('div');
        tempWebsiteUrl.style.position = 'relative';
        tempWebsiteUrl.style.zIndex = '10';
        tempWebsiteUrl.style.marginTop = '12px';
        tempWebsiteUrl.style.marginBottom = '5px';
        tempWebsiteUrl.style.color = '#e0e0e0';
        tempWebsiteUrl.style.textAlign = 'center';
        tempWebsiteUrl.style.fontSize = '16px';
        tempWebsiteUrl.style.fontFamily = "'Poppins', sans-serif";
        tempWebsiteUrl.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
        tempWebsiteUrl.style.width = '100%';
        tempWebsiteUrl.innerHTML = 'अधिकृत वेबसाईट : &nbsp;&nbsp; <span style="color: #ffd700;">https://shivsrushti-utsav-mandal.onrender.com</span>';
        clone.appendChild(tempWebsiteUrl);

        // 2. Custom Title with Inline Lines
        const defaultTitle = type === 'vargani' ? 'वर्गणी आभार' : (type === 'mahaprasad' ? 'महाप्रसाद निमंत्रण' : (type === 'visarjan' ? 'गणपती विसर्जन सोहळा' : (type === 'custom' ? 'विशेष कार्यक्रम व सूचना' : 'आगमन सोहळा')));
        const s = window.appSettings || (typeof appSettings !== 'undefined' ? appSettings : {}) || {};
        let userTitle = defaultTitle;
        if (type === 'vargani') {
            userTitle = s.varganiAabharTitle || defaultTitle;
        } else if (type === 'mahaprasad') {
            userTitle = s.mahaprasadNimantranTitle || defaultTitle;
        } else if (type === 'visarjan') {
            userTitle = s.visarjanSohalaTitle || defaultTitle;
        } else if (type === 'custom') {
            userTitle = s.customEventTitle || defaultTitle;
        } else {
            userTitle = s.aagmanSohalaTitle || defaultTitle;
        }
        
        const posterTitleHtml = `
            <div style="display: flex; justify-content: center; align-items: center; margin: 20px 0; padding: 2px 0; position: relative; z-index: 10; gap: 10px; white-space: nowrap;">
                  <div style="width: 120px; flex-shrink: 0; height: 2px; background: linear-gradient(to right, transparent, #ffd700);"></div>
                  <div style="color: #ffd700; font-size: 20px;">✧</div>
                  <div style="color: #ffd700; font-size: 30px; font-weight: bold; font-family: 'Mukta', sans-serif; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); margin: 0; line-height: 1;">${userTitle}</div>
                  <div style="color: #ffd700; font-size: 20px;">✧</div>
                  <div style="width: 120px; flex-shrink: 0; height: 2px; background: linear-gradient(to left, transparent, #ffd700);"></div>
              </div>`;
        clone.insertAdjacentHTML('beforeend', posterTitleHtml);

        // Committee Members Block removed as requested
        // 6. Custom Message Content Box
        let customText = '';
        if (type === 'vargani') {
            customText = s.varganiAabharText || 'श्री गणरायाच्या कृपेने आयोजित श्री शिवसृष्टी सार्वजनिक उत्सव मंडळ, संगमनेर यांच्या गणेशोत्सवानिमित्त आपणास सस्नेह निमंत्रण!\n\nआपण दिलेल्या अमूल्य वर्गणीबद्दल आणि सहकार्याबद्दल मंडळ आपले मनःपूर्वक आभारी आहे.\n\n🌺 गणपती बाप्पा मोरया! 🌺';
        } else if (type === 'aagman') {
            customText = s.aagmanSohalaText || 'श्री गणरायाच्या कृपेने आयोजित श्री शिवसृष्टी सार्वजनिक उत्सव मंडळ, संगमनेर यांच्या गणेशोत्सवानिमित्त बाप्पाच्या आगमन सोहळ्यासाठी आपण व आपल्या संपूर्ण परिवारास सस्नेह निमंत्रण.\n\nबाप्पाच्या आगमनाचा आनंद द्विगुणित करण्यासाठी आपली उपस्थिती प्रार्थनीय आहे.\n\n📍 स्थळ: श्री शिवसृष्टी सार्वजनिक उत्सव मंडळ, संगमनेर\n\n🌺 गणपती बाप्पा मोरया!\n🌺 मंगलमूर्ती मोरया! 🌺';
        } else if (type === 'visarjan') {
            customText = s.visarjanSohalaText || 'श्री गणरायाच्या कृपेने आयोजित श्री शिवसृष्टी सार्वजनिक उत्सव मंडळ, संगमनेर यांच्या गणेशोत्सवातील गणपती विसर्जन मिरवणूक सोहळ्यासाठी आपण व आपल्या संपूर्ण परिवारास सस्नेह निमंत्रण!\n\nबाप्पाच्या निरोप समारंभात सामील होऊन विसर्जनाच्या जयघोषात सहभागी व्हावे ही नम्र विनंती.\n\n📍 स्थळ: श्री शिवसृष्टी सार्वजनिक उत्सव मंडळ, संगमनेर\n\n🌺 गणपती बाप्पा मोरया! पुढच्या वर्षी लवकर या! 🌺';
        } else if (type === 'custom') {
            customText = s.customEventText || 'श्री शिवसृष्टी सार्वजनिक उत्सव मंडळ, संगमनेर यांच्या वतीने सर्व भाविकांना कळविण्यात येते की मंडळाच्या गणेशोत्सवामध्ये आयोजित विशेष धार्मिक कार्यक्रम व विविध उपक्रमात सर्वांनी आवर्जून सहभागी व्हावे.\n\nआपले सहकार्य आणि उपस्थिती प्रार्थनीय आहे.\n\n🌺 गणपती बाप्पा मोरया! 🌺';
        } else {
            customText = s.mahaprasadNimantranText || 'श्री गणरायाच्या कृपेने आयोजित श्री शिवसृष्टी सार्वजनिक उत्सव मंडळ, संगमनेर यांच्या गणेशोत्सवानिमित्त आयोजित महाप्रसादाचा लाभ घेण्यासाठी आपण व आपल्या संपूर्ण परिवारास सस्नेह निमंत्रण.\n\nआपली उपस्थिती हीच आमच्यासाठी आशीर्वाद व उत्सवाची खरी शोभा आहे. आपण आवर्जून उपस्थित राहून श्री गणरायाचे दर्शन घ्यावे व महाप्रसादाचा लाभ घ्यावा, ही नम्र विनंती.\n\n📍 स्थळ: श्री शिवसृष्टी सार्वजनिक उत्सव मंडळ, संगमनेर\n🗓️ दिनांक: 18/8/2026\n🕔 वेळ: संध्याकाळी ठीक 7.30 वाजता\n\nआपली उपस्थिती प्रार्थनीय आहे.\n\n🌺 गणपती बाप्पा मोरया!\n🌺 मंगलमूर्ती मोरया! 🌺';
        }

          const textContainerWrapper = document.createElement('div');
        textContainerWrapper.style.width = '90%';
          textContainerWrapper.style.margin = '0 auto';
        textContainerWrapper.style.border = '5px double white';
        textContainerWrapper.style.borderRadius = '15px';
        textContainerWrapper.style.padding = '40px';
        textContainerWrapper.style.background = 'rgba(70, 0, 0, 0.6)';
        textContainerWrapper.style.position = 'relative';
        textContainerWrapper.style.zIndex = '10';
        textContainerWrapper.style.boxShadow = 'inset 0 0 20px rgba(0,0,0,0.5)';
        
        // Add corner accents to the content box
        textContainerWrapper.innerHTML = `
            <div style="position: absolute; top: 0; left: 0; width: 15px; height: 15px; border-top: 2px solid #ffd700; border-left: 2px solid #ffd700; border-top-left-radius: 15px;"></div>
            <div style="position: absolute; top: 0; right: 0; width: 15px; height: 15px; border-top: 2px solid #ffd700; border-right: 2px solid #ffd700; border-top-right-radius: 15px;"></div>
            <div style="position: absolute; bottom: 0; left: 0; width: 15px; height: 15px; border-bottom: 2px solid #ffd700; border-left: 2px solid #ffd700; border-bottom-left-radius: 15px;"></div>
            <div style="position: absolute; bottom: 0; right: 0; width: 15px; height: 15px; border-bottom: 2px solid #ffd700; border-right: 2px solid #ffd700; border-bottom-right-radius: 15px;"></div>
            <div style="color: #fff; font-size: 24px; line-height: 1.8; text-align: center; white-space: pre-wrap; font-family: 'Poppins', sans-serif; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">${customText.trim()}</div>
        `;
        clone.appendChild(textContainerWrapper);

        // Full Committee Members List Block
        const committeeListBlockCustom = document.createElement('div');
        committeeListBlockCustom.style.width = '100%';
        committeeListBlockCustom.style.marginTop = '30px';
        committeeListBlockCustom.style.position = 'relative';
        committeeListBlockCustom.style.zIndex = '10';
        
        let dynamicMembersHTML = '';
        if (window.currentCommitteeData && window.currentCommitteeData.length > 0) {
            const desiredOrder = ['तेजस फटांगरे', 'धीरज झावरे', 'आदित्य मते', 'सार्थक माताडे', 'धनंजय रणाते', 'ओंकार वर्पे', 'तेजस देशमुख', 'तेजस वर्पे', 'वैभव सांगळे', 'निलेश कदम', 'शुभम पेटकर'];
            let orderedData = [...window.currentCommitteeData];
            orderedData.sort((a, b) => {
                let indexA = desiredOrder.indexOf(a.name ? a.name.trim() : '');
                let indexB = desiredOrder.indexOf(b.name ? b.name.trim() : '');
                if (indexA === -1) indexA = 999;
                if (indexB === -1) indexB = 999;
                return indexA - indexB;
            });
            
            let rows = [];
            for (let i = 0; i < orderedData.length; i += 4) {
                rows.push(orderedData.slice(i, i + 4));
            }
            
            rows.forEach(row => {
                dynamicMembersHTML += '<div style="display: flex; flex-wrap: wrap; justify-content: center; width: 100%; margin-bottom: 20px;">';
                row.forEach(m => {
                    let d = m.designation || '';
                    if (!d) {
                        if (m.role === 'president') d = 'अध्यक्ष';
                        else if (m.role === 'vicePresident') d = 'उपाध्यक्ष / मनोरंजन व स्पर्धा प्रमुख';
                        else if (m.role === 'secretary') d = 'सचिव / डेकोरेशन प्रमुख';
                        else if (m.role === 'jointSecretary') d = 'सहसचिव / सहसमन्वयक';
                        else if (m.role === 'treasurer') d = 'खजिनदार / समन्वयक';
                        else if (m.role === 'jointTreasurer') d = 'सहखजिनदार';
                        else if (m.role === 'socialMediaHead') d = 'सोशल मीडिया प्रमुख';
                        else if (m.role === 'publicityHead') d = 'प्रसिद्धी प्रमुख';
                        else d = 'कार्यकारी सदस्य';
                    }
                    dynamicMembersHTML += `
                    <div style="width: 25%; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 5px;">
                        <span style="font-weight: bold; font-size: 26px; color: #fff; line-height: 1.1; font-family: 'Mukta', sans-serif;">${m.name || ''}</span>
                        <span style="color: #ffd700; font-size: 17px; margin-top: 5px; font-family: 'Poppins', sans-serif; line-height: 1.2;">${d}</span>
                    </div>`;
                });
                dynamicMembersHTML += '</div>';
            });
        } else {
            dynamicMembersHTML = `
                  <!-- Row 1: 4 Names -->
                  <div style="width: 25%; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 5px;">
                      <span style="font-weight: bold; font-size: 26px; color: #fff; line-height: 1.1; font-family: 'Mukta', sans-serif;">तेजस फटांगरे</span>
                      <span style="color: #ffd700; font-size: 17px; margin-top: 5px; font-family: 'Poppins', sans-serif; line-height: 1.2;">अध्यक्ष</span>
                  </div>
                  <div style="width: 25%; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 5px;">
                      <span style="font-weight: bold; font-size: 26px; color: #fff; line-height: 1.1; font-family: 'Mukta', sans-serif;">धीरज झावरे</span>
                      <span style="color: #ffd700; font-size: 17px; margin-top: 5px; font-family: 'Poppins', sans-serif; line-height: 1.2;">उपाध्यक्ष / मनोरंजन व स्पर्धा प्रमुख</span>
                  </div>
                  <div style="width: 25%; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 5px;">
                      <span style="font-weight: bold; font-size: 26px; color: #fff; line-height: 1.1; font-family: 'Mukta', sans-serif;">आदित्य मते</span>
                      <span style="color: #ffd700; font-size: 17px; margin-top: 5px; font-family: 'Poppins', sans-serif; line-height: 1.2;">सचिव / डेकोरेशन प्रमुख</span>
                  </div>
                  <div style="width: 25%; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 5px;">
                      <span style="font-weight: bold; font-size: 26px; color: #fff; line-height: 1.1; font-family: 'Mukta', sans-serif;">सार्थक माताडे</span>
                      <span style="color: #ffd700; font-size: 17px; margin-top: 5px; font-family: 'Poppins', sans-serif; line-height: 1.2;">सहसचिव / सहसमन्वयक</span>
                  </div>

                  <!-- Row 2: 4 Names -->
                  <div style="width: 25%; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 5px;">
                      <span style="font-weight: bold; font-size: 26px; color: #fff; line-height: 1.1; font-family: 'Mukta', sans-serif;">धनंजय रणाते</span>
                      <span style="color: #ffd700; font-size: 17px; margin-top: 5px; font-family: 'Poppins', sans-serif; line-height: 1.2;">खजिनदार / समन्वयक</span>
                  </div>
                  <div style="width: 25%; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 5px;">
                      <span style="font-weight: bold; font-size: 26px; color: #fff; line-height: 1.1; font-family: 'Mukta', sans-serif;">ओंकार वर्पे</span>
                      <span style="color: #ffd700; font-size: 17px; margin-top: 5px; font-family: 'Poppins', sans-serif; line-height: 1.2;">सहखजिनदार</span>
                  </div>
                  <div style="width: 25%; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 5px;">
                      <span style="font-weight: bold; font-size: 26px; color: #fff; line-height: 1.1; font-family: 'Mukta', sans-serif;">तेजस देशमुख</span>
                      <span style="color: #ffd700; font-size: 17px; margin-top: 5px; font-family: 'Poppins', sans-serif; line-height: 1.2;">सोशल मीडिया प्रमुख</span>
                  </div>
                  <div style="width: 25%; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 5px;">
                      <span style="font-weight: bold; font-size: 26px; color: #fff; line-height: 1.1; font-family: 'Mukta', sans-serif;">तेजस वर्पे</span>
                      <span style="color: #ffd700; font-size: 17px; margin-top: 5px; font-family: 'Poppins', sans-serif; line-height: 1.2;">प्रसिद्धी प्रमुख</span>
                  </div>

                  <!-- Row 3: 3 Names -->
                  <div style="width: 25%; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 5px;">
                      <span style="font-weight: bold; font-size: 26px; color: #fff; line-height: 1.1; font-family: 'Mukta', sans-serif;">वैभव सांगळे</span>
                      <span style="color: #ffd700; font-size: 17px; margin-top: 5px; font-family: 'Poppins', sans-serif; line-height: 1.2;">कार्यकारी सदस्य</span>
                  </div>
                  <div style="width: 25%; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 5px;">
                      <span style="font-weight: bold; font-size: 26px; color: #fff; line-height: 1.1; font-family: 'Mukta', sans-serif;">निलेश कदम</span>
                      <span style="color: #ffd700; font-size: 17px; margin-top: 5px; font-family: 'Poppins', sans-serif; line-height: 1.2;">कार्यकारी सदस्य</span>
                  </div>
                  <div style="width: 25%; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 5px;">
                      <span style="font-weight: bold; font-size: 26px; color: #fff; line-height: 1.1; font-family: 'Mukta', sans-serif;">शुभम पेटकर</span>
                      <span style="color: #ffd700; font-size: 17px; margin-top: 5px; font-family: 'Poppins', sans-serif; line-height: 1.2;">कार्यकारी सदस्य</span>
                  </div>
            `;
        }

        committeeListBlockCustom.innerHTML = `              <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 30px; padding: 2px 0; position: relative; z-index: 10; gap: 10px; white-space: nowrap;">
                  <div style="width: 120px; flex-shrink: 0; height: 2px; background: linear-gradient(to right, transparent, #ffd700);"></div>
                  <div style="color: #ffd700; font-size: 20px;">✧</div>
                  <div style="color: #ffd700; font-size: 30px; font-weight: bold; font-family: 'Mukta', sans-serif; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); margin: 0; line-height: 1;">उत्सव कार्यकारिणी</div>
                  <div style="color: #ffd700; font-size: 20px;">✧</div>
                  <div style="width: 120px; flex-shrink: 0; height: 2px; background: linear-gradient(to left, transparent, #ffd700);"></div>
              </div>
              <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px 0; padding: 0 10px;">
                  ${dynamicMembersHTML}
              </div>`;
        clone.appendChild(committeeListBlockCustom);

        // Footer Section
        const footerHtml = `
            <div style="width: 100%; text-align: center; margin-top: auto; padding-top: 40px; position: relative; z-index: 10;">
                <div style="color: #aaa; font-size: 17px; font-family: 'Poppins', sans-serif;">Developed by | Dhananjay Ranate</div>
                <div style="display: flex; align-items: center; justify-content: center; width: 100%; margin-top: 10px;">
                    <div style="flex-grow: 1; height: 1px; background: linear-gradient(to right, transparent, #ffd700, transparent);"></div>
                    <div style="color: #ffd700; margin: 0 15px; font-size: 16px;">✧ ◉ ✧</div>
                    <div style="flex-grow: 1; height: 1px; background: linear-gradient(to right, transparent, #ffd700, transparent);"></div>
                </div>
            </div>
        `;
        clone.insertAdjacentHTML('beforeend', footerHtml);

        const canvas = await html2canvas(clone, {
            scale: 4,
            useCORS: true,
            backgroundColor: '#1a1a1a',
            windowWidth: 1200
        });
        
        document.body.removeChild(clone);
        cachedCustomCanvases[type] = canvas;
        return canvas;
    }


    async function downloadDonationImage(btn) {
        let originalText = btn ? btn.innerHTML : '';
        if (btn) { btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> कृपया थांबा...'; btn.disabled = true; }
        
        try {
            let blob, dataUrl;
            if (window.appSettings && window.appSettings.donationPosterMode === 'custom' && window.appSettings.donationPosterImage) {
                try {
                    dataUrl = window.appSettings.donationPosterImage;
                    blob = dataURItoBlob(dataUrl);
                } catch(e) {
                    const canvas = await captureDonationPoster();
                    dataUrl = canvas.toDataURL('image/png', 1.0);
                    blob = dataURItoBlob(dataUrl);
                }
            } else {
                const canvas = await captureDonationPoster();
                dataUrl = canvas.toDataURL('image/png', 1.0);
                blob = dataURItoBlob(dataUrl);
            }
            const link = document.createElement('a');
            link.download = 'Donation_Poster.png';
            link.href = URL.createObjectURL(blob);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            if (isInAppBrowser()) {
                openLightbox(dataUrl || URL.createObjectURL(blob));
                alert('तुम्ही सध्या WhatsApp किंवा इन-ॲप ब्राउझरमध्ये आहात. जर डायरेक्ट डाउनलोड झाले नसेल, तर स्क्रीनवर आलेला फोटो लॉंग-प्रेस करा (दाबून धरा) आणि Save Image निवडा! किंवा वरच्या 3 डॉट्स (⋮) वरून Open in Chrome करा.');
            }
        } catch (error) {
            console.error('Error downloading image:', error);
            alert('पोस्टर डाउनलोड करताना त्रुटी आली. कृपया Google Chrome ब्राउझरमध्ये उघडा आणि पुन्हा प्रयत्न करा.');
        } finally {
            if (btn) { btn.innerHTML = originalText; btn.disabled = false; }
        }
    }

    async function shareDonationImage(btn) {
        let originalText = btn ? btn.innerHTML : '';
        if (btn) { btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> कृपया थांबा...'; btn.disabled = true; }
        await new Promise(r => setTimeout(r, 50));
        
        try {
            let file, dataUrl;
            const orgName = (typeof appSettings !== 'undefined' && appSettings.pdfCustomSettings && appSettings.pdfCustomSettings.orgName) ? appSettings.pdfCustomSettings.orgName : 'मंडळ';
            let customText = (typeof appSettings !== 'undefined' && appSettings.donationPosterText) ? appSettings.donationPosterText : `🌺 श्री गणेशाय नमः 🌺\n\nश्री गणेशोत्सव हा आपल्या सर्वांचा उत्सव आहे. या उत्सवाचे आयोजन अधिक भव्य, दिव्य आणि यशस्वी करण्यासाठी आपल्या सहकार्याची आम्हाला मनापासून अपेक्षा आहे.\n\nकृपया आपल्या सार्वजनिक गणेश उत्सव मंडळासाठी किमान ₹1111/- (एक हजार एकशे अकरा रुपये) वर्गणी/देणगी देऊन सहकार्य करा.\nआपण वर दिलेल्या QR कोड स्कॅन करून / UPI ID किंवा फोन नंबर द्वारे सहज देणगी देऊ शकता.\n\nआपले प्रत्येक योगदान आपल्या मंडळाचा गणेशोत्सव अधिक उत्साहाने, भक्तिभावाने आणि दिमाखात साजरा करण्यासाठी मोलाचे ठरेल. 🙏🌸\n\n॥ गणपती बाप्पा मोरया ॥\n॥ मंगलमूर्ती मोरया ॥\n॥ हर हर महादेव ॥`;
            
            let shareTextBase = customText.trim() + `\n\n- शिवसृष्टी सार्वजनिक उत्सव मंडळ, संगमनेर \n\n🌐अधिक माहितीसाठी अधिकृत संकेतस्थळ : https://shivsrushti-utsav-mandal.onrender.com\n\n===================\nउत्सव कार्यकारिणी\n===================\n`;
            if (window.currentCommitteeData && window.currentCommitteeData.length > 0) {
                const desiredOrder = ['तेजस फटांगरे', 'धीरज झावरे', 'आदित्य मते', 'सार्थक माताडे', 'धनंजय रणाते', 'ओंकार वर्पे', 'तेजस देशमुख', 'तेजस वर्पे', 'वैभव सांगळे', 'निलेश कदम', 'शुभम पेटकर'];
                let orderedData = [...window.currentCommitteeData];
                orderedData.sort((a, b) => {
                    let indexA = desiredOrder.indexOf(a.name ? a.name.trim() : '');
                    let indexB = desiredOrder.indexOf(b.name ? b.name.trim() : '');
                    if (indexA === -1) indexA = 999;
                    if (indexB === -1) indexB = 999;
                    return indexA - indexB;
                });
                orderedData.forEach(m => {
                    let d = m.designation || '';
                    if (!d) {
                        if (m.role === 'president') d = 'अध्यक्ष';
                        else if (m.role === 'vicePresident') d = 'उपाध्यक्ष / मनोरंजन व स्पर्धा प्रमुख';
                        else if (m.role === 'secretary') d = 'सचिव / डेकोरेशन प्रमुख';
                        else if (m.role === 'jointSecretary') d = 'सहसचिव / सहसमन्वयक';
                        else if (m.role === 'treasurer') d = 'खजिनदार / समन्वयक';
                        else if (m.role === 'jointTreasurer') d = 'सहखजिनदार';
                        else if (m.role === 'socialMediaHead') d = 'सोशल मीडिया प्रमुख';
                        else if (m.role === 'publicityHead') d = 'प्रसिद्धी प्रमुख';
                        else d = 'कार्यकारी सदस्य';
                    }
                    shareTextBase += (m.name || '') + ' - ' + d + '\n';
                });
            } else {
                shareTextBase += 'तेजस फटांगरे - अध्यक्ष\nधीरज झावरे - उपाध्यक्ष / मनोरंजन व स्पर्धा प्रमुख\nआदित्य मते - सचिव / डेकोरेशन प्रमुख\nसार्थक माताडे - सहसचिव / सहसमन्वयक\nधनंजय रणाते - खजिनदार / समन्वयक\nओंकार वर्पे - सहखजिनदार\nतेजस देशमुख - सोशल मीडिया प्रमुख\nतेजस वर्पे - प्रसिद्धी प्रमुख\nवैभव सांगळे - कार्यकारी सदस्य\nनिलेश कदम - कार्यकारी सदस्य\nशुभम पेटकर - कार्यकारी सदस्य\n';
            }
            
            // Note: shareData is built below after file is generated in shareDonationImage

            if (window.appSettings && window.appSettings.donationPosterMode === 'custom' && window.appSettings.donationPosterImage) {
                try {
                    dataUrl = window.appSettings.donationPosterImage;
                    const blob = dataURItoBlob(dataUrl);
                    file = new File([blob], 'Donation_Poster.png', { type: 'image/png' });
                } catch(e) {
                    const canvas = await captureDonationPoster();
                    dataUrl = canvas.toDataURL('image/png', 1.0);
                    const blob = dataURItoBlob(dataUrl);
                    file = new File([blob], 'Donation_Poster.png', { type: 'image/png' });
                }
            } else {
                const canvas = await captureDonationPoster();
                dataUrl = canvas.toDataURL('image/png', 1.0);
                const blob = dataURItoBlob(dataUrl);
                file = new File([blob], 'Donation_Poster.png', { type: 'image/png' });
            }

            const shareData = {
                title: orgName + ' - देणगी',
                text: shareTextBase.trim(),
                files: [file]
            };

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share(shareData);
            } else {
                // Download fallback and open lightbox for in-app browser workaround
                const link = document.createElement('a');
                link.download = 'Donation_Poster.png';
                link.href = dataUrl || URL.createObjectURL(file);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                if (dataUrl) openLightbox(dataUrl);
                if (isInAppBrowser()) {
                    alert('तुम्ही सध्या WhatsApp किंवा इन-ॲप ब्राउझरमध्ये आहात. स्क्रीनवर आलेला फोटो लॉंग-प्रेस (दाबून धरा) आणि थेट Share Image किंवा Save Image करा!');
                } else {
                    alert('तुमच्या डिव्हाइसवर डायरेक्ट इमेज शेअरिंग उपलब्ध नाही. इमेज डाउनलोड झाली आहे व स्क्रीनवर उघडली आहे! तुम्ही या फोटोवर लॉंग-प्रेस करून थेट Share करू शकता.');
                }
            }
        } catch (shareErr) {
            console.log('Share action was cancelled or failed:', shareErr);
            if (shareErr.name !== 'AbortError' && !String(shareErr).includes('AbortError') && !String(shareErr).toLowerCase().includes('cancel') && !String(shareErr).toLowerCase().includes('abort')) {
                const link = document.createElement('a');
                link.download = 'Donation_Poster.png';
                link.href = dataUrl || (file ? URL.createObjectURL(file) : '');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                if (dataUrl) openLightbox(dataUrl);
                if (isInAppBrowser()) {
                    alert('तुम्ही सध्या WhatsApp किंवा इन-ॲप ब्राउझरमध्ये आहात. स्क्रीनवर आलेला फोटो लॉंग-प्रेस (दाबून धरा) आणि थेट Share Image किंवा Save Image करा!');
                } else {
                    alert('डायरेक्ट शेअरिंगऐवजी पोस्टर स्क्रीनवर उघडले आहे आणि डाउनलोडही झाले आहे! फोटोवर लॉंग-प्रेस करून तुम्ही थेट Share करू शकता.');
                }
            }
        } finally {
            if (btn) { btn.innerHTML = originalText; btn.disabled = false; }
        }
    }

    async function viewCustomPoster(type, btn) {
        let originalText = btn ? btn.innerHTML : '';
        if (btn) { btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'; btn.disabled = true; }
        try {
            const canvas = await captureCustomPoster(type, true);
            const dataUrl = canvas.toDataURL('image/png', 1.0);
            openLightbox(dataUrl);
        } catch (error) {
            console.error('Error viewing poster:', error);
            alert('पोस्टर लोड होण्यास अडचण आली.');
        } finally {
            if (btn) { btn.innerHTML = originalText; btn.disabled = false; }
        }
    }

    async function shareCustomPoster(type, btn) {
        let originalText = btn ? btn.innerHTML : '';
        if (btn) { btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> कृपया थांबा...'; btn.disabled = true; }
        
        let dataUrl = '';
        let file = null;
        try {
            const canvas = await captureCustomPoster(type, true);
            dataUrl = canvas.toDataURL('image/png', 1.0);
            const blob = dataURItoBlob(dataUrl);
            const filename = type === 'vargani' ? 'Vargani_Aabhar.png' : (type === 'mahaprasad' ? 'Mahaprasad_Nimantran.png' : (type === 'visarjan' ? 'Ganpati_Visarjan.png' : (type === 'custom' ? 'Vishesh_Karyakram.png' : 'Aagman_Sohala.png')));
            file = new File([blob], filename, { type: 'image/png' });
            
            const s = window.appSettings || (typeof appSettings !== 'undefined' ? appSettings : {}) || {};
            const orgName = (s.pdfCustomSettings && s.pdfCustomSettings.orgName) ? s.pdfCustomSettings.orgName : 'मंडळ';
            const titleStr = type === 'vargani' ? (s.varganiAabharTitle || 'वर्गणी आभार') : (type === 'mahaprasad' ? (s.mahaprasadNimantranTitle || 'महाप्रसाद निमंत्रण') : (type === 'visarjan' ? (s.visarjanSohalaTitle || 'गणपती विसर्जन सोहळा') : (type === 'custom' ? (s.customEventTitle || 'विशेष कार्यक्रम व सूचना') : (s.aagmanSohalaTitle || 'आगमन सोहळा'))));
            let customText = '';
            if (type === 'vargani') {
                customText = s.varganiAabharText || 'श्री गणरायाच्या कृपेने आयोजित श्री शिवसृष्टी सार्वजनिक उत्सव मंडळ, संगमनेर यांच्या गणेशोत्सवानिमित्त आपणास सस्नेह निमंत्रण!\n\nआपण दिलेल्या अमूल्य वर्गणीबद्दल आणि सहकार्याबद्दल मंडळ आपले मनःपूर्वक आभारी आहे.\n\n🌺 गणपती बाप्पा मोरया! 🌺';
            } else if (type === 'aagman') {
                customText = s.aagmanSohalaText || 'श्री गणरायाच्या कृपेने आयोजित श्री शिवसृष्टी सार्वजनिक उत्सव मंडळ, संगमनेर यांच्या गणेशोत्सवानिमित्त बाप्पाच्या आगमन सोहळ्यासाठी आपण व आपल्या संपूर्ण परिवारास सस्नेह निमंत्रण.\n\nबाप्पाच्या आगमनाचा आनंद द्विगुणित करण्यासाठी आपली उपस्थिती प्रार्थनीय आहे.\n\n📍 स्थळ: श्री शिवसृष्टी सार्वजनिक उत्सव मंडळ, संगमनेर\n\n🌺 गणपती बाप्पा मोरया!\n🌺 मंगलमूर्ती मोरया! 🌺';
            } else if (type === 'visarjan') {
                customText = s.visarjanSohalaText || 'श्री गणरायाच्या कृपेने आयोजित श्री शिवसृष्टी सार्वजनिक उत्सव मंडळ, संगमनेर यांच्या गणेशोत्सवातील गणपती विसर्जन मिरवणूक सोहळ्यासाठी आपण व आपल्या संपूर्ण परिवारास सस्नेह निमंत्रण!\n\nबाप्पाच्या निरोप समारंभात सामील होऊन विसर्जनाच्या जयघोषात सहभागी व्हावे ही नम्र विनंती.\n\n📍 स्थळ: श्री शिवसृष्टी सार्वजनिक उत्सव मंडळ, संगमनेर\n\n🌺 गणपती बाप्पा मोरया! पुढच्या वर्षी लवकर या! 🌺';
            } else if (type === 'custom') {
                customText = s.customEventText || 'श्री शिवसृष्टी सार्वजनिक उत्सव मंडळ, संगमनेर यांच्या वतीने सर्व भाविकांना कळविण्यात येते की मंडळाच्या गणेशोत्सवामध्ये आयोजित विशेष धार्मिक कार्यक्रम व विविध उपक्रमात सर्वांनी आवर्जून सहभागी व्हावे.\n\nआपले सहकार्य आणि उपस्थिती प्रार्थनीय आहे.\n\n🌺 गणपती बाप्पा मोरया! 🌺';
            } else {
                customText = s.mahaprasadNimantranText || 'श्री गणरायाच्या कृपेने आयोजित श्री शिवसृष्टी सार्वजनिक उत्सव मंडळ, संगमनेर यांच्या गणेशोत्सवानिमित्त आयोजित महाप्रसादाचा लाभ घेण्यासाठी आपण व आपल्या संपूर्ण परिवारास सस्नेह निमंत्रण.\n\nआपली उपस्थिती हीच आमच्यासाठी आशीर्वाद व उत्सवाची खरी शोभा आहे. आपण आवर्जून उपस्थित राहून श्री गणरायाचे दर्शन घ्यावे व महाप्रसादाचा लाभ घ्यावा, ही नम्र विनंती.\n\n📍 स्थळ: श्री शिवसृष्टी सार्वजनिक उत्सव मंडळ, संगमनेर\n🗓️ दिनांक: 18/8/2026\n🕔 वेळ: संध्याकाळी ठीक 7.30 वाजता\n\nआपली उपस्थिती प्रार्थनीय आहे.\n\n🌺 गणपती बाप्पा मोरया!\n🌺 मंगलमूर्ती मोरया! 🌺';
            }

            let shareTextBase = customText.trim() + `\n\n- शिवसृष्टी सार्वजनिक उत्सव मंडळ, संगमनेर \n\n🌐अधिक माहितीसाठी अधिकृत संकेतस्थळ : https://shivsrushti-utsav-mandal.onrender.com\n\n===================\nउत्सव कार्यकारिणी\n===================\n`;
            if (window.currentCommitteeData && window.currentCommitteeData.length > 0) {
                const desiredOrder = ['तेजस फटांगरे', 'धीरज झावरे', 'आदित्य मते', 'सार्थक माताडे', 'धनंजय रणाते', 'ओंकार वर्पे', 'तेजस देशमुख', 'तेजस वर्पे', 'वैभव सांगळे', 'निलेश कदम', 'शुभम पेटकर'];
                let orderedData = [...window.currentCommitteeData];
                orderedData.sort((a, b) => {
                    let indexA = desiredOrder.indexOf(a.name ? a.name.trim() : '');
                    let indexB = desiredOrder.indexOf(b.name ? b.name.trim() : '');
                    if (indexA === -1) indexA = 999;
                    if (indexB === -1) indexB = 999;
                    return indexA - indexB;
                });
                orderedData.forEach(m => {
                    let d = m.designation || '';
                    if (!d) {
                        if (m.role === 'president') d = 'अध्यक्ष';
                        else if (m.role === 'vicePresident') d = 'उपाध्यक्ष / मनोरंजन व स्पर्धा प्रमुख';
                        else if (m.role === 'secretary') d = 'सचिव / डेकोरेशन प्रमुख';
                        else if (m.role === 'jointSecretary') d = 'सहसचिव / सहसमन्वयक';
                        else if (m.role === 'treasurer') d = 'खजिनदार / समन्वयक';
                        else if (m.role === 'jointTreasurer') d = 'सहखजिनदार';
                        else if (m.role === 'socialMediaHead') d = 'सोशल मीडिया प्रमुख';
                        else if (m.role === 'publicityHead') d = 'प्रसिद्धी प्रमुख';
                        else d = 'कार्यकारी सदस्य';
                    }
                    shareTextBase += (m.name || '') + ' - ' + d + '\n';
                });
            } else {
                shareTextBase += 'तेजस फटांगरे - अध्यक्ष\nधीरज झावरे - उपाध्यक्ष / मनोरंजन व स्पर्धा प्रमुख\nआदित्य मते - सचिव / डेकोरेशन प्रमुख\nसार्थक माताडे - सहसचिव / सहसमन्वयक\nधनंजय रणाते - खजिनदार / समन्वयक\nओंकार वर्पे - सहखजिनदार\nतेजस देशमुख - सोशल मीडिया प्रमुख\nतेजस वर्पे - प्रसिद्धी प्रमुख\nवैभव सांगळे - कार्यकारी सदस्य\nनिलेश कदम - कार्यकारी सदस्य\nशुभम पेटकर - कार्यकारी सदस्य\n';
            }
            
            const shareData = {
                title: orgName + ' - ' + titleStr,
                text: shareTextBase.trim(),
                files: [file]
            };

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share(shareData);
            } else {
                // Download fallback and lightbox preview
                const link = document.createElement('a');
                link.download = filename;
                link.href = dataUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                openLightbox(dataUrl);
                if (isInAppBrowser()) {
                    alert('तुम्ही सध्या WhatsApp किंवा इन-ॲप ब्राउझरमध्ये आहात. स्क्रीनवर आलेला फोटो लॉंग-प्रेस (दाबून धरा) आणि थेट Share Image किंवा Save Image करा!');
                } else {
                    alert('तुमच्या डिव्हाइसवर डायरेक्ट इमेज शेअरिंग उपलब्ध नाही. इमेज डाउनलोड झाली आहे व स्क्रीनवर उघडली आहे! तुम्ही या फोटोवर लॉंग-प्रेस करून थेट Share करू शकता.');
                }
            }
        } catch (shareErr) {
            console.log('Share action was cancelled or failed:', shareErr);
            if (shareErr.name !== 'AbortError' && !String(shareErr).includes('AbortError') && !String(shareErr).toLowerCase().includes('cancel') && !String(shareErr).toLowerCase().includes('abort')) {
                const filename = type === 'vargani' ? 'Vargani_Aabhar.png' : (type === 'mahaprasad' ? 'Mahaprasad_Nimantran.png' : 'Aagman_Sohala.png');
                if (dataUrl) {
                    const link = document.createElement('a');
                    link.download = filename;
                    link.href = dataUrl;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    openLightbox(dataUrl);
                    if (isInAppBrowser()) {
                        alert('तुम्ही सध्या WhatsApp किंवा इन-ॲप ब्राउझरमध्ये आहात. स्क्रीनवर आलेला फोटो लॉंग-प्रेस (दाबून धरा) आणि थेट Share Image किंवा Save Image करा!');
                    } else {
                        alert('डायरेक्ट शेअरिंगऐवजी पोस्टर स्क्रीनवर उघडले आहे आणि डाउनलोडही झाले आहे! फोटोवर लॉंग-प्रेस करून तुम्ही थेट Share करू शकता.');
                    }
                } else if (shareErr.name === 'SecurityError' || (shareErr.message && shareErr.message.includes('Tainted'))) {
                    alert('सिक्युरिटी एरर: क्रॉस-डोमेन फोटो लोड होण्यात अडचण आली. कृपया पेज रीफ्रेश करा आणि पुन्हा प्रयत्न करा.');
                } else {
                    alert('शेअर करताना त्रुटी आली: ' + (shareErr.message || shareErr));
                }
            }
        } finally {
            if (btn) { btn.innerHTML = originalText; btn.disabled = false; }
        }
    }

    function openLightbox(src) {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightboxImg');
        if (lightbox && lightboxImg) {
            lightboxImg.src = src;
            lightbox.style.display = 'flex';
        }
    }

    function closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.style.display = 'none';
        }
    }
    