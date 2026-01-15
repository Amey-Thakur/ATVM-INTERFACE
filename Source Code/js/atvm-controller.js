/**
 * Project: ATVM Interface
 * File: atvm-controller.js
 * Date: February 25, 2022
 * Description: AngularJS controller for handling ATVM logic, state management, and ticket calculation.
 * 
 * Created by: Amey Thakur (https://github.com/Amey-Thakur) & Mega Satish (https://github.com/msatmod)
 * Repository: https://github.com/Amey-Thakur/ATVM-INTERFACE
 * License: MIT
 */

// =========================================
//   CONSOLE EASTER EGG 🚇
// =========================================
console.log(
    "%c🚇 ATVM Interface - Mumbai Metro",
    "font-size: 24px; font-weight: bold; color: #0ea5e9; text-shadow: 2px 2px 0 #0f172a;"
);
console.log(
    "%c🎫 Automated Ticket Vending Machine Simulator",
    "font-size: 14px; color: #64748b;"
);
console.log(
    "%c👩‍💻 Developed by Amey Thakur & Mega Satish",
    "font-size: 12px; color: #22c55e;"
);
console.log(
    "%c🔗 https://github.com/Amey-Thakur/ATVM-INTERFACE",
    "font-size: 12px; color: #2563eb;"
);
console.log(
    "%c⚠️ This project is protected. Please respect the authors' work!",
    "font-size: 12px; color: #f59e0b; font-weight: bold;"
);

// =========================================
//   SECURITY MEASURES 🔒
// =========================================
(function initSecurity() {
    // Disable Right Click
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });

    // Disable Dragging
    document.addEventListener('dragstart', function (e) {
        e.preventDefault();
    });

    // Disable Text Selection (except inputs)
    document.addEventListener('selectstart', function (e) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    });

    // Disable DevTools Shortcuts
    document.addEventListener('keydown', function (e) {
        if (e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
            (e.ctrlKey && e.key === 'u')) {
            e.preventDefault();
        }
    });
})();
/**
 * Utility Function: num2hindi
 * Converts standard Arabic numerals (0-9) to Hindi digits (०-९).
 * This supports the localization requirement for the Mumbai Metro interface.
 * 
 * @param {number} num - The number to convert
 * @returns {string} - The string representation in Hindi digits
 */
function num2hindi(num) {
    var hnum = "०१२३४५६७८९";
    var trans = "";
    var copy = num;
    while (copy > 0.5) {
        var temp = copy % 10;
        trans = hnum.charAt(temp) + trans;
        copy = copy / 10;
    }
    return trans;
}

function atvmController($scope) {
    // State Initialization
    // Initialize default values for source station (5: Andheri), passenger counts, and selection.
    $scope.source = 5;
    $scope.noOfAdults = 1;
    $scope.noOfChildren = 0;
    $scope.selectedStation = 0;
    $scope.selectedMainStation = 0;

    $scope.title = "Mumbai Metro";
    $scope.returnTicket = false;

    $scope.range = function (num) {
        return new Array(num);
    }

    $scope.getSelectedStationStyle = function (index) {
        if ($scope.source == index) {
            return "grayed";
        } else {
            return "";
        }
    }
    $scope.getSelectedStationStylePrimary = function (index) {
        if ($scope.source == index) {
            return "grayed";
        } else if ($scope.selectedStation == index) {
            return "btn-success";
        } else {
            return "";
        }
    }
    $scope.getStation = function (index) {
        return $scope.stations[index].name;
    }

    $scope.setSelectedStation = function (index) {
        for (var i = 0; i < $scope.mainStations.length; i++) {
            if ($scope.mainStations[i + 1] > index) {
                $scope.selectedMainStation = i;
                break;
            }
        }
        $scope.selectedStation = index;
    }
    $scope.setSelectedMainStation = function (index) {
        $scope.selectedMainStation = index;
        $scope.selectedStation = $scope.mainStations[index];
    }

    $scope.getSubstations = function (index) {
        var startIndex = $scope.mainStations[index];
        var endIndex = 0;
        if (index + 1 == $scope.mainStations.length) {
            endIndex = -1;
        } else {
            endIndex = $scope.mainStations[index + 1] - 1;
        }
        //return [startIndex, endIndex];
        if (endIndex == -1) {
            return [[$scope.stations[startIndex].name, startIndex]];
        } else {
            var arr = new Array();
            for (var i = startIndex; i <= endIndex; i++) {
                arr.push([$scope.stations[i].name, i])
            }
            return arr;
        }
    }

    $scope.getSingleClass = function () {
        if (!$scope.returnTicket)
            return "";
        else
            return "opaque";
    }

    $scope.getReturnClass = function () {
        if (!$scope.returnTicket)
            return "opaque";
        else
            return "";
    }

    $scope.getPersonClass = function (index, number) {
        if (index < number) {
            return "";
        } else {
            return "opaque";
        }
    }
    $scope.setNoOfAdults = function (num) {
        $scope.noOfAdults = num;
    }
    $scope.setNoOfChildren = function (num) {
        $scope.noOfChildren = num;
    }

    /**
     * Fare Calculation Method
     * Computes the total ticket price based on:
     * 1. Costs matrix for the current source station vs destination.
     * 2. Journey type (Return ticket doubles the base fare).
     * 3. Passenger composition (Adults pay full, Children pay half).
     */
    $scope.getTotal = function (dest, ret, ad, ch) {
        var total = 0;
        total = $scope.stations[$scope.source].costs[dest];
        if (ret) {
            total = total * 2;
        }
        total = total * ad + total * ch * 0.5;
        return total + " (= " + num2hindi(total) + ")";
    }

    $scope.mainStations = [0, 5, 9, 12, 16, 20];

    /**
     * Station Data Structure
     * Represents the graph of the metro network. Each station object contains:
     * - name: English name
     * - devng: Devanagari (Hindi/Marathi) name
     * - costs: Array representing the fare cost to every other station index.
     * - time: Array representing the travel time to every other station index.
     */
    $scope.stations = [
        {
            "name": "Borivali",
            "devng": "बोरिवली",
            "costs": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            "time": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
        },
        {
            "name": "Kandivali",
            "devng": "कांदिवली",
            "costs": [1, 0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            "time": [1, 0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
        },
        {
            "name": "Malad",
            "devng": "मालाड",
            "costs": [1, 2, 0, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            "time": [1, 2, 0, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
        },
        {
            "name": "Goregaon",
            "devng": "गोरेगाव",
            "costs": [1, 2, 3, 0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            "time": [1, 2, 3, 0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
        },
        {
            "name": "Jogeshwari",
            "devng": "जोगेश्वरी",
            "costs": [1, 2, 3, 4, 0, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            "time": [1, 2, 3, 4, 0, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
        },
        {
            "name": "Andheri",
            "devng": "अंधेरी",
            "costs": [1, 2, 3, 4, 5, 0, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            "time": [1, 2, 3, 4, 5, 0, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
        },
        {
            "name": "Vile Parle",
            "devng": "विले पार्ले",
            "costs": [1, 2, 3, 4, 5, 6, 0, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            "time": [1, 2, 3, 4, 5, 6, 0, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
        },
        {
            "name": "Santacruz",
            "devng": "सांताक्रुज़",
            "costs": [0, 1, 2, 3, 4, 5, 6, 7, 0, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            "time": [0, 1, 2, 3, 4, 5, 6, 7, 0, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
        },
        {
            "name": "Khar Road",
            "devng": "खार रोड",
            "costs": [1, 2, 3, 4, 5, 6, 7, 8, 0, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            "time": [1, 2, 3, 4, 5, 6, 7, 8, 0, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
        },
        {
            "name": "Bandra",
            "devng": "बान्दरा",
            "costs": [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            "time": [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
        },
        {
            "name": "Mahim",
            "devng": "माहिम",
            "costs": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            "time": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
        },
        {
            "name": "Matunga",
            "devng": "माटुंगा",
            "costs": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            "time": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 12, 13, 14, 15, 16, 17, 18, 19, 20]
        },
        {
            "name": "Dadar",
            "devng": "दादर",
            "costs": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 0, 13, 14, 15, 16, 17, 18, 19, 20],
            "time": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 0, 13, 14, 15, 16, 17, 18, 19, 20]
        },
        {
            "name": "Elphinstone Road",
            "devng": "एल्फिन्स्टन रोड",
            "costs": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 0, 14, 15, 16, 17, 18, 19, 20],
            "time": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 0, 14, 15, 16, 17, 18, 19, 20]
        },
        {
            "name": "Lower Parel",
            "devng": "लोअर परेल",
            "costs": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0, 15, 16, 17, 18, 19, 20],
            "time": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0, 15, 16, 17, 18, 19, 20]
        },
        {
            "name": "Mahalakshmi",
            "devng": "महालक्ष्मी",
            "costs": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0, 16, 17, 18, 19, 20],
            "time": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0, 16, 17, 18, 19, 20]
        },
        {
            "name": "Mumbai Central",
            "devng": "मुम्बई सेंट्रल",
            "costs": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 0, 17, 18, 19, 20],
            "time": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 0, 17, 18, 19, 20]
        },
        {
            "name": "Grant Road",
            "devng": "ग्रँट रोड",
            "costs": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 0, 18, 19, 20],
            "time": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 0, 18, 19, 20]
        },
        {
            "name": "Charni Road",
            "devng": "चर्नी रोड",
            "costs": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 0, 19, 20],
            "time": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 0, 19, 20]
        },
        {
            "name": "Marine Lines",
            "devng": "मरीन लाइन्स",
            "costs": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 0, 20],
            "time": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 0, 20]
        },
        {
            "name": "Churchgate",
            "devng": "चर्चगेट",
            "costs": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 0],
            "time": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 0]
        }

    ];
    $scope.range = function (num) {
        return new Array(num);
    }
}