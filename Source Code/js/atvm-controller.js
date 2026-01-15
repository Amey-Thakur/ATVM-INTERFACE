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

function atvmController($scope) {
    // Comprehensive Mumbai Railway Data
    $scope.railwayData = {
        "Western": [
            { name: "Churchgate", devng: "चर्चगेट", km: 0 },
            { name: "Marine Lines", devng: "मरीन लाइन्स", km: 1 },
            { name: "Charni Road", devng: "चर्नी रोड", km: 2 },
            { name: "Grant Road", devng: "ग्रँट रोड", km: 3 },
            { name: "Mumbai Central", devng: "मुंबई सेंट्रल", km: 5 },
            { name: "Mahalaxmi", devng: "महालक्ष्मी", km: 6 },
            { name: "Lower Parel", devng: "लोअर परेल", km: 7 },
            { name: "Prabhadevi", devng: "प्रभादेवी", km: 9 },
            { name: "Dadar", devng: "दादर", km: 10 },
            { name: "Matunga Road", devng: "माटुंगा रोड", km: 11 },
            { name: "Mahim Jn", devng: "माहिम जं.", km: 13 },
            { name: "Bandra", devng: "बान्दरा", km: 15 },
            { name: "Khar Road", devng: "खार रोड", km: 16 },
            { name: "Santacruz", devng: "सांताक्रुज़", km: 18 },
            { name: "Vile Parle", devng: "विले पार्ले", km: 20 },
            { name: "Andheri", devng: "अंधेरी", km: 22 },
            { name: "Jogeshwari", devng: "जोगेश्वरी", km: 24 },
            { name: "Ram Mandir", devng: "राम मंदिर", km: 25 },
            { name: "Goregaon", devng: "गोरेगाव", km: 27 },
            { name: "Malad", devng: "मालाड", km: 30 },
            { name: "Kandivali", devng: "कांदिवली", km: 32 },
            { name: "Borivali", devng: "बोरिवली", km: 34 },
            { name: "Dahisar", devng: "दहिसर", km: 36 },
            { name: "Mira Road", devng: "मीरा रोड", km: 40 },
            { name: "Bhayandar", devng: "भाईंदर", km: 44 },
            { name: "Naigaon", devng: "नायगाव", km: 48 },
            { name: "Vasai Road", devng: "वसई रोड", km: 52 },
            { name: "Nallasopara", devng: "नालासोपारा", km: 56 },
            { name: "Virar", devng: "विरार", km: 60 }
        ],
        "Central": [
            { name: "CSMT", devng: "सीएसएमटी", km: 0 },
            { name: "Masjid", devng: "मशीद", km: 1 },
            { name: "Sandhurst Road", devng: "सँडहर्स्ट रोड", km: 2 },
            { name: "Byculla", devng: "भायखळा", km: 4 },
            { name: "Chinchpokli", devng: "चिंचपोकळी", km: 5 },
            { name: "Currey Road", devng: "करी रोड", km: 6 },
            { name: "Parel", devng: "परेल", km: 8 },
            { name: "Dadar", devng: "दादर", km: 9 },
            { name: "Matunga", devng: "माटुंगा", km: 10 },
            { name: "Sion", devng: "शीव", km: 12 },
            { name: "Kurla", devng: "कुर्ला", km: 15 },
            { name: "Vidyavihar", devng: "विद्याविहार", km: 17 },
            { name: "Ghatkopar", devng: "घाटकोपर", km: 19 },
            { name: "Vikhroli", devng: "विक्रोळी", km: 23 },
            { name: "Kanjur Marg", devng: "कांजूर मार्ग", km: 25 },
            { name: "Bhandup", devng: "भांडुप", km: 27 },
            { name: "Nahur", devng: "नाहुर", km: 29 },
            { name: "Mulund", devng: "मुलुंड", km: 31 },
            { name: "Thane", devng: "ठाणे", km: 34 },
            { name: "Kalva", devng: "कलवा", km: 37 },
            { name: "Mumbra", devng: "मुंब्रा", km: 40 },
            { name: "Diva Jn", devng: "दिवा जं.", km: 43 },
            { name: "Kopar", devng: "कोपर", km: 47 },
            { name: "Dombivli", devng: "डोंबिवली", km: 48 },
            { name: "Thakurli", devng: "ठाकुर्ली", km: 51 },
            { name: "Kalyan", devng: "कल्याण", km: 54 }
        ],
        "Harbour": [
            { name: "CSMT", devng: "सीएसएमटी", km: 0 },
            { name: "Masjid", devng: "मशीद", km: 1 },
            { name: "Sandhurst Road", devng: "सँडहर्स्ट रोड", km: 2 },
            { name: "Dockyard Road", devng: "डॉकयार्ड रोड", km: 3 },
            { name: "Reay Road", devng: "रे रोड", km: 4 },
            { name: "Cotton Green", devng: "कॉटन ग्रीन", km: 5 },
            { name: "Sewri", devng: "शिवडी", km: 7 },
            { name: "Vadala Road", devng: "वडाळा रोड", km: 9 },
            { name: "Guru Tegh Bahadur", devng: "गुरु तेग बहादूर", km: 12 },
            { name: "Chunabhatti", devng: "चुनाभट्टी", km: 13 },
            { name: "Kurla", devng: "कुर्ला", km: 15 },
            { name: "Tilaknagar", devng: "टिळक नगर", km: 17 },
            { name: "Chembur", devng: "चेंबूर", km: 18 },
            { name: "Govandi", devng: "गोवंडी", km: 20 },
            { name: "Mankhurd", devng: "मानखुर्द", km: 22 },
            { name: "Vashi", devng: "वाशी", km: 29 },
            { name: "Sanpada", devng: "सानपाडा", km: 31 },
            { name: "Juinagar", devng: "जुईनगर", km: 33 },
            { name: "Nerul", devng: "नेरूळ", km: 36 },
            { name: "Seawoods", devng: "सीवूड्स", km: 39 },
            { name: "Belapur", devng: "बेलापूर", km: 42 },
            { name: "Kharghar", devng: "खारघर", km: 45 },
            { name: "Mansarovar", devng: "मानसरोवर", km: 48 },
            { name: "Khandeshwar", devng: "खांदेश्वर", km: 50 },
            { name: "Panvel", devng: "पनवेल", km: 53 }
        ]
    };

    // State
    $scope.currentLine = "Western";
    $scope.selectionMode = 'destination'; // 'source' or 'destination'
    $scope.sourceStation = $scope.railwayData["Western"][21]; // Borivali
    $scope.destinationStation = $scope.railwayData["Western"][0]; // Churchgate

    $scope.searchQuery = "";
    $scope.noOfAdults = 1;
    $scope.noOfChildren = 0;
    $scope.returnTicket = false;

    // Computed
    $scope.getStations = function () {
        return $scope.railwayData[$scope.currentLine];
    };

    $scope.getFilteredStations = function () {
        var stations = $scope.getStations();
        if (!$scope.searchQuery) return stations;
        var q = $scope.searchQuery.toLowerCase();
        return stations.filter(function (s) {
            return s.name.toLowerCase().includes(q) || s.devng.includes(q);
        });
    };

    // Actions
    $scope.setLine = function (line) {
        $scope.currentLine = line;
        $scope.searchQuery = "";
    };

    $scope.selectStation = function (station) {
        if ($scope.selectionMode === 'source') {
            $scope.sourceStation = station;
            $scope.selectionMode = 'destination'; // Auto-switch for UX
        } else {
            $scope.destinationStation = station;
        }
    };

    $scope.setSelectionMode = function (mode) {
        $scope.selectionMode = mode;
    };

    $scope.calculateFare = function () {
        // Find distance (simplified for cross-line)
        var dist = 10; // Default
        if ($scope.sourceStation && $scope.destinationStation) {
            // Simplified: if same line, use KM diff. If different, use larger KM (cross-city)
            if ($scope.sourceStation.km !== undefined && $scope.destinationStation.km !== undefined) {
                dist = Math.abs($scope.sourceStation.km - $scope.destinationStation.km);
            }
        }

        var baseFare = 5;
        if (dist > 10) baseFare = 10;
        if (dist > 20) baseFare = 15;
        if (dist > 35) baseFare = 20;
        if (dist > 50) baseFare = 25;

        var total = (baseFare * $scope.noOfAdults) + (Math.ceil(baseFare / 2) * $scope.noOfChildren);
        if ($scope.returnTicket) total *= 2;
        return total;
    };

    // Helpers
    $scope.range = function (n) { return new Array(n); };
    $scope.setAdults = function (n) { $scope.noOfAdults = n; };
    $scope.setChildren = function (n) { $scope.noOfChildren = n; };
    $scope.toggleReturn = function () { $scope.returnTicket = !$scope.returnTicket; };
}