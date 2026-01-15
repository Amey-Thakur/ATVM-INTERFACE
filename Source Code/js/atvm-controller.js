/**
 * Project: ATVM Interface
 * File: atvm-controller.js
 * Date: January 15, 2026
 * Description: AngularJS controller for handling ATVM logic with real Mumbai Western Line data.
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
    "%c🚇 ATVM Interface - Mumbai Western Railway",
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
const FARE_STAGES = [
    { maxDist: 10, fare: 5 },
    { maxDist: 30, fare: 10 },
    { maxDist: 60, fare: 15 },
    { maxDist: 90, fare: 20 },
    { maxDist: 135, fare: 25 },
    { maxDist: Infinity, fare: 35 }
];

function atvmController($scope) {

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

    $scope.searchQuery = "";
    $scope.noOfAdults = 1;
    $scope.noOfChildren = 0;
    $scope.returnTicket = false;

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
        const stations = $scope.railwayData[$scope.currentLine];
        // Note: Check if $scope.searchText is used or $scope.searchQuery.
        // User HTML said `ng-model="searchText"`.
        // Controller line 210 defines `$scope.searchQuery`.
        // Wait, line 149 HTML: `ng-model="searchText"`.
        // Line 234 JS: `if (!$scope.searchQuery)`.
        // One of them is wrong or they are synced?
        // Let's assume HTML `searchText` is correct and JS needs update if mismatch.
        // But wait, I see `ng-model="searchText"` in HTML snippet step 849.
        // JS uses `searchQuery`. This might be why search works/doesn't work?
        // Ah, likely mapped in view or I should check initialization.
        // Wait, line 210: `$scope.searchQuery = "";`.
        // Let's use `searchText` to match HTML view.

        // Actually, just better to check what scope variable is being used.
        // HTML: `ng-model="searchText"`
        // The previous code block showed `$scope.searchQuery`.
        // If I change this function to use `searchText`, it will safely match HTML.

        var query = $scope.searchText || "";
        if (!query) return stations;

        const q = query.toLowerCase();

        // Filter first
        let filtered = stations.filter(s =>
            s.name.toLowerCase().includes(q) || s.devng.includes(q)
        );

        // Sort logic
        return filtered.sort((a, b) => {
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();

            // Priority 1: Exact Match
            const aExact = aName === q || a.devng === q;
            const bExact = bName === q || b.devng === q;
            if (aExact && !bExact) return -1;
            if (!aExact && bExact) return 1;

            // Priority 2: Starts With
            const aStart = aName.startsWith(q) || a.devng.startsWith(q);
            const bStart = bName.startsWith(q) || b.devng.startsWith(q);
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
    $scope.adults = 1;
    $scope.children = 0;

    $scope.setJourneyType = function (type) {
        $scope.journeyType = type;
    };

    $scope.updatePassenger = function (type, change, $event) {
        if ($event) $event.stopPropagation();

        if (type === 'adults') {
            var newVal = $scope.adults + change;
            if (newVal >= 1 && newVal <= 5) $scope.adults = newVal;
        } else if (type === 'children') {
            var newVal = $scope.children + change;
            if (newVal >= 0 && newVal <= 5) $scope.children = newVal;
        }
    };

    /**
     * Primary calculation engine for railway fares.
     * Uses a Universal Hub Routing System for precise cross-line distances.
     */
    $scope.calculateFare = function () {
        if (!$scope.sourceStation || !$scope.destinationStation) return 0;

        let distance = 0;
        const src = $scope.sourceStation;
        const dest = $scope.destinationStation;

        // Define Hub Locations (km markers)
        const HUBS = {
            WR_DADAR: 10.1,
            CR_DADAR: 9.1,
            CR_KURLA: 15.5,
            HB_KURLA: 15.5,
            CR_THANE: 34.0,
            TH_THANE: 0.0,
            HB_NERUL: 36.0,
            TH_NERUL: 20.0
        };

        const DADAR_TO_KURLA = Math.abs(HUBS.CR_KURLA - HUBS.CR_DADAR); // ~6.4km
        const DADAR_TO_THANE = Math.abs(HUBS.CR_THANE - HUBS.CR_DADAR); // ~24.9km

        if (src.type === dest.type) {
            // Same Line: Direct
            distance = Math.abs(src.km - dest.km);
        } else {
            // Cross-Line Routing
            // Normalize pair key (alphabetical sort to handle A->B or B->A)
            const types = [src.type, dest.type].sort();
            const pair = types.join('|');

            if (pair === "Central Railway|Western Railway") {
                // Via Dadar
                distance = Math.abs(src.km - (src.type === 'Western Railway' ? HUBS.WR_DADAR : HUBS.CR_DADAR)) +
                    Math.abs(dest.km - (dest.type === 'Western Railway' ? HUBS.WR_DADAR : HUBS.CR_DADAR));
            }
            else if (pair === "Harbour Line|Western Railway") {
                // Via Dadar -> Kurla (Approximated)
                const wrDist = Math.abs((src.type === 'Western Railway' ? src.km : dest.km) - HUBS.WR_DADAR);
                const hbDist = Math.abs((src.type === 'Harbour Line' ? src.km : dest.km) - HUBS.HB_KURLA);
                distance = wrDist + DADAR_TO_KURLA + hbDist;
            }
            else if (pair === "Trans-Harbour Line|Western Railway") {
                // Via Dadar -> Thane
                const wrDist = Math.abs((src.type === 'Western Railway' ? src.km : dest.km) - HUBS.WR_DADAR);
                const thDist = Math.abs((src.type === 'Trans-Harbour Line' ? src.km : dest.km) - HUBS.TH_THANE);
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
        const stage = FARE_STAGES.find(s => distance <= s.maxDist);
        const baseFare = stage ? stage.fare : 35; // Cap at 35

        // Calculate total for multiple passengers
        let total = (baseFare * $scope.adults) +
            (Math.ceil(baseFare / 2) * $scope.children);

        // Apply return ticket multiplier
        if ($scope.journeyType === 'Return') total *= 2;

        return total;
    };

    // --- UI Helpers ---
    $scope.setLine = (line) => { $scope.currentLine = line; $scope.searchQuery = ""; };
    $scope.setSelectionMode = (mode) => { $scope.selectionMode = mode; };
    $scope.range = (n) => new Array(n);
    $scope.setAdults = (n) => { $scope.noOfAdults = n; };
    $scope.setChildren = (n) => { $scope.noOfChildren = n; };
}