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
    HandTest.prototype.testDuplicationCheck = function () {
        compute_1.flags.debugOn = true;
        try {
            new compute_1.Hand([1, 1, 2, 3, 4, 5]);
            chai_1.assert(false, 'Test should fail.');
        }
        catch (reason) {
            chai_1.assert(reason instanceof Error);
            chai_1.assert(reason.message.indexOf('duplicated') > 0, "Reason should contains \"duplicated\" but it doesn't, it is " + reason.message);
        }
    };
    HandTest.prototype.testLengthCheck = function () {
        compute_1.flags.debugOn = true;
        try {
            new compute_1.Hand([1, 1, 2, 3, 4, 5]);
            chai_1.assert(false, 'Test should fail.');
        }
        catch (reason) {
            chai_1.assert(reason instanceof Error);
            chai_1.assert(reason.message.indexOf('duplicated') > 0, "Reason should contains \"duplicated\" but it doesn't, it is " + reason.message);
        }
    };
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
        var handHighCard = new compute_1.Hand([this.card2s, 6 /*2c*/, 51, 46, 41]);
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
HandTest = __decorate([
    mocha_typescript_1.suite("Hand ")
], HandTest);
