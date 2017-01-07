/// <reference path='compute.ts'/>
"use strict";
var compute_1 = require("./compute");
var PercentageEntry = (function () {
    function PercentageEntry() {
    }
    return PercentageEntry;
}());
var computeCsvSheet = function (numberOfPlayer, simTimes) {
    if (numberOfPlayer === void 0) { numberOfPlayer = 9; }
    if (simTimes === void 0) { simTimes = 10009; }
    /**
     * a 13x13 rows [rol][col] as shown in http://i35.tinypic.com/anmufp.jpg, topleft is AA
     * bottom right is 22.
     * First index is the row, and second index is the column
     * @type {Array}
     */
    var sheet = [];
    var percentageSheet = [];
    for (var i = 0; i < 13; i++) {
        var row = new Array(13);
        sheet.push(row);
        percentageSheet.push(new Array(13));
    }
    // Suited
    for (var n1 = 12; n1 >= 0; n1--) {
        for (var n2 = n1 - 1; n2 >= 0; n2--) {
            var cardIndex1 = n1 * 4;
            var cardIndex2 = n2 * 4;
            var computer = new compute_1.Computer(cardIndex1, cardIndex2, simTimes, numberOfPlayer);
            var equityResult = computer.computeEquity();
            sheet[12 - n1][12 - n2] = equityResult;
        }
        console.log('XXX computed a line of suited odds, row card number = ' + n1);
    }
    // Off suited
    for (var n1 = 12; n1 >= 0; n1--) {
        for (var n2 = 12; n2 >= n1; n2--) {
            var cardIndex1 = n1 * 4 + 1;
            var cardIndex2 = n2 * 4;
            var computer = new compute_1.Computer(cardIndex1, cardIndex2, simTimes, numberOfPlayer);
            var equityResult = computer.computeEquity();
            sheet[12 - n1][12 - n2] = equityResult;
        }
        console.log('XXX computed a line of off suited odds, row card number = ' + n1);
    }
    console.log(''); // newline
    console.log('Total Equity');
    for (var i = 0; i < 13; i++) {
        var row = '';
        for (var j = 0; j < 13; j++) {
            row = row + sheet[i][j].totalEquity.toFixed(4) + ',';
        }
        console.log(row);
    }
    console.log(''); // newline
    console.log('Total Equity Confidential Interval of 95% (2*Sigma)');
    for (var i = 0; i < 13; i++) {
        var row = '';
        for (var j = 0; j < 13; j++) {
            row = row + (sheet[i][j].totalEquityStD * 2).toFixed(4) + ',';
        }
        console.log(row);
    }
    console.log(''); // newline
    console.log('Total Equity Over Average Of Players');
    for (var i = 0; i < 13; i++) {
        var row = '';
        for (var j = 0; j < 13; j++) {
            row = row + ((sheet[i][j].totalEquity * numberOfPlayer - 1) * 100.0).toFixed(2) + '%,';
        }
        console.log(row);
    }
    // Compute top percentage;
    var handRanks = [];
    for (var i = 0; i < 13; i++) {
        for (var j = 0; j < 13; j++) {
            var p = new PercentageEntry();
            p.positionInSheetI = i;
            p.positionInSheetJ = j;
            if (i == j)
                p.numberOfEquivalentHands = 6;
            else if (j > i)
                p.numberOfEquivalentHands = 4;
            else if (j < i)
                p.numberOfEquivalentHands = 12;
            p.simulationResult = sheet[i][j];
            handRanks.push(p);
            percentageSheet[i][j] = p;
        }
    }
    handRanks.sort(function (p1, p2) {
        return p1.simulationResult.totalEquity - p2.simulationResult.totalEquity;
    }).reverse();
    var currentHandsBeat = 1326;
    for (var _i = 0, handRanks_1 = handRanks; _i < handRanks_1.length; _i++) {
        var p = handRanks_1[_i];
        p.handsBeat = currentHandsBeat - p.numberOfEquivalentHands;
        currentHandsBeat -= p.numberOfEquivalentHands;
    }
    console.log(''); // newline
    console.log('Percentage Map');
    for (var i = 0; i < 13; i++) {
        var row = '';
        for (var j = 0; j < 13; j++) {
            row = row + (percentageSheet[i][j].handsBeat / 1326 * 100).toFixed(2) + '%,';
        }
        console.log(row);
    }
};
var compute22v33 = function () {
    console.log("XXX DEBG starting 22o v 33o 10000 times for 9 players");
    var computer;
    computer = new compute_1.Computer(0, 1, 10000, 9);
    console.log('XXX Start computing equity of 22o in an headsup');
    console.log(computer.computeEquity());
    computer = new compute_1.Computer(4, 5, 10000, 9);
    console.log('XXX Start computing equity of 33o in an headsup');
    console.log(computer.computeEquity());
};
var computeSingleCellEquity = function () {
    var computer = new compute_1.Computer(0, 1);
    console.log('XXX Start computing equity of AKo in an headsup');
    console.log(computer.computeEquity());
};
var computeA2O_6p = function () {
    var computer = new compute_1.Computer(51, 0, 20, 6); // A2o
    console.log('XXX Start computing equity of AKo in an headsup');
    console.log(computer.computeEquity());
};
var computeSingleHand = function () {
    var communityCardIndices = [28, 19, 9, 3, 10];
    var myHand = new compute_1.Hand([51, 46].concat(communityCardIndices));
    var oHand = new compute_1.Hand([15, 20].concat(communityCardIndices));
    var result = myHand.compareWith(oHand);
    console.log("XXX DEBUG: My Cards: " + (myHand.myCards[0].getNumberWithColorStr() + ' ' + myHand.myCards[1].getNumberWithColorStr()));
    console.log("XXX DEBUG: O Cards: " + (oHand.myCards[0].getNumberWithColorStr() + ' ' + oHand.myCards[1].getNumberWithColorStr()));
    console.log("XXX DEBUG: My Hand Type: " + compute_1.HandType[myHand.getHandType()]);
    console.log("XXX DEBUG: O Hand Type: " + compute_1.HandType[oHand.getHandType()]);
    console.log("XXX DEBUG: Community Cards: " + communityCardIndices.map(function (cI) { return new compute_1.Card(cI).getNumberWithColorStr(); }).join(' '));
    console.log("XXX DEBUG: compare result = " + result);
    console.log('');
    console.log("XXX DEBUG result = " + result);
};
var main = function () {
    computeCsvSheet();
};
main();
