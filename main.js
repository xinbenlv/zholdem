/// <reference path='compute.ts'/>
"use strict";
var compute_1 = require("./compute");
var computeCsvSheet = function (numberOfPlayer) {
    if (numberOfPlayer === void 0) { numberOfPlayer = 2; }
    var simTimes = 10000;
    var suitedOdds = {};
    var offSuitedOdds = {};
    /**
     * a 13x13 rows [rol][col] as shown in http://i35.tinypic.com/anmufp.jpg, topleft is AA
     * bottom right is 22.
     * First index is the row, and second index is the column
     * @type {Array}
     */
    var sheet = [];
    for (var i = 0; i < 13; i++) {
        var row = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        sheet.push(row);
    }
    // Suited
    for (var n1 = 12; n1 >= 0; n1--) {
        for (var n2 = n1 - 1; n2 >= 0; n2--) {
            var cardIndex1 = n1 * 4;
            var cardIndex2 = n2 * 4;
            var card1 = new compute_1.Card(cardIndex1);
            var card2 = new compute_1.Card(cardIndex2);
            var computer = new compute_1.Computer(cardIndex1, cardIndex2, simTimes, numberOfPlayer);
            var equity = computer.computeEquity();
            suitedOdds[card1.getNumberStr() + card2.getNumberStr()] = equity;
            sheet[12 - n1][12 - n2] = equity;
        }
        console.log('XXX computed a line of suited odds, row card number = ' + n1);
    }
    // Off suited
    for (var n1 = 12; n1 >= 0; n1--) {
        for (var n2 = 12; n2 >= n1; n2--) {
            var cardIndex1 = n1 * 4 + 1;
            var cardIndex2 = n2 * 4;
            var card1 = new compute_1.Card(cardIndex1);
            var card2 = new compute_1.Card(cardIndex2);
            var computer = new compute_1.Computer(cardIndex1, cardIndex2, simTimes, numberOfPlayer);
            var equity = computer.computeEquity();
            offSuitedOdds[card1.getNumberStr() + card2.getNumberStr()] = equity;
            sheet[12 - n1][12 - n2] = equity;
        }
        console.log('XXX computed a line of off suited odds, row card number = ' + n1);
    }
    console.log('Equity Ratio');
    for (var i = 0; i < 13; i++) {
        var row = '';
        for (var j = 0; j < 13; j++) {
            row = row + sheet[i][j] + ',';
        }
        console.log(row);
    }
    console.log('Percentage Ahead Compare To Average of All');
    for (var i = 0; i < 13; i++) {
        var row = '';
        for (var j = 0; j < 13; j++) {
            row = row + (sheet[i][j] * numberOfPlayer - 1) * 100 + '%,';
        }
        console.log(row);
    }
};
var computeSingleCellEquity = function () {
    var computer = new compute_1.Computer(51, 46);
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
    console.log("XXX DEBG starting player 9");
    computeCsvSheet(9);
};
main();
