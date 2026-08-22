
                                (function() {
                                    try {
                                        const cached = localStorage.getItem('settingsCache');
                                        if (cached) {
                                            const s = JSON.parse(cached);
                                            const photoElem = document.getElementById('aboutGanpatiPhoto');
                                            if (photoElem) {
                                                if (s.aboutMandalPhoto) {
                                                    photoElem.src = s.aboutMandalPhoto;
                                                } else if (s.heroBannerImage) {
                                                    photoElem.src = s.heroBannerImage.startsWith('data:') || s.heroBannerImage.startsWith('http') ? s.heroBannerImage : (s.heroBannerImage.startsWith('uploads/') ? s.heroBannerImage : 'uploads/' + s.heroBannerImage);
                                                }
                                            }
                                        }
                                    } catch(e) {}
                                })();
                            