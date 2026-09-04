document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================
       1. CONFIGURATION & MOCK DATABASE
       (Replace this with an actual API fetch call when backend is ready)
    ========================================================= */
    const DATABASE_CONNECTED = true; // Set to false to show "Pending/Prepared" state globally

    const mockBatchDatabase = {
        "GD-2310-001": {
            product: "Traditional A2 Ghee - 500ml",
            batch: "GD-2310-001",
            quantity: "500 ml",
            packDate: "15 Oct 2023",
            bestBefore: "14 Oct 2024",
            ingredients: "100% Cow Milk Fat",
            storage: "Store in a cool, dry place away from direct sunlight.",
            reportStatus: "Verified report available",
            reportUrl: "lab-report.html"
        },
        "GD-2401-055": {
            product: "Traditional A2 Ghee - 1L",
            batch: "GD-2401-055",
            quantity: "1 Litre",
            packDate: "10 Jan 2024",
            bestBefore: "09 Jan 2025",
            ingredients: "100% Cow Milk Fat",
            storage: "Store in a cool, dry place away from direct sunlight.",
            reportStatus: "Report not currently published",
            reportUrl: null
        }
    };


    /* =========================================================
       2. UI ELEMENTS
    ========================================================= */


    // Tabs & Interfaces
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const lookupInterface = document.getElementById('lookupInterface');
    const lookupResults = document.getElementById('lookupResults');
    const btnScrollToScan = document.getElementById('btnScrollToScan');
    const btnScrollToManual = document.getElementById('btnScrollToManual');
    
    // Result States
    const stateStates = {
        loading: document.getElementById('stateLoading'),
        found: document.getElementById('stateFound'),
        notFound: document.getElementById('stateNotFound'),
        pending: document.getElementById('statePending')
    };
    
    // Forms & Inputs
    const manualBatchForm = document.getElementById('manualBatchForm');
    const batchInput = document.getElementById('batchInput');
    const btnResetLookups = document.querySelectorAll('.btnResetLookup');

    // Modal
    const helpModal = document.getElementById('helpModal');
    const btnOpenHelpModal = document.getElementById('btnOpenHelpModal');
    const closeBtns = document.querySelectorAll('.close-modal, .close-modal-btn');




    /* =========================================================
       4. SCROLL REVEAL ANIMATIONS
    ========================================================= */
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    revealElements.forEach(el => revealObserver.observe(el));


    /* =========================================================
       5. MODAL LOGIC
    ========================================================= */
    btnOpenHelpModal.addEventListener('click', () => {
        helpModal.showModal();
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            helpModal.close();
        });
    });

    // Close on backdrop click
    helpModal.addEventListener('click', (e) => {
        const dialogDimensions = helpModal.getBoundingClientRect();
        if (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
        ) {
            helpModal.close();
        }
    });


    /* =========================================================
       6. TAB SWITCHING LOGIC
    ========================================================= */
    function switchTab(targetId) {
        tabBtns.forEach(btn => {
            if(btn.getAttribute('data-target') === targetId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        tabContents.forEach(content => {
            if(content.id === targetId) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
        
        // Stop QR scanner if switching away
        if(targetId !== 'qrTab' && typeof html5QrCode !== 'undefined' && isScanning) {
            stopScanner();
        }
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            switchTab(btn.getAttribute('data-target'));
        });
    });

    // Hero buttons scroll to section and select tab
    function scrollToLookup(tabId) {
        const section = document.getElementById('lookupSection');
        switchTab(tabId);
        resetToInterface();
        window.scrollTo({
            top: section.getBoundingClientRect().top + window.pageYOffset - 100,
            behavior: 'smooth'
        });
    }

    btnScrollToScan.addEventListener('click', () => scrollToLookup('qrTab'));
    btnScrollToManual.addEventListener('click', () => scrollToLookup('manualTab'));


    /* =========================================================
       7. BATCH LOOKUP ENGINE
    ========================================================= */
    function hideAllStates() {
        Object.values(stateStates).forEach(state => state.classList.add('hidden'));
    }

    function resetToInterface() {
        lookupResults.classList.add('hidden');
        lookupInterface.classList.remove('hidden');
        hideAllStates();
        batchInput.value = '';
    }

    btnResetLookups.forEach(btn => {
        btn.addEventListener('click', resetToInterface);
    });

    function displayResult(batchCode) {
        lookupInterface.classList.add('hidden');
        lookupResults.classList.remove('hidden');
        hideAllStates();
        stateStates.loading.classList.remove('hidden');

        // Simulate API Network Delay
        setTimeout(() => {
            hideAllStates();

            if (!DATABASE_CONNECTED) {
                stateStates.pending.classList.remove('hidden');
                return;
            }

            const data = mockBatchDatabase[batchCode];

            if (data) {
                // Populate DOM with verified factual data
                document.getElementById('resProduct').textContent = data.product;
                document.getElementById('resBatch').textContent = data.batch;
                document.getElementById('resQuantity').textContent = data.quantity;
                document.getElementById('resPackDate').textContent = data.packDate;
                document.getElementById('resBestBefore').textContent = data.bestBefore;
                document.getElementById('resIngredients').textContent = data.ingredients;
                document.getElementById('resStorage').textContent = data.storage;
                
                const statusBadge = document.getElementById('resReportStatus');
                statusBadge.textContent = data.reportStatus;
                
                const reportLink = document.getElementById('resReportLink');
                if (data.reportUrl) {
                    statusBadge.classList.add('verified');
                    reportLink.href = data.reportUrl;
                    reportLink.classList.remove('hidden');
                } else {
                    statusBadge.classList.remove('verified');
                    reportLink.classList.add('hidden');
                }

                stateStates.found.classList.remove('hidden');
            } else {
                stateStates.notFound.classList.remove('hidden');
            }
        }, 1200); // 1.2s realistic delay
    }

    // Handle Manual Form Submit
    manualBatchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const rawInput = batchInput.value.trim().toUpperCase();
        if (rawInput) {
            displayResult(rawInput);
        }
    });

    // Handle Direct URL Parameters (e.g. scan.html?batch=GD-2310-001)
    const urlParams = new URLSearchParams(window.location.search);
    const urlBatch = urlParams.get('batch');
    if (urlBatch) {
        // Delay slightly so layout can render before scrolling/loading
        setTimeout(() => {
            const section = document.getElementById('lookupSection');
            window.scrollTo({ top: section.getBoundingClientRect().top + window.pageYOffset - 100, behavior: 'smooth'});
            displayResult(urlBatch.trim().toUpperCase());
        }, 500);
    }


    /* =========================================================
       8. QR SCANNER INTEGRATION (Using html5-qrcode if loaded)
    ========================================================= */
    const btnOpenCamera = document.getElementById('btnOpenCamera');
    const scannerMessage = document.getElementById('scannerMessage');
    let html5QrCode;
    let isScanning = false;

    function initScanner() {
        if (typeof Html5Qrcode === 'undefined') {
            scannerMessage.textContent = "Scanner library not loaded. Please enter batch manually.";
            return;
        }

        if (!html5QrCode) {
            html5QrCode = new Html5Qrcode("qrReader");
        }

        scannerMessage.textContent = "Requesting camera access...";
        
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };

        html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess, onScanFailure)
            .then(() => {
                isScanning = true;
                scannerMessage.textContent = "Scanning... Point camera at the QR code.";
                btnOpenCamera.textContent = "Stop Camera";
                document.querySelector('.scanner-overlay').style.display = 'none';
            })
            .catch(err => {
                isScanning = false;
                scannerMessage.textContent = "Camera access denied or unavailable. Please enter batch manually.";
                btnOpenCamera.textContent = "Open Camera";
            });
    }

    function stopScanner() {
        if (html5QrCode && isScanning) {
            html5QrCode.stop().then(() => {
                isScanning = false;
                btnOpenCamera.textContent = "Open Camera";
                scannerMessage.textContent = "";
                document.querySelector('.scanner-overlay').style.display = 'block';
            }).catch(err => console.error("Failed to stop scanner", err));
        }
    }

    function onScanSuccess(decodedText) {
        stopScanner();
        // Check if QR is a URL containing ?batch= or just a plain code
        let batchCode = decodedText;
        
        try {
            // Attempt to parse as URL
            const url = new URL(decodedText);
            const param = url.searchParams.get('batch');
            if (param) batchCode = param;
        } catch (e) {
            // Not a URL, assume it's the raw text code
        }
        
        displayResult(batchCode.trim().toUpperCase());
    }

    function onScanFailure(error) {
        // Fails quietly during continuous scanning until it finds a code
    }

    btnOpenCamera.addEventListener('click', () => {
        if (isScanning) {
            stopScanner();
        } else {
            initScanner();
        }
    });

    // File Upload for QR Image
    const btnUploadQR = document.getElementById('btnUploadQR');
    const qrInputFile = document.getElementById('qrInputFile');

    if (btnUploadQR && qrInputFile) {
        btnUploadQR.addEventListener('click', () => {
            qrInputFile.click();
        });

        qrInputFile.addEventListener('change', (e) => {
            if (e.target.files.length === 0) return;
            
            const file = e.target.files[0];
            
            if (typeof Html5Qrcode === 'undefined') {
                scannerMessage.textContent = "Scanner library not loaded. Please enter batch manually.";
                return;
            }

            // Stop camera scanner if running
            stopScanner();
            
            if (!html5QrCode) {
                html5QrCode = new Html5Qrcode("qrReader");
            }
            
            scannerMessage.textContent = "Scanning uploaded image...";
            
            html5QrCode.scanFile(file, true)
                .then(decodedText => {
                    scannerMessage.textContent = "";
                    onScanSuccess(decodedText);
                })
                .catch(err => {
                    console.error(err);
                    scannerMessage.textContent = "Could not find a QR code in the image. Please try another image or enter manually.";
                });
                
            // Reset input so the same file can be uploaded again if needed
            qrInputFile.value = '';
        });
    }


    /* =========================================================
       9. FOOLPROOF FAQ ACCORDION (Class Toggle)
    ========================================================= */
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            // Close others
            accordionItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('open');
                    otherItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle clicked
            item.classList.toggle('open');
            const isOpen = item.classList.contains('open');
            header.setAttribute('aria-expanded', isOpen);
        });
    });

});


