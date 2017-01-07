"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var mocha_typescript_1 = require("mocha-typescript");
var compute_1 = require("../compute");
var chai_1 = require("chai");
//noinspection BadExpressionStatementJS
var HandTest = (function () {
    function HandTest() {
        this.card2s = 0;
        this.card2c = 1;
        this.card2h = 2;
        this.card2d = 3;
        this.card3s = 4;
        this.card3c = 5;
        this.card3h = 6;
        this.card3d = 7;
        this.card4s = 8;
        this.card4c = 9;
        this.card4h = 10;
        this.card4d = 11;
        this.card5s = 12;
        this.card5c = 13;
        this.card5h = 14;
        this.card5d = 15;
        this.card6s = 16;
        this.card6c = 17;
        this.card6h = 18;
        this.card6d = 19;
        this.card7s = 20;
        this.card7c = 21;
        this.card7h = 22;
        this.card7d = 23;
        this.card8s = 24;
        this.card8c = 25;
        this.card8h = 26;
        this.card8d = 27;
        this.card9s = 28;
        this.card9c = 29;
        this.card9h = 30;
        this.card9d = 31;
        this.cardTs = 32;
        this.cardTc = 33;
        this.cardTh = 34;
        this.cardTd = 35;
        this.cardJs = 36;
        this.cardJc = 37;
        this.cardJh = 38;
        this.cardJd = 39;
        this.cardQs = 40;
        this.cardQc = 41;
        this.cardQh = 42;
        this.cardQd = 43;
        this.cardKs = 44;
        this.cardKc = 45;
        this.cardKh = 46;
        this.cardKd = 47;
        this.cardAs = 48;
        this.cardAc = 49;
        this.cardAh = 50;
        this.cardAd = 51;
    }
    //noinspection JSUnusedGlobalSymbols,JSMethodCanBeStatic
    HandTest.prototype.testDuplicationCheck = function () {
        compute_1.flags.debugOn = true; // need the thrown exceptions
        try {
            new compute_1.Hand([1, 1, 2, 3, 4, 5]);
            chai_1.assert(false, 'Test should fail.');
        }
        catch (reason) {
            chai_1.assert(reason instanceof Error);
            chai_1.assert(reason.message.indexOf('duplicated') > 0, "Reason should contains \"duplicated\" but it doesn't, it is " + reason.message);
        }
    };
    //noinspection JSUnusedGlobalSymbols,JSMethodCanBeStatic
    HandTest.prototype.testLengthCheck = function () {
        compute_1.flags.debugOn = true; // need the thrown exceptions
        try {
            new compute_1.Hand([1, 1, 2, 12, 45, 51]);
            chai_1.assert(false, 'Test should fail.');
        }
        catch (reason) {
            chai_1.assert(reason instanceof Error);
            chai_1.assert(reason.message.indexOf('duplicated') > 0, "Reason should contains \"duplicated\" but it doesn't, it is " + reason.message);
        }
    };
    //noinspection JSUnusedGlobalSymbols
    HandTest.prototype.testCompareDifferentTypes = function () {
        var handFlushStraight = new compute_1.Hand([
            this.card2s, this.card3s, this.card4s,
            this.card5s, this.card6s, this.card9h, this.cardTc
        ]);
        var handFourOfAKind = new compute_1.Hand([
            this.card2s, this.card2h, this.card2c,
            this.card2d, this.card5d, this.card9h, this.cardTc
        ]);
        var handFullHouse = new compute_1.Hand([
            this.card2s, this.card2h, this.card2c,
            this.card5s, this.card5d, this.card9h, this.cardTc
        ]);
        var handFlush = new compute_1.Hand([
            this.card2s, this.card3s, this.card4s,
            this.card5s, this.card7s, this.card9h, this.cardTc
        ]);
        var handStraight = new compute_1.Hand([
            this.card2s, this.card3c, this.card4s,
            this.card5c, this.card6h, this.cardKh, this.cardQc
        ]);
        var handThreeOfAKind = new compute_1.Hand([this.card2s, this.card2c, this.card2d, 5, 51, 46, 41]);
        var handTwoPair = new compute_1.Hand([this.card2s, this.card2c, this.card3h, this.card3d, 51, 46, 41]);
        var handOnePair = new compute_1.Hand([this.card2s, this.card2c, 51, 46, 41]);
        var handHighCard = new compute_1.Hand([this.card2s, 6, 51, 46, 41]);
        chai_1.assert(handFlushStraight.getHandType() == compute_1.HandType.FlushStraight);
        chai_1.assert(handFourOfAKind.getHandType() == compute_1.HandType.FourOfAKind);
        chai_1.assert(handFullHouse.getHandType() == compute_1.HandType.FullHouse);
        chai_1.assert(handFlush.getHandType() == compute_1.HandType.Flush);
        chai_1.assert(handStraight.getHandType() == compute_1.HandType.Straight);
        chai_1.assert(handThreeOfAKind.getHandType() == compute_1.HandType.ThreeOfAKind);
        chai_1.assert(handTwoPair.getHandType() == compute_1.HandType.TwoPairs);
        chai_1.assert(handOnePair.getHandType() == compute_1.HandType.OnePair);
        chai_1.assert(handHighCard.getHandType() == compute_1.HandType.HighCard);
        var orderList = [
            handFlushStraight, handFourOfAKind, handFullHouse,
            handFlush, handStraight, handThreeOfAKind,
            handTwoPair, handOnePair, handHighCard
        ];
        for (var i = 0; i < orderList.length - 1; i++) {
            var compareResult = orderList[i].compareWith(orderList[i + 1]);
            chai_1.assert(compareResult > 0, "Compare failed, HandType " + orderList[i].getHandType() + " \n          should breat " + orderList[i + 1].getHandType() + " ");
        }
    };
    //noinspection JSUnusedGlobalSymbols
    HandTest.prototype.testRecognizeFlushStraight = function () {
        var handFlushStraight5high = new compute_1.Hand([
            this.card2s, this.card3s, this.card4s,
            this.card5s, this.card9h, this.cardAs, this.cardQc
        ]);
        var handFlushStraight6high = new compute_1.Hand([
            this.card6s, this.card2s, this.card3s,
            this.card4s, this.card5s, this.cardKs, this.cardQs
        ]);
        [handFlushStraight5high, handFlushStraight6high]
            .forEach(function (h) { return chai_1.assert(h.getHandType() == compute_1.HandType.FlushStraight); });
        chai_1.assert(handFlushStraight5high.resultNumbers[0] == 3);
        chai_1.assert(handFlushStraight6high.resultNumbers[0] == 4);
        chai_1.assert(handFlushStraight6high.compareWith(handFlushStraight5high) > 0, '6 high FlushStraight should beat 5 high');
    };
    //noinspection JSUnusedGlobalSymbols
    HandTest.prototype.testRecognizeFourOfAKind = function () {
        var handFour2WithAhigh = new compute_1.Hand([
            this.card2s, this.card2c, this.card2h,
            this.card2d, this.card9h, this.cardAs, this.cardQc
        ]);
        var handFour2WithQhigh = new compute_1.Hand([
            this.card2s, this.card2c, this.card2h,
            this.card2d, this.card9h, this.cardTs, this.cardQc
        ]);
        var handFour3With9high = new compute_1.Hand([
            this.card3s, this.card3c, this.card3h,
            this.card3d, this.card9h, this.card8s, this.cardQc
        ]);
        [
            handFour2WithAhigh,
            handFour2WithQhigh,
            handFour3With9high
        ]
            .forEach(function (h) { return chai_1.assert(h.getHandType() == compute_1.HandType.FourOfAKind); });
        chai_1.assert(handFour2WithAhigh.resultNumbers[0] == 0);
        chai_1.assert(handFour2WithQhigh.resultNumbers[0] == 0);
        chai_1.assert(handFour3With9high.resultNumbers[0] == 1);
        chai_1.assert(handFour2WithAhigh.compareWith(handFour2WithQhigh) > 0, 'Four of 2 With A high FourOfAKind should beat Four of 2 With Q high');
        chai_1.assert(handFour3With9high.compareWith(handFour2WithAhigh) > 0, 'Four of 3 With 9 high FourOfAKind should beat Four of 2 With A high');
    };
    //noinspection JSUnusedGlobalSymbols
    HandTest.prototype.testRecognizeFullHouse = function () {
        var handFull2Pair9 = new compute_1.Hand([
            this.card2s, this.card2c, this.card2h,
            this.card3d, this.card3h, this.cardAs, this.cardQc
        ]);
        var handFull3Pair8 = new compute_1.Hand([
            this.card3s, this.card3c, this.card3h,
            this.card8d, this.card8h, this.cardTs, this.cardQc
        ]);
        var handFull3Pair8WithAHigh = new compute_1.Hand([
            this.card3s, this.card3c, this.card3h,
            this.card8d, this.card9h, this.card8s, this.cardAh
        ]);
        [
            handFull2Pair9,
            handFull3Pair8,
            handFull3Pair8WithAHigh
        ]
            .forEach(function (h) { return chai_1.assert(h.getHandType() == compute_1.HandType.FullHouse); });
        chai_1.assert(handFull2Pair9.resultNumbers[0] == 0);
        chai_1.assert(handFull3Pair8.resultNumbers[0] == 1);
        chai_1.assert(handFull3Pair8WithAHigh.resultNumbers[0] == 1);
        chai_1.assert(handFull3Pair8.compareWith(handFull2Pair9) > 0, 'House of 3 With Pair of 8 should beat House of 2 With Pair of 9');
        chai_1.assert(handFull3Pair8.compareWith(handFull3Pair8WithAHigh) == 0, 'House of 3 With Pair of 8 with different other cards should equal.');
    };
    //noinspection JSUnusedGlobalSymbols
    HandTest.prototype.testRecognizeFlush = function () {
        var handFlushAhigh = new compute_1.Hand([
            this.card2s, this.card3h, this.card4h,
            this.card5h, this.card9h, this.cardAh, this.cardQc
        ]);
        var handFlushQT976high = new compute_1.Hand([
            this.card6s, this.card7s, this.card9s,
            this.cardTs, this.card6h, this.cardKh, this.cardQs
        ]);
        var handFlushQT975high = new compute_1.Hand([
            this.card5c, this.card7c, this.card9c,
            this.cardTc, this.card6h, this.cardKh, this.cardQc
        ]);
        [
            handFlushAhigh,
            handFlushQT975high,
            handFlushQT976high
        ]
            .forEach(function (h) { return chai_1.assert(h.getHandType() == compute_1.HandType.Flush); });
        chai_1.assert(handFlushAhigh.resultNumbers[0] == 12);
        chai_1.assert(handFlushQT976high.resultNumbers[0] == 10);
        chai_1.assert(handFlushQT975high.resultNumbers[0] == 10);
        chai_1.assert(handFlushAhigh.compareWith(handFlushQT976high) > 0, 'A high flush should beat Q high');
        chai_1.assert(handFlushQT976high.compareWith(handFlushQT975high) > 0, 'QT976 high flush should beat QT975 high');
    };
    //noinspection JSUnusedGlobalSymbols
    HandTest.prototype.testRecognizeStraight = function () {
        var handStraight6high = new compute_1.Hand([
            this.card2s, this.card3c, this.card4s,
            this.card5c, this.card6h, this.cardKh, this.cardQc
        ]);
        var handStraight5high = new compute_1.Hand([
            this.card2s, this.card3c, this.card4s,
            this.card5c, this.card9h, this.cardAh, this.cardQc
        ]);
        var handStraightAhigh = new compute_1.Hand([
            this.cardTs, this.cardJc, this.cardKs,
            this.card5c, this.card9h, this.cardAh, this.cardQc
        ]);
        [
            handStraight6high,
            handStraight5high,
            handStraightAhigh
        ]
            .forEach(function (h) { return chai_1.assert(h.getHandType() == compute_1.HandType.Straight); });
        chai_1.assert(handStraight6high.resultNumbers[0] == 4);
        chai_1.assert(handStraight5high.resultNumbers[0] == 3);
        chai_1.assert(handStraightAhigh.resultNumbers[0] == 12);
        chai_1.assert(handStraight6high.compareWith(handStraight5high) > 0, '6 high straight should beat 5 high');
        chai_1.assert(handStraightAhigh.compareWith(handStraight6high) > 0, 'A high straight should beat 6 high');
    };
    //noinspection JSUnusedGlobalSymbols
    HandTest.prototype.testRecognizeThreeOfAKind = function () {
        var hand222Q7 = new compute_1.Hand([
            this.card2s, this.card2c, this.card2h,
            this.card3d, this.card5h, this.card7s, this.cardQc
        ]);
        var hand333JT = new compute_1.Hand([
            this.card3s, this.card3c, this.card3h,
            this.card4d, this.card5h, this.cardTs, this.cardJc
        ]);
        [
            hand222Q7,
            hand333JT,
        ]
            .forEach(function (h) { return chai_1.assert(h.getHandType() == compute_1.HandType.ThreeOfAKind); });
        chai_1.assert(hand222Q7.resultNumbers[0] == 0);
        chai_1.assert(hand333JT.resultNumbers[0] == 1);
        chai_1.assert(hand333JT.compareWith(hand222Q7) > 0, 'Three of 333TJ should beat Three of 222q7');
    };
    //noinspection JSUnusedGlobalSymbols
    HandTest.prototype.testRecognizeTwoPairs = function () {
        var hand9922T = new compute_1.Hand([
            this.card2s, this.card2c, this.card9h,
            this.card9d, this.card4h, this.card8s, this.cardTc
        ]);
        var hand8833K = new compute_1.Hand([
            this.card3s, this.card3c, this.cardTh,
            this.card8d, this.card8h, this.cardKs, this.cardJc
        ]);
        [
            hand9922T,
            hand8833K,
        ]
            .forEach(function (h) { return chai_1.assert(h.getHandType() == compute_1.HandType.TwoPairs, "Type is actually " + compute_1.HandType[h.getHandType()]); });
        chai_1.assert(hand9922T.resultNumbers[0] == 7);
        chai_1.assert(hand8833K.resultNumbers[0] == 6);
        chai_1.assert(hand9922T.compareWith(hand8833K) > 0, '9922T should beat 3388K');
    };
    //noinspection JSUnusedGlobalSymbols
    HandTest.prototype.testRecognizeOnePair = function () {
        var hand99T84 = new compute_1.Hand([
            this.card2s, this.card3c, this.card9h,
            this.card9d, this.card4h, this.card8s, this.cardTc
        ]);
        var hand77T84 = new compute_1.Hand([
            this.card2s, this.card3c, this.card7h,
            this.card7d, this.card4h, this.card8s, this.cardTc
        ]);
        [
            hand99T84,
            hand77T84,
        ]
            .forEach(function (h) { return chai_1.assert(h.getHandType() == compute_1.HandType.OnePair); });
        chai_1.assert(hand99T84.resultNumbers[0] == 7);
        chai_1.assert(hand77T84.resultNumbers[0] == 5);
        chai_1.assert(hand99T84.compareWith(hand77T84) > 0, '99T84 should beat 77T84');
    };
    //noinspection JSUnusedGlobalSymbols
    HandTest.prototype.testRecognizeHighCard = function () {
        var handAKQ97 = new compute_1.Hand([
            this.card5s, this.card7c, this.card9h,
            this.cardQd, this.cardKh, this.cardAs, this.card2c
        ]);
        var handKQJ97 = new compute_1.Hand([
            this.card5s, this.card7c, this.card9h,
            this.cardQd, this.cardKh, this.cardJs, this.card2c
        ]);
        [
            handAKQ97,
            handKQJ97,
        ]
            .forEach(function (h) { return chai_1.assert(h.getHandType() == compute_1.HandType.HighCard); });
        chai_1.assert(handAKQ97.resultNumbers[0] == 12);
        chai_1.assert(handKQJ97.resultNumbers[0] == 11);
        chai_1.assert(handAKQ97.compareWith(handKQJ97) > 0, 'AKQ975 should beat KQJ975');
    };
    return HandTest;
}());
__decorate([
    mocha_typescript_1.test('creation should avoid duplications.')
], HandTest.prototype, "testDuplicationCheck");
__decorate([
    mocha_typescript_1.test('creation should avoid any hand that is less than 5 cards.')
], HandTest.prototype, "testLengthCheck");
__decorate([
    mocha_typescript_1.test('hand compare should correctly compare different card types.')
], HandTest.prototype, "testCompareDifferentTypes");
__decorate([
    mocha_typescript_1.test('should recognize and compare FlushStraight correctly.')
], HandTest.prototype, "testRecognizeFlushStraight");
__decorate([
    mocha_typescript_1.test('should recognize and compare FourOfAKind correctly.')
], HandTest.prototype, "testRecognizeFourOfAKind");
__decorate([
    mocha_typescript_1.test('should recognize and compare FourOfAKind correctly.')
], HandTest.prototype, "testRecognizeFullHouse");
__decorate([
    mocha_typescript_1.test('should recognize and compare Flush correctly.')
], HandTest.prototype, "testRecognizeFlush");
__decorate([
    mocha_typescript_1.test('should recognize 5 high Straight correctly and compare straights correctly.')
], HandTest.prototype, "testRecognizeStraight");
__decorate([
    mocha_typescript_1.test('should recognize and compare ThreeOfAkIND correctly.')
], HandTest.prototype, "testRecognizeThreeOfAKind");
__decorate([
    mocha_typescript_1.test('should recognize and compare TwoPairs correctly.')
], HandTest.prototype, "testRecognizeTwoPairs");
__decorate([
    mocha_typescript_1.test('should recognize and compare OnePair correctly.')
], HandTest.prototype, "testRecognizeOnePair");
__decorate([
    mocha_typescript_1.test('should recognize and compare HightCard correctly.')
], HandTest.prototype, "testRecognizeHighCard");
HandTest = __decorate([
    mocha_typescript_1.suite("Hand ")
], HandTest);
