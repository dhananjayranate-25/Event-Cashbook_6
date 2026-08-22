
                (function() {
                    try {
                        const cached = localStorage.getItem('settingsCache');
                        if (cached) {
                            const s = JSON.parse(cached);
                            if (s.aboutMandalTitle) {
                                const titleElem = document.getElementById('aboutTitleText');
                                if (titleElem) titleElem.textContent = s.aboutMandalTitle;
                            }
                            if (s.aboutMandalSubtitle) {
                                const subElem = document.getElementById('aboutSubtitleText');
                                if (subElem) subElem.textContent = s.aboutMandalSubtitle;
                            }
                            if (s.aboutMandalDetails && s.aboutMandalDetails.trim() !== "") {
                                const container = document.getElementById('aboutDetailsContainer');
                                if (container) {
                                    const paras = s.aboutMandalDetails.split('\n').filter(p => p.trim() !== "");
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
                        }
                    } catch(e) {}
                })();
            