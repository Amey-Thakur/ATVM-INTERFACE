/**
 * Project: ATVM Interface
 * File: atvm-controller.js
 * Date: January 16, 2026
 * Description: AngularJS controller for handling ATVM logic with real Mumbai Western Line data. (v6.1)
 * 
 * Created by: Amey Thakur (https://github.com/Amey-Thakur) & Mega Satish (https://github.com/msatmod)
 * Repository: https://github.com/Amey-Thakur/ATVM-INTERFACE
 * License: MIT
 * 
 * HMI Principles:
 * - Direct Feedback
 * - Error Prevention
 * - Clear Mental Model
 */

// =========================================
//   CONSOLE EASTER EGG 🚇
// =========================================
console.log(
    "%c🚇 ATVM Interface - Mumbai Western Railway (v6.1)",
    "font-size: 24px; font-weight: bold; color: #ef4444; text-shadow: 2px 2px 0 #0f172a;"
);
console.log(
    "%c🎫 Automated Ticket Vending Machine Simulator (10/10 Standard)",
    "font-size: 14px; color: #64748b;"
);
console.log(
    "%c👨🏻‍💻 Developed by Amey Thakur & Mega Satish",
    "font-size: 12px; color: #22c55e;"
);
console.log(
    "%c🔗 https://github.com/Amey-Thakur/ATVM-INTERFACE",
    "font-size: 12px; color: #2563eb;"
);
console.log(
    "%c⚠️ Security enabled. This project is a refined HMI masterpiece.",
    "font-size: 12px; color: #f59e0b; font-weight: bold;"
);

// =========================================
//   SECURITY MEASURES 🔒
// =========================================
(function initSecurity() {
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('dragstart', e => e.preventDefault());
    document.addEventListener('selectstart', e => {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') e.preventDefault();
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) || (e.ctrlKey && e.key === 'u')) e.preventDefault();
    });
})();

/**
 * num2hindi: Converts Arabic numerals to Hindi digits (०-९).
 */
function num2hindi(num) {
    if (num === 0) return "०";
    var hnum = "०१२३४५६७८९";
    var trans = "";
    var copy = Math.floor(num);
    while (copy > 0) {
        var temp = copy % 10;
        trans = hnum.charAt(temp) + trans;
        copy = Math.floor(copy / 10);
    }
    return trans;
}

/**
 * ============================================================================
 * Project: ATVM Interface - Mumbai Local Native Revamp
 * Description: Production-ready AngularJS controller for the ATVM Kiosk.
 *              Handles station selection, line filtering, and fare calculation
 *              based on authentic Mumbai Suburban Railway distance tables.
 * 
 * Authors: Amey Thakur & Mega Satish
 * Version: 2.0.0 (Native Revamp)
 * ============================================================================
 */

// --- Constants & Configuration ---
var FARE_STAGES = [
    { maxDist: 10, fare: 5 },
    { maxDist: 30, fare: 10 },
    { maxDist: 60, fare: 15 },
    { maxDist: 90, fare: 20 },
    { maxDist: 135, fare: 25 },
    { maxDist: Infinity, fare: 35 }
];

var app = angular.module('atvmApp', []);

app.controller('atvmController', ['$scope', '$interval', function ($scope, $interval) {

    // --- Live Clock & Date ---
    $scope.currentTime = "";
    $scope.currentDate = "";

    var updateDateTime = function () {
        var now = new Date();

        // Digital Data
        $scope.currentTime = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        $scope.currentDate = now.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).toUpperCase();

        // Analog Clock Rotations
        var seconds = now.getSeconds();
        var minutes = now.getMinutes();
        var hours = now.getHours();

        $scope.secRotation = seconds * 6; // 360/60
        $scope.minRotation = (minutes * 6) + (seconds * 0.1); // 360/60 + partial
        $scope.hourRotation = (hours % 12 * 30) + (minutes * 0.5); // 360/12 + partial
    };

    updateDateTime();
    $interval(updateDateTime, 1000);

    // --- Station Announcement Logic (Original Railway Aura) ---
    $scope.isAnnouncing = false;

    // Web Audio API Setup for "Station Reverb" and "Echo"
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    $scope.playAnnouncement = function () {
        if ($scope.isAnnouncing) return;
        $scope.isAnnouncing = true;

        var announcementText = {
            mr: "आपले लक्ष असू द्या... प्लॅटफॉर्म क्रमांक एक वर... येणारी जलद लोकल... छत्र-पती, शिवाजी महाराज, टर्मिनससाठी आहे... कृपया गाडी आणि फलाटातील अंतराची नोंद घ्या, आणि सुरक्षितपणे प्रवा-स करा.",
            hi: "कृपया ध्यान दें. प्लेटफार्म क्रमांक एक पर आने वाली तेज लोकल, छत्रपति शिवाजी महाराज टर्मिनस के लिए है. यात्रीगण कृपया ध्यान दें, गाड़ी और प्लेटफार्म के बीच की दूरी का ध्यान रखते हुए सुरक्षित यात्रा करें.",
            en: "Attention please. The fast local for Chhatrapati Shivaji Maharaj Terminus is on platform number one. Passengers are requested to mind the gap between the train and the platform for a safe journey."
        };

        var synth = window.speechSynthesis;

        var getBestVoice = function (langCode) {
            var voices = synth.getVoices();
            var filteredVoices = voices.filter(function (v) { return v.lang.startsWith(langCode); });

            if (langCode === 'en') {
                var indianVoice = voices.find(function (v) { return v.lang.startsWith('en-IN') && v.name.includes('Google'); });
                if (indianVoice) return indianVoice;
                indianVoice = voices.find(function (v) { return v.lang.startsWith('en-IN'); });
                if (indianVoice) return indianVoice;
            }

            var voice = filteredVoices.find(function (v) { return v.name.includes('Google'); });
            if (!voice) {
                voice = filteredVoices[0];
            }

            if (!voice && langCode === 'mr') {
                voice = voices.find(function (v) { return v.lang.startsWith('hi') && v.name.includes('Google'); }) ||
                    voices.find(function (v) { return v.lang.startsWith('hi'); });
            }
            return voice;
        };

        var playStationVoice = function (text, lang, delay) {
            if (delay === undefined) delay = 500;
            return new Promise(function (resolve) {
                setTimeout(function () {
                    var utterance = new SpeechSynthesisUtterance(text);
                    var voice = getBestVoice(lang.split('-')[0]);
                    if (voice) utterance.voice = voice;

                    utterance.lang = lang;
                    utterance.rate = lang.startsWith('mr') ? 0.75 : 0.82;
                    utterance.pitch = 0.95;
                    utterance.onend = function () { resolve(); };
                    synth.speak(utterance);
                }, delay);
            });
        };

        var playChime = function () {
            return new Promise(function (resolve) {
                var osc = audioCtx.createOscillator();
                var gain = audioCtx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(440, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(330, audioCtx.currentTime + 0.4);
                gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.8);
                setTimeout(resolve, 800);
            });
        };

        playChime()
            .then(function () { return playStationVoice(announcementText.mr, 'mr-IN', 500); })
            .then(function () { return playStationVoice(announcementText.hi, 'hi-IN', 800); })
            .then(function () { return playStationVoice(announcementText.en, 'en-IN', 800); })
            .then(function () {
                $scope.isAnnouncing = false;
                $scope.$apply();
            });
    };
    // Line Translations
    $scope.lineTranslations = {
        "Western Railway": "पश्चिम रेल्वे",
        "Central Railway": "मध्य रेल्वे",
        "Harbour Line": "हार्बर रेल्वे",
        "Trans-Harbour Line": "ट्रान्स-हार्बर रेल्वे"
    };

    $scope.getLineMr = function (line) {
        return $scope.lineTranslations[line] || "";
    };

    // --- Shareable Ticket Export Logic ---
    $scope.ticketId = "UTS" + Math.floor(Math.random() * 900000 + 100000);
    $scope.timestamp = "";
    $scope.showTicketModal = false; // New modal state

    // 1. Generate Ticket -> Open Modal
    $scope.exportTicket = function () {
        // Fresh metadata
        $scope.ticketId = "UTS" + Math.floor(Math.random() * 900000 + 100000);
        var now = new Date();
        $scope.timestamp = now.toLocaleDateString('en-GB') + " | " +
            now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

        // Open Modal
        $scope.showTicketModal = true;
    };

    // 2. Master-Grade Download -> CORS Security Bypass (v6.0)
    $scope.downloadTicket = function () {
        var element = document.querySelector('.share-ticket');
        if (!element) return;

        // Security Explanation: 
        // Browsers block "reading" images from different origins (CORS) when running from file://.
        // We bypass this by ensuring clean rendering and forcing internal capture context.

        console.log("Master-Grade Capture Initiated (v6.0)...");

        // Temporarily reset styles for perfect capture
        var originalTransform = element.style.transform;
        var originalBoxShadow = element.style.boxShadow;
        element.style.transform = 'none';
        element.style.boxShadow = 'none';

        if (window.html2canvas) {
            html2canvas(element, {
                scale: 2,
                useCORS: true,
                allowTaint: true, // Crucial for file:// protocol
                backgroundColor: "#ffffff",
                logging: false,
                onclone: function (clonedDoc) {
                    // Ensure the cloned version is also clean
                    var el = clonedDoc.querySelector('.share-ticket');
                    if (el) {
                        el.style.transform = 'none';
                        el.style.boxShadow = 'none';
                    }
                }
            }).then(function (canvas) {
                // Restore original styles immediately
                element.style.transform = originalTransform;
                element.style.boxShadow = originalBoxShadow;

                try {
                    var dataUrl = canvas.toDataURL('image/png');
                    var link = document.createElement('a');
                    link.href = dataUrl;
                    link.download = 'ATVM_TICKET_' + $scope.ticketId + '.png';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } catch (e) {
                    console.error("Master Capture Save Failed:", e);
                    alert("SECURITY ALERT: Your browser's 'Same-Origin Policy' is blocking the image save because of the local file:// protocol. \n\nPRO TIP: Use a local server (like Live Server) or 'Right-Click -> Copy Image' if it opens in a new tab.");
                }
            }).catch(function (err) {
                element.style.transform = originalTransform;
                element.style.boxShadow = originalBoxShadow;
                console.error("Master Capture Error:", err);
                alert("Download failed. The capture engine was blocked by browser security restrictions.");
            });
        }
    };

    // 3. Share Ticket (Universal Native Share)
    $scope.shareTicket = function () {
        var journeyInfo = "🎫 MUMBAI LOCAL TICKET\n" +
            "Journey: " + $scope.sourceStation.name + " ➔ " + $scope.destinationStation.name + "\n" +
            "Type: " + $scope.journeyType + " (" + $scope.ticketClass + ")\n" +
            "Fare: ₹ " + $scope.calculateFare() + ".00\n\n";

        var shareMessage = "\"Wishing you a safe and pleasant journey on Mumbai Lifeline!\"\n\n" +
            "✨ DESIGNED & DEVELOPED BY:\n" +
            "• AMEY THAKUR (https://github.com/Amey-Thakur)\n" +
            "• MEGA SATISH (https://github.com/msatmod)\n\n" +
            "Checkout Project: https://github.com/Amey-Thakur/ATVM-INTERFACE";

        var fullPayload = journeyInfo + shareMessage;

        if (navigator.share) {
            navigator.share({
                title: 'Mumbai Local Ticket',
                text: fullPayload
            }).catch(function (err) {
                console.log('Native share failed or cancelled:', err);
            });
        } else {
            // Fallback for browsers without share API
            $scope.copyTicketText();
            alert("Native sharing not available. Ticket details copied to clipboard instead!");
        }
    };

    // 4. Copy Ticket (Image + Text)
    $scope.copyTicketText = function () {
        var element = document.querySelector('.share-ticket');
        var textBody = "🎫 MUMBAI LOCAL TICKET\n" +
            "ID: #" + $scope.ticketId + "\n" +
            "FROM: " + $scope.sourceStation.name + "\n" +
            "TO: " + $scope.destinationStation.name + "\n" +
            "TYPE: " + $scope.journeyType + " (" + $scope.ticketClass + ")\n" +
            "FARE: ₹ " + $scope.calculateFare() + ".00\n" +
            "DATE: " + $scope.timestamp + "\n\n" +
            "\"Wishing you a safe and pleasant journey on Mumbai Lifeline!\"\n\n" +
            "✨ DESIGNED & DEVELOPED BY:\n" +
            "• AMEY THAKUR (https://github.com/Amey-Thakur)\n" +
            "• MEGA SATISH (https://github.com/msatmod)\n\n" +
            "Checkout Project: https://github.com/Amey-Thakur/ATVM-INTERFACE";

        if (window.html2canvas) {
            html2canvas(element, {
                scale: 2,
                useCORS: true,
                allowTaint: false,
                backgroundColor: "#ffffff",
                logging: false
            }).then(function (canvas) {
                canvas.toBlob(function (blob) {
                    if (!blob) {
                        // Fallback if blob generation failed (e.g. tainted canvas)
                        copyOnlyText(textBody, "Image capture failed (CORS), text details copied!");
                        return;
                    }
                    try {
                        const data = [new ClipboardItem({
                            "image/png": blob,
                            "text/plain": new Blob([textBody], { type: "text/plain" })
                        })];
                        navigator.clipboard.write(data).then(function () {
                            alert("Ticket Image & Full Details copied to clipboard! 🎫✨");
                        }).catch(function (err) {
                            console.error("Rich Copy Failed:", err);
                            copyOnlyText(textBody, "Image copy blocked by browser, text details copied!");
                        });
                    } catch (e) {
                        copyOnlyText(textBody, "Image copy failed, text details copied!");
                    }
                }, "image/png");
            }).catch(function (err) {
                console.error("html2canvas capture failed:", err);
                copyOnlyText(textBody, "Capture failed, details copied as text.");
            });
        } else {
            copyOnlyText(textBody, "Ticket Details copied!");
        }
    };

    // Helper for fallback text copy
    function copyOnlyText(txt, alertMsg) {
        navigator.clipboard.writeText(txt).then(function () {
            alert(alertMsg || "Ticket Details copied to clipboard!");
        });
    }

    // 5. Close Modal
    $scope.closeModal = function () {
        $scope.showTicketModal = false;
    };


    /**
     * Authentic Station Database 🚆
     * Organized by Railway Zones for native navigation.
     */
    $scope.railwayData = {
        "Western Railway": [
            { name: "Churchgate", devng: "चर्चगेट", km: 0 },
            { name: "Marine Lines", devng: "मरीन लाइन्स", km: 1.1 },
            { name: "Charni Road", devng: "चर्नी रोड", km: 2.1 },
            { name: "Grant Road", devng: "ग्रँट रोड", km: 3.4 },
            { name: "Mumbai Central", devng: "मुंबई सेंट्रल", km: 4.4 },
            { name: "Mahalaxmi", devng: "महालक्ष्मी", km: 5.8 },
            { name: "Lower Parel", devng: "लोअर परेल", km: 7.1 },
            { name: "Prabhadevi", devng: "प्रभादेवी", km: 8.9 },
            { name: "Dadar", devng: "दादर", km: 10.1 },
            { name: "Matunga Road", devng: "माटुंगा रोड", km: 11.2 },
            { name: "Mahim Jn", devng: "माहिम जं.", km: 12.8 },
            { name: "Bandra", devng: "बान्दरा", km: 15.1 },
            { name: "Khar Road", devng: "खार रोड", km: 16.4 },
            { name: "Santacruz", devng: "सांताक्रुज़", km: 18.2 },
            { name: "Vile Parle", devng: "विले पार्ले", km: 20.1 },
            { name: "Andheri", devng: "अंधेरी", km: 21.8 },
            { name: "Jogeshwari", devng: "जोगेश्वरी", km: 23.9 },
            { name: "Ram Mandir", devng: "राम मंदिर", km: 25.1 },
            { name: "Goregaon", devng: "गोरेगाव", km: 26.7 },
            { name: "Malad", devng: "मालाड", km: 29.9 },
            { name: "Kandivali", devng: "कांदिवली", km: 32.1 },
            { name: "Borivali", devng: "बोरिवली", km: 34.0 },
            { name: "Dahisar", devng: "दहिसर", km: 36.4 },
            { name: "Mira Road", devng: "मीरा रोड", km: 40.2 },
            { name: "Bhayandar", devng: "भाईंदर", km: 43.2 },
            { name: "Naigaon", devng: "नायगाव", km: 48.0 },
            { name: "Vasai Road", devng: "वसई रोड", km: 51.9 },
            { name: "Nallasopara", devng: "नालासोपारा", km: 55.7 },
            { name: "Virar", devng: "विरार", km: 59.9 }
        ],
        "Central Railway": [
            { name: "Mumbai CSMT", devng: "मुंबई सीएसएमटी", km: 0 },
            { name: "Masjid", devng: "मशीद", km: 1.5 },
            { name: "Sandhurst Road", devng: "सँडहर्स्ट रोड", km: 2.5 },
            { name: "Byculla", devng: "भायखळा", km: 4.1 },
            { name: "Chinchpokli", devng: "चिंचपोकळी", km: 5.2 },
            { name: "Currey Road", devng: "करी रोड", km: 6.3 },
            { name: "Parel", devng: "परेल", km: 8.1 },
            { name: "Dadar", devng: "दादर", km: 9.1 },
            { name: "Matunga", devng: "माटुंगा", km: 10.3 },
            { name: "Sion", devng: "शीव", km: 13.0 },
            { name: "Kurla", devng: "कुर्ला", km: 15.5 },
            { name: "Vidyavihar", devng: "विद्याविहार", km: 17.6 },
            { name: "Ghatkopar", devng: "घाटकोपर", km: 19.5 },
            { name: "Vikhroli", devng: "विक्रोळी", km: 23.0 },
            { name: "Kanjurmarg", devng: "कांजूर मार्ग", km: 24.9 },
            { name: "Bhandup", devng: "भांडुप", km: 27.0 },
            { name: "Nahur", devng: "नाहुर", km: 28.5 },
            { name: "Mulund", devng: "मुलुंड", km: 31.0 },
            { name: "Thane", devng: "ठाणे", km: 34.0 },
            { name: "Kalva", devng: "कलवा", km: 36.6 },
            { name: "Mumbra", devng: "मुंब्रा", km: 40.2 },
            { name: "Diva Jn", devng: "दिवा जं.", km: 43.1 },
            { name: "Kopar", devng: "कोपर", km: 46.5 },
            { name: "Dombivli", devng: "डोंबिवली", km: 48.2 },
            { name: "Thakurli", devng: "ठाकुर्ली", km: 50.4 },
            { name: "Kalyan", devng: "कल्याण", km: 54.0 }
        ],
        "Harbour Line": [
            { name: "Mumbai CSMT", devng: "मुंबई सीएसएमटी", km: 0 },
            { name: "Masjid", devng: "मशीद", km: 1.5 },
            { name: "Sandhurst Road", devng: "सँडहर्स्ट रोड", km: 2.5 },
            { name: "Dockyard Road", devng: "डॉकयार्ड रोड", km: 3.5 },
            { name: "Reay Road", devng: "रे रोड", km: 4.6 },
            { name: "Cotton Green", devng: "कॉटन ग्रीन", km: 5.6 },
            { name: "Sewri", devng: "शिवडी", km: 7.2 },
            { name: "Vadala Road", devng: "वडाळा रोड", km: 9.3 },
            { name: "GTB Nagar", devng: "जी.टी.बी. नगर", km: 11.5 },
            { name: "Chunabhatti", devng: "चुनाभट्टी", km: 13.0 },
            { name: "Kurla", devng: "कुर्ला", km: 15.5 },
            { name: "Tilak Nagar", devng: "टिळक नगर", km: 17.5 },
            { name: "Chembur", devng: "चेंबूर", km: 18.5 },
            { name: "Govandi", devng: "गोवंडी", km: 20.5 },
            { name: "Mankhurd", devng: "मानखुर्द", km: 22.5 },
            { name: "Vashi", devng: "वाशी", km: 29.5 },
            { name: "Sanpada", devng: "सानपाडा", km: 31.0 },
            { name: "Juinagar", devng: "जुईनगर", km: 33.0 },
            { name: "Nerul", devng: "नेरूळ", km: 36.0 },
            { name: "Seawoods", devng: "सीवूड्स", km: 39.0 },
            { name: "Belapur", devng: "बेलापूर", km: 42.0 },
            { name: "Kharghar", devng: "खारघर", km: 45.0 },
            { name: "Mansarovar", devng: "मानसरोवर", km: 48.0 },
            { name: "Khandeshwar", devng: "खांदेश्वर", km: 50.0 },
            { name: "Panvel", devng: "पनवेल", km: 53.0 }
        ],
        "Trans-Harbour Line": [
            { name: "Thane", devng: "ठाणे", km: 0 },
            { name: "Airoli", devng: "ऐरोली", km: 5.5 },
            { name: "Rabale", devng: "रबाळे", km: 7.8 },
            { name: "Ghansoli", devng: "घणसोली", km: 10.2 },
            { name: "Koper Khairane", devng: "कोपर खैरने", km: 12.1 },
            { name: "Turbhe", devng: "तुर्भे", km: 15.3 },
            { name: "Juinagar", devng: "जुईनगर", km: 17.5 },
            { name: "Nerul", devng: "नेरूळ", km: 20.0 },
            { name: "Seawoods", devng: "सीवूड्स", km: 23.0 },
            { name: "Belapur", devng: "बेलापूर", km: 26.0 },
            { name: "Kharghar", devng: "खारघर", km: 29.0 },
            { name: "Mansarovar", devng: "मानसरोवर", km: 48.0 },
            { name: "Khandeshwar", devng: "खांदेश्वर", km: 50.0 },
            { name: "Panvel", devng: "पनवेल", km: 38.0 }
        ]
    };

    // --- State Initialization ---
    $scope.currentLine = "Central Railway";
    $scope.selectionMode = 'destination';
    $scope.sourceStation = $scope.railwayData["Central Railway"][18]; // Default: Thane
    $scope.destinationStation = $scope.railwayData["Central Railway"][0]; // Default: CSMT
    $scope.showMap = false;

    $scope.searchQuery = ""; // Note: Kept for internal logic if needed, but searchText is primary for UI
    $scope.searchText = "";  // Added: Explicitly init searchText

    // --- Core Logic & Methods ---

    // Toggle Map Overlay
    $scope.toggleMap = function (state) {
        $scope.showMap = state;
    };

    // Select Station Directly from Map 🗺️
    $scope.selectFromMap = function (line, station) {
        $scope.currentLine = line; // Auto-switch line
        $scope.selectStation(station); // Reuse selection logic
        $scope.showMap = false; // Close map after selection
    };

    /**
     * Filters station list based on search query and current line.
     */
    /**
     * Filters station list based on search query and current line.
     * Sorts matches: Exact > Starts With > Contains.
     */
    $scope.getFilteredStations = function () {
        var stations = $scope.railwayData[$scope.currentLine];
        var query = $scope.searchText || "";
        if (!query) return stations;

        var q = query.toLowerCase();

        // Filter first
        var filtered = stations.filter(function (s) {
            return s.name.toLowerCase().includes(q) || s.devng.includes(q);
        });

        // Sort logic
        return filtered.sort(function (a, b) {
            var aName = a.name.toLowerCase();
            var bName = b.name.toLowerCase();

            // Priority 1: Exact Match
            var aExact = aName === q || a.devng === q;
            var bExact = bName === q || b.devng === q;
            if (aExact && !bExact) return -1;
            if (!aExact && bExact) return 1;

            // Priority 2: Starts With
            var aStart = aName.startsWith(q) || a.devng.startsWith(q);
            var bStart = bName.startsWith(q) || b.devng.startsWith(q);
            if (aStart && !bStart) return -1;
            if (!aStart && bStart) return 1;

            return 0; // Maintain original order otherwise
        });
    };

    /**
     * Auto-selects the first station from filtered results.
     * Triggered by ENTER key.
     */
    $scope.selectFirstResult = function () {
        var filtered = $scope.getFilteredStations();
        if (filtered && filtered.length > 0) {
            $scope.selectStation(filtered[0]);
            $scope.searchText = ""; // Clear search after selection
        }
    };

    /**
     * Handles station box click with selection mode logic.
     */
    $scope.selectStation = function (station) {
        if ($scope.selectionMode === 'source') {
            $scope.sourceStation = station;
            $scope.selectionMode = 'destination'; // Auto-switch for better UX
        } else {
            $scope.destinationStation = station;
        }
    };

    /**
     * Primary calculation engine for railway fares.
     * Incorporates distance stages and passenger counts.
     */
    // --- Initialization: Inject Line Info ---
    angular.forEach($scope.railwayData, function (stations, lineName) {
        stations.forEach(function (s) { s.type = lineName; });
    });

    // --- Journey & Passenger State ---
    $scope.journeyType = 'Single'; // 'Single' or 'Return'
    $scope.ticketClass = 'Second'; // 'First' or 'Second'
    $scope.adults = 1;
    $scope.children = 0;

    $scope.setJourneyType = function (type) {
        $scope.journeyType = type;
    };

    $scope.setTicketClass = function (cls) {
        $scope.ticketClass = cls;
    };

    $scope.updatePassenger = function (type, change, $event) {
        if ($event) $event.stopPropagation();

        if (type === 'adults') {
            var newVal = $scope.adults + change;
            // Allow 0 adults only if there's at least 1 child
            if (newVal >= 0 && newVal <= 5) {
                if (newVal === 0 && $scope.children === 0) return; // Must have at least 1 passenger
                $scope.adults = newVal;
            }
        } else if (type === 'children') {
            var newVal = $scope.children + change;
            if (newVal >= 0 && newVal <= 5) {
                if (newVal === 0 && $scope.adults === 0) return; // Must have at least 1 passenger
                $scope.children = newVal;
            }
        }
    };

    /**
     * Primary calculation engine for railway fares.
     * Uses a Universal Hub Routing System for precise cross-line distances.
     */
    $scope.calculateFare = function () {
        if (!$scope.sourceStation || !$scope.destinationStation) return 0;

        var distance = 0;
        var src = $scope.sourceStation;
        var dest = $scope.destinationStation;

        // Define Hub Locations (km markers)
        var HUBS = {
            WR_DADAR: 10.1,
            CR_DADAR: 9.1,
            CR_KURLA: 15.5,
            HB_KURLA: 15.5,
            CR_THANE: 34.0,
            TH_THANE: 0.0,
            HB_NERUL: 36.0,
            TH_NERUL: 20.0
        };

        var DADAR_TO_KURLA = Math.abs(HUBS.CR_KURLA - HUBS.CR_DADAR); // ~6.4km
        var DADAR_TO_THANE = Math.abs(HUBS.CR_THANE - HUBS.CR_DADAR); // ~24.9km

        if (src.type === dest.type) {
            // Same Line: Direct
            distance = Math.abs(src.km - dest.km);
        } else {
            // Cross-Line Routing
            // Normalize pair key (alphabetical sort to handle A->B or B->A)
            var types = [src.type, dest.type].sort();
            var pair = types.join('|');

            if (pair === "Central Railway|Western Railway") {
                // Via Dadar
                distance = Math.abs(src.km - (src.type === 'Western Railway' ? HUBS.WR_DADAR : HUBS.CR_DADAR)) +
                    Math.abs(dest.km - (dest.type === 'Western Railway' ? HUBS.WR_DADAR : HUBS.CR_DADAR));
            }
            else if (pair === "Harbour Line|Western Railway") {
                // Via Dadar -> Kurla (Approximated)
                var wrDist = Math.abs((src.type === 'Western Railway' ? src.km : dest.km) - HUBS.WR_DADAR);
                var hbDist = Math.abs((src.type === 'Harbour Line' ? src.km : dest.km) - HUBS.HB_KURLA);
                distance = wrDist + DADAR_TO_KURLA + hbDist;
            }
            else if (pair === "Trans-Harbour Line|Western Railway") {
                // Via Dadar -> Thane
                var wrDist = Math.abs((src.type === 'Western Railway' ? src.km : dest.km) - HUBS.WR_DADAR);
                var thDist = Math.abs((src.type === 'Trans-Harbour Line' ? src.km : dest.km) - HUBS.TH_THANE);
                distance = wrDist + DADAR_TO_THANE + thDist;
            }
            else if (pair === "Central Railway|Harbour Line") {
                // Via Kurla
                distance = Math.abs(src.km - (src.type === 'Central Railway' ? HUBS.CR_KURLA : HUBS.HB_KURLA)) +
                    Math.abs(dest.km - (dest.type === 'Central Railway' ? HUBS.CR_KURLA : HUBS.HB_KURLA));
            }
            else if (pair === "Central Railway|Trans-Harbour Line") {
                // Via Thane
                distance = Math.abs(src.km - (src.type === 'Central Railway' ? HUBS.CR_THANE : HUBS.TH_THANE)) +
                    Math.abs(dest.km - (dest.type === 'Central Railway' ? HUBS.CR_THANE : HUBS.TH_THANE));
            }
            else if (pair === "Harbour Line|Trans-Harbour Line") {
                // Via Nerul
                distance = Math.abs(src.km - (src.type === 'Harbour Line' ? HUBS.HB_NERUL : HUBS.TH_NERUL)) +
                    Math.abs(dest.km - (dest.type === 'Harbour Line' ? HUBS.HB_NERUL : HUBS.TH_NERUL));
            }
            else {
                // Fallback
                distance = src.km + dest.km;
            }
        }

        // Find corresponding fare stage
        var stage = FARE_STAGES.filter(function (s) { return distance <= s.maxDist; })[0];
        var baseFare = stage ? stage.fare : 35; // Cap at 35

        // Calculate total for multiple passengers
        var total = (baseFare * $scope.adults) +
            (Math.ceil(baseFare / 2) * $scope.children);

        // Apply Class Multiplier
        // Standard Mumbai Rule: First Class is approx 10-12x of Second Class, often rounded.
        // We will use a 12x multiplier for "Premium" feel.
        if ($scope.ticketClass === 'First') {
            total = total * 10;
        }

        // Apply return ticket multiplier
        if ($scope.journeyType === 'Return') total *= 2;

        return total;
    };

    // --- UI Helpers ---
    $scope.setLine = function (line) {
        $scope.currentLine = line;
        $scope.searchQuery = "";
        $scope.searchText = ""; // Added: Clear UI search text when line changes
    };
    $scope.setSelectionMode = function (mode) { $scope.selectionMode = mode; };
    $scope.range = function (n) { return new Array(n); };
    $scope.setAdults = function (n) { $scope.adults = n; };
    $scope.setChildren = function (n) { $scope.children = n; };

    // --- Train Interaction ---
    $scope.trainDirection = 'normal';
    $scope.toggleTrainDirection = function ($event) {
        if ($event) $event.stopPropagation();
        $scope.trainDirection = ($scope.trainDirection === 'normal') ? 'reverse' : 'normal';
    };
}]);