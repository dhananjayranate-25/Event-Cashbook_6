
            (function() {
                try {
                    const cached = localStorage.getItem('settingsCache');
                    if (cached) {
                        const s = JSON.parse(cached);
                        const deskImg = s.websiteHeaderImage || s.topHeaderBannerImage || s.headerBannerImage;
                        const mobImg = s.posterHeaderImage || s.topHeaderBannerImage || s.websiteHeaderImage || s.headerBannerImage;
                        const dElem = document.getElementById('desktopTopHeaderImg');
                        const mElem = document.getElementById('mobileTopHeaderImg');
                        if (dElem && deskImg) {
                            const newSrc = (deskImg.startsWith('data:image') || deskImg.startsWith('http')) ? deskImg : ('uploads/' + deskImg);
                            const t1 = new Image(); t1.onload = () => dElem.src = newSrc; t1.src = newSrc;
                        }
                        if (mElem && mobImg) {
                            const newSrc = (mobImg.startsWith('data:image') || mobImg.startsWith('http')) ? mobImg : ('uploads/' + mobImg);
                            const t2 = new Image(); t2.onload = () => mElem.src = newSrc; t2.src = newSrc;
                        }
                    }
                } catch(e) {}
            })();
        