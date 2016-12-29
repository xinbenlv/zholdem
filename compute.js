var debugOn = true;
var HandType;
(function (HandType) {
    HandType[HandType["FlushStraight"] = 9] = "FlushStraight";
    HandType[HandType["FourOfAKind"] = 8] = "FourOfAKind";
    HandType[HandType["FullHouse"] = 7] = "FullHouse";
    HandType[HandType["Flush"] = 6] = "Flush";
    HandType[HandType["Straight"] = 5] = "Straight";
    HandType[HandType["ThreeOfAKind"] = 4] = "ThreeOfAKind";
    HandType[HandType["TwoPairs"] = 3] = "TwoPairs";
    HandType[HandType["OnePair"] = 2] = "OnePair";
    HandType[HandType["HighCard"] = 1] = "HighCard";
})(HandType || (HandType = {}));
var Color;
(function (Color) {
    Color[Color["Spade"] = 0] = "Spade";
    Color[Color["Club"] = 1] = "Club";
    Color[Color["Heart"] = 2] = "Heart";
    Color[Color["Diamond"] = 3] = "Diamond";
})(Color || (Color = {}));
var Card = (function () {
    function Card(index) {
        this.index = index;
    }
    ;
    /**
     * Return the number of a card based on index
     * Card a 2 - 14 number representing 2, 3, ... T, J, Q, A,
     * where the index of Card 2 is 0
     * the index of Card A is 12, in straight check Card A also has an index of -1
     * */
    Card.prototype.getNumber = function () {
        return Math.floor(this.index / 4);
    }; //
    Card.prototype.getNumberStr = function () {
        var n = this.getNumber();
        console.assert(n >= 0 && n <= 12, "n is incorrect, n = " + n);
        if (n < 8)
            return (n + 2).toString();
        else {
            switch (n) {
                case 8:
                    return 'T';
                case 9:
                    return 'J';
                case 10:
                    return 'Q';
                case 11:
                    return 'K';
                case 12:
                    return 'A';
            }
        }
    };
    Card.prototype.getColorStrShort = function () {
        var c = this.getColor();
        switch (c) {
            case Color.Spade:
                return 's';
            case Color.Club:
                return 'c';
            case Color.Heart:
                return 'h';
            case Color.Diamond:
                return 'd';
        }
    };
    Card.prototype.getNumberWithColorStr = function () {
        return this.getNumberStr() + this.getColorStrShort();
    };
    Card.prototype.getColor = function () {
        switch (this.index % 4) {
            case 0:
                return Color.Spade;
            case 1:
                return Color.Club;
            case 2:
                return Color.Heart;
            case 3:
                return Color.Diamond;
        }
    };
    return Card;
}());
var Hand = (function () {
    function Hand(myCards) {
        // TODO assert no duplicates
        var cardIndices = myCards.sort();
        this.myCards = [];
        for (var _i = 0, cardIndices_1 = cardIndices; _i < cardIndices_1.length; _i++) {
            var n = cardIndices_1[_i];
            var c = new Card(n);
            this.myCards.push(c);
        }
        this.handType = this.analyse();
    }
    /**
     * Set cached fields after analyse
     * It will {resultNumbers}
     * @returns {HandType}
     */
    Hand.prototype.analyse = function () {
        if (this.isFlushStraight())
            return HandType.FlushStraight;
        else if (this.isFourOfAKind())
            return HandType.FourOfAKind;
        else if (this.isFullHouse())
            return HandType.FullHouse;
        else if (this.isFlush())
            return HandType.Flush;
        else if (this.isStraight())
            return HandType.Straight;
        else if (this.isThreeOfAKind())
            return HandType.ThreeOfAKind;
        else if (this.isTwoPair())
            return HandType.TwoPairs;
        else if (this.isOnePair())
            return HandType.OnePair;
        else if (this.isHighCard())
            return HandType.HighCard;
    };
    Hand.prototype.getHandType = function () {
        return this.handType;
    };
    // FlushStraight = 9,
    // FourOfAKind = 8,
    // FullHouse = 7,
    // Flush = 6,
    // Straight = 5,
    // ThreeOfAKind = 4,
    // TwoPairs = 3,
    // OnePair = 2,
    // HighCard = 1,
    Hand.prototype.isFlushStraight = function () {
        var colorSet = {};
        var flushColor = null;
        var result = false;
        this.myCards.forEach(function (myCard) {
            if (colorSet[myCard.getColor()] === undefined)
                colorSet[myCard.getColor()] = 1;
            else
                colorSet[myCard.getColor()] = colorSet[myCard.getColor()] + 1;
            if (colorSet[myCard.getColor()] >= 5) {
                flushColor = myCard.getColor();
            }
        });
        if (flushColor != null) {
            var numberSet_1 = {};
            this.myCards.forEach(function (myCard) {
                if (myCard.getColor() === flushColor) {
                    if (numberSet_1[myCard.getNumber()] === undefined)
                        numberSet_1[myCard.getNumber()] = 1;
                    else
                        numberSet_1[myCard.getNumber()] = numberSet_1[myCard.getNumber()] + 1;
                }
            });
            var numbers = Object.keys(numberSet_1)
                .map(function (keyStr) { return parseInt(keyStr); }).sort();
            if (numbers.indexOf(12) > 0) {
                numbers = [-1].concat(numbers);
            }
            var countConsecutive = 1;
            for (var i = 1; i < numbers.length; i++) {
                if (numbers[i] - numbers[i - 1] == 1) {
                    countConsecutive++;
                }
                else
                    countConsecutive = 1;
                if (countConsecutive >= 5) {
                    result = true;
                    this.resultNumbers = [numbers[i]]; // only store the highest card index in a flushstraight
                }
            }
        }
        return result;
    };
    Hand.prototype.isFourOfAKind = function () {
        var numberSet = {};
        var result = false;
        var cardOfFourIndex = null;
        for (var _i = 0, _a = this.myCards; _i < _a.length; _i++) {
            var myCard = _a[_i];
            if (numberSet[myCard.getNumber()] === undefined)
                numberSet[myCard.getNumber()] = 1;
            else
                numberSet[myCard.getNumber()] = numberSet[myCard.getNumber()] + 1;
            if (numberSet[myCard.getNumber()] >= 4) {
                result = true;
                cardOfFourIndex = myCard.getNumber();
            }
        }
        if (result) {
            var kicker = Object.keys(numberSet)
                .map(function (keyStr) { return parseInt(keyStr); })
                .filter(function (index) { return index != cardOfFourIndex; })
                .sort().reverse()[0];
            this.resultNumbers = [cardOfFourIndex, kicker];
        }
        return result;
    };
    Hand.prototype.isFullHouse = function () {
        var numberSet = {};
        var houseIndex = null;
        var pairIndex = null;
        for (var _i = 0, _a = this.myCards; _i < _a.length; _i++) {
            var myCard = _a[_i];
            if (numberSet[myCard.getNumber()] === undefined)
                numberSet[myCard.getNumber()] = 1;
            else
                numberSet[myCard.getNumber()] = numberSet[myCard.getNumber()] + 1;
        }
        var hasPair = false;
        var hasThreeOfAKind = false;
        for (var key in numberSet) {
            if (numberSet[key] == 3) {
                hasThreeOfAKind = true;
                houseIndex = parseInt(key);
            }
            else if (numberSet[key] == 2) {
                hasPair = true;
                pairIndex = parseInt(key);
            }
        }
        if (hasPair && hasThreeOfAKind) {
            this.resultNumbers = [houseIndex, pairIndex];
        }
        return hasPair && hasThreeOfAKind;
    };
    Hand.prototype.isFlush = function () {
        var colorSet = {};
        var flushColor = null;
        var isFlush = false;
        for (var _i = 0, _a = this.myCards; _i < _a.length; _i++) {
            var myCard = _a[_i];
            if (colorSet[myCard.getColor()] === undefined)
                colorSet[myCard.getColor()] = 1;
            else
                colorSet[myCard.getColor()] = colorSet[myCard.getColor()] + 1;
            if (colorSet[myCard.getColor()] >= 5) {
                isFlush = true;
                flushColor = myCard.getColor();
            }
        }
        if (isFlush) {
            this.resultNumbers = this.myCards
                .filter(function (card) { return card.getColor() == flushColor; })
                .map(function (card) { return card.getNumber(); })
                .reverse()
                .slice(0, 5);
        }
        return isFlush;
    };
    // TODO test-cases
    //   AKQJT98, top card A
    //   A2345 89, top card 5
    //   A 34567 9, top card 7
    //   345678 JQ, top card 8
    Hand.prototype.isStraight = function () {
        var numberSet = {};
        var highCardIndex = null;
        var result = false;
        this.myCards.forEach(function (myCard) {
            if (numberSet[myCard.getNumber()] === undefined)
                numberSet[myCard.getNumber()] = 1;
            else
                numberSet[myCard.getNumber()] = numberSet[myCard.getNumber()] + 1;
        });
        var numbers = Object.keys(numberSet).map(function (keyStr) { return parseInt(keyStr); }).sort();
        if (numbers.indexOf(12) > 0) {
            numbers = [-1].concat(numbers);
        }
        var countConsecutive = 1;
        for (var i = 1; i < numbers.length; i++) {
            if (numbers[i] - numbers[i - 1] == 1) {
                countConsecutive++;
            }
            else
                countConsecutive = 1;
            if (countConsecutive >= 5) {
                highCardIndex = numbers[i];
                result = true;
            }
        }
        if (result)
            this.resultNumbers = [highCardIndex];
        return result;
    };
    // TODO test casse:
    //   AAAKKKQQ, resultNumbers should be AK
    Hand.prototype.isThreeOfAKind = function () {
        var numberSet = {};
        var currentTopCardNumber = null;
        var result = false;
        for (var _i = 0, _a = this.myCards; _i < _a.length; _i++) {
            var myCard = _a[_i];
            if (numberSet[myCard.getNumber()] === undefined)
                numberSet[myCard.getNumber()] = 1;
            else
                numberSet[myCard.getNumber()] = numberSet[myCard.getNumber()] + 1;
        }
        for (var key in numberSet) {
            if (numberSet[key] >= 3) {
                result = true;
                if (currentTopCardNumber == null)
                    currentTopCardNumber = numberSet[key];
                else {
                    currentTopCardNumber = currentTopCardNumber > numberSet[key] ?
                        currentTopCardNumber : numberSet[key];
                }
            }
        }
        if (result) {
            var otherNumbers = this.myCards.map(function (card) { return card.getNumber(); })
                .filter(function (number) { return number != currentTopCardNumber; })
                .sort()
                .reverse()
                .slice(0, 2);
            this.resultNumbers = [currentTopCardNumber].concat(otherNumbers);
        }
        return result;
    };
    Hand.prototype.isTwoPair = function () {
        var numberSet = {};
        for (var _i = 0, _a = this.myCards; _i < _a.length; _i++) {
            var myCard = _a[_i];
            if (numberSet[myCard.getNumber()] === undefined)
                numberSet[myCard.getNumber()] = 1;
            else
                numberSet[myCard.getNumber()] = numberSet[myCard.getNumber()] + 1;
        }
        var numPairs = 0;
        for (var key in numberSet) {
            if (numberSet[key] >= 2) {
                numPairs++;
            }
        }
        if (numPairs >= 2) {
            var pairNumbers_1 = Object.keys(numberSet)
                .filter(function (key) { return numberSet[key] >= 2; })
                .map(function (keyStr) { return parseInt(keyStr); })
                .sort()
                .reverse()
                .slice(0, 2);
            var restNumber = Object.keys(numberSet).map(function (keyStr) { return parseInt(keyStr); })
                .filter(function (key) { return pairNumbers_1.indexOf(key) < 0; }) // not selected in pairIndex
                .sort()
                .reverse()[0];
            this.resultNumbers = pairNumbers_1.concat([restNumber]);
            return true;
        }
        return false;
    };
    Hand.prototype.isOnePair = function () {
        var numberSet = {};
        var _loop_1 = function(myCard) {
            if (numberSet[myCard.getNumber()] === undefined)
                numberSet[myCard.getNumber()] = 1;
            else
                numberSet[myCard.getNumber()] = numberSet[myCard.getNumber()] + 1;
            if (numberSet[myCard.getNumber()] >= 2) {
                var pairNumber_1 = myCard.getNumber();
                var otherNumbers = this_1.myCards
                    .map(function (card) { return card.getNumber(); })
                    .filter(function (number) { return number != pairNumber_1; })
                    .sort()
                    .reverse().slice(0, 3);
                this_1.resultNumbers = [pairNumber_1].concat(otherNumbers);
                return { value: true };
            }
        };
        var this_1 = this;
        for (var _i = 0, _a = this.myCards; _i < _a.length; _i++) {
            var myCard = _a[_i];
            var state_1 = _loop_1(myCard);
            if (typeof state_1 === "object") return state_1.value;
        }
        return false;
    };
    /**
     * @returns {boolean} Alwayse return true
     */
    Hand.prototype.isHighCard = function () {
        this.resultNumbers = this.myCards.map(function (card) { return card.getNumber(); })
            .sort()
            .reverse().slice(0, 5);
        return true;
    };
    /**
     *
     * @param opponent
     * @returns 1 if win, 0 if split, -1 if lost
     */
    Hand.prototype.compareWith = function (opponent) {
        var myHandType = this.getHandType();
        var oHandType = opponent.getHandType();
        if (myHandType > oHandType) {
            return 1;
        }
        else if (myHandType < oHandType) {
            return -1;
        }
        else if (myHandType == oHandType) {
            console.assert(this.resultNumbers.length == opponent.resultNumbers.length);
            for (var i = 0; i < this.resultNumbers.length; i++) {
                if (this.resultNumbers[i] > opponent.resultNumbers[i])
                    return 1;
                else if (this.resultNumbers[i] < opponent.resultNumbers[i])
                    return -1;
            }
            return 0; // complete equal
        }
    };
    return Hand;
}());
var Computer = (function () {
    function Computer(myCardIndex1, myCardIndex2, emulationTimes, numberOfPlayers, considerSplitAsPartiallyWin) {
        if (emulationTimes === void 0) { emulationTimes = 1000; }
        if (numberOfPlayers === void 0) { numberOfPlayers = 2; }
        if (considerSplitAsPartiallyWin === void 0) { considerSplitAsPartiallyWin = true; }
        this.myCardIndex1 = myCardIndex1;
        this.myCardIndex2 = myCardIndex2;
        this.emulationTimes = emulationTimes;
        this.numberOfPlayers = numberOfPlayers;
        this.considerSplitAsPartiallyWin = considerSplitAsPartiallyWin;
        console.assert(myCardIndex2 != myCardIndex1, 'initial cards should not be the same');
        // TODO(zzn): add more validation
    }
    /**
     * Computes the equity of my cards given [emulationTimes] and [numberOfPlayers]
     * @returns {number}
     */
    Computer.prototype.computeEquity = function () {
        var winTimes = 0;
        for (var i = 0; i < this.emulationTimes; i++) {
            var pickedCardIndices = Computer.randomlyPickCards((this.numberOfPlayers - 1) * 2 + 5, [this.myCardIndex1, this.myCardIndex2]);
            var communityCardIndices = pickedCardIndices.slice((this.numberOfPlayers - 1) * 2); // last 5 cards as community cards;
            var myCards = [this.myCardIndex1, this.myCardIndex2].concat(communityCardIndices);
            var myHand = new Hand(myCards);
            var numOfSplit = 1; // number of split players
            for (var o = 0; o < this.numberOfPlayers - 1; o++) {
                var oCards = [pickedCardIndices[o * 2], pickedCardIndices[o * 2 + 1]].concat(communityCardIndices);
                var oHand = new Hand(oCards);
                var compareResult = myHand.compareWith(oHand);
                /// PURE DEBUG LOGIC, TODOD DELETE AFTER DEBUGGING DONE
                if (debugOn) {
                    var oCardIndex1 = pickedCardIndices[o * 2];
                    var oCardIndex2 = pickedCardIndices[o * 2 + 1];
                    var oCard1 = new Card(oCardIndex1);
                    var oCard2 = new Card(oCardIndex2);
                    var myCard1 = new Card(this.myCardIndex1);
                    var myCard2 = new Card(this.myCardIndex2);
                    var communityCards = communityCardIndices.map(function (i) { return new Card(i); });
                    console.log("XXX DEBUG: My Cards: " + (myCard1.getNumberWithColorStr() + ' ' + myCard2.getNumberWithColorStr()));
                    console.log("XXX DEBUG: O Cards: " + (oCard1.getNumberWithColorStr() + ' ' + oCard2.getNumberWithColorStr()));
                    console.log("XXX DEBUG: Community Cards: " + communityCards.map(function (c) { return c.getNumberWithColorStr(); }).join(' '));
                    console.log("XXX DEBUG: My Hand Type: " + HandType[myHand.getHandType()]);
                    console.log("XXX DEBUG: O Hand Type: " + HandType[oHand.getHandType()]);
                    console.log("XXX DEBUG: compare result = " + compareResult);
                }
                if (compareResult < 0) {
                    numOfSplit = 0;
                    break; // lost already
                }
                if (compareResult == 0) {
                    // for split case, add one splitting player
                    if (this.considerSplitAsPartiallyWin)
                        numOfSplit++;
                    else
                        numOfSplit = 0;
                }
            }
            if (numOfSplit > 0) {
                winTimes += 1 / numOfSplit;
            }
        }
        return winTimes / this.emulationTimes;
    };
    /**
     * Randomly picks a number of cards from a suit of poker, 52 cards, does not contain the jokers.
     * @param numberOfCardsToPick, for example, 5 means picking 5 cards from the suit of poker
     * @param alreadyPickedCards
     * @returns {null}
     */
    Computer.randomlyPickCards = function (numberOfCardsToPick, alreadyPickedCards) {
        var localAlreadyPickedCards = alreadyPickedCards.concat([]); // clone a new instance
        var picked = [];
        for (var i = 0; i < numberOfCardsToPick; i++) {
            var candidateCardIndex = null;
            do {
                candidateCardIndex = Math.floor(Math.random() * 52);
            } while (localAlreadyPickedCards.indexOf(candidateCardIndex) >= 0);
            localAlreadyPickedCards.push(candidateCardIndex);
            picked.push(candidateCardIndex);
        }
        return picked;
    };
    return Computer;
}());
var computeCsvSheet = function () {
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
            var card1 = new Card(cardIndex1);
            var card2 = new Card(cardIndex2);
            var computer = new Computer(cardIndex1, cardIndex2);
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
            var card1 = new Card(cardIndex1);
            var card2 = new Card(cardIndex2);
            var computer = new Computer(cardIndex1, cardIndex2);
            var equity = computer.computeEquity();
            offSuitedOdds[card1.getNumberStr() + card2.getNumberStr()] = equity;
            sheet[12 - n1][12 - n2] = equity;
        }
        console.log('XXX computed a line of off suited odds, row card number = ' + n1);
    }
    for (var i = 0; i < 13; i++) {
        var row = '';
        for (var j = 0; j < 13; j++) {
            row = row + sheet[i][j] + ',';
        }
        console.log(row);
    }
};
var computeSingle = function () {
    var computer = new Computer(51, 46);
    console.log('XXX Start computing equity of AKo in an headsup');
    console.log(computer.computeEquity());
};
var main = function () {
    computeSingle();
};
main();
