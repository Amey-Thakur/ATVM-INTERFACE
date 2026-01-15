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
    // Real Western Line Data
    $scope.stations = [
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
    ];

    // Major Stations for Quick Select
    $scope.mainStations = [0, 4, 8, 11, 15, 21, 28]; // Churchgate, Central, Dadar, Bandra, Andheri, Borivali, Virar

    // Init Defaults
    $scope.source = 21; // Borivali as default (per user screenshot)
    $scope.selectedStation = 0; // Churchgate as target
    $scope.selectedMainStation = 0;
    $scope.noOfAdults = 1;
    $scope.noOfChildren = 0;
    $scope.returnTicket = false;
    $scope.title = "Western Railway ATVM";

    $scope.range = function (num) { return new Array(num); };

    $scope.getSelectedStationStyle = function (index) {
        return ($scope.source == index) ? "grayed" : "";
    };

    $scope.getSelectedStationStylePrimary = function (index) {
        if ($scope.source == index) return "grayed";
        if ($scope.selectedStation == index) return "green";
        return "";
    };

    $scope.getStation = function (index) {
        return $scope.stations[index].name;
    };

    $scope.setSelectedStation = function (index) {
        if (index == $scope.source) return;
        $scope.selectedStation = index;
        // Update main station index for sub-button group visibility
        for (var i = 0; i < $scope.mainStations.length; i++) {
            if (i + 1 == $scope.mainStations.length || $scope.mainStations[i + 1] > index) {
                $scope.selectedMainStation = i;
                break;
            }
        }
    };

    $scope.setSelectedMainStation = function (index) {
        if ($scope.mainStations[index] == $scope.source) return;
        $scope.selectedMainStation = index;
        $scope.selectedStation = $scope.mainStations[index];
    };

    $scope.getSubstations = function (index) {
        var start = $scope.mainStations[index];
        var end = (index + 1 < $scope.mainStations.length) ? $scope.mainStations[index + 1] - 1 : $scope.stations.length - 1;
        var arr = [];
        for (var i = start; i <= end; i++) {
            arr.push([$scope.stations[i].name, i]);
        }
        return arr;
    };

    $scope.getSingleClass = function () { return !$scope.returnTicket ? "" : "opaque"; };
    $scope.getReturnClass = function () { return $scope.returnTicket ? "" : "opaque"; };
    $scope.getPersonClass = function (index, current) { return (index < current) ? "" : "opaque"; };

    $scope.setNoOfAdults = function (num) { $scope.noOfAdults = num; };
    $scope.setNoOfChildren = function (num) { $scope.noOfChildren = num; };

    /**
     * Fare Calculation Logic (Mumbai Suburban Railway Standards)
     */
    $scope.getTotal = function () {
        var s = $scope.stations[$scope.source];
        var d = $scope.stations[$scope.selectedStation];
        var dist = Math.abs(s.km - d.km);

        // Tiered Fare Mapping (Second Class)
        var fare = 5;
        if (dist > 10) fare = 10;
        if (dist > 20) fare = 15;
        if (dist > 30) fare = 20;
        if (dist > 45) fare = 25;
        if (dist > 60) fare = 30;

        var subtotal = (fare * $scope.noOfAdults) + (Math.ceil(fare / 2) * $scope.noOfChildren);
        if ($scope.returnTicket) subtotal *= 2;

        return "Rs. " + subtotal + " (= " + num2hindi(subtotal) + ")";
    };
}