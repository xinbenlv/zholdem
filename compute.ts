console.log('XXX hello world!');
enum HandType {
  FlushStraight = 9,
  FourOfAKind = 8,
  FullHouse = 7,
  Flush = 6,
  Straight = 5,
  ThreeOfAKind = 4,
  TwoPairs = 3,
  OnePair = 2,
  HighCard = 1,
}

enum Color {
  Spade = 0,
  Club = 1,
  Heart = 2,
  Diamond = 3,
}

class Card {
  /**
   * The index of card, from 0 - 51, whereas 0 - 3 means 2 of four color,
   * 48 - 51 means A of four colors
   */
  private index:number;

  constructor(index){
    this.index = index;
  };

  /**
   * Return the number of a card based on index
   * Card a 2 - 14 number representing 2, 3, ... T, J, Q, A,
   * where the index of Card 2 is 0
   * the index of Card A is 12, in straight check Card A also has an index of -1
   * */
  getNumber(): number {
    return Math.floor(this.index / 4);
  } //

  getColor(): Color {
    switch(this.index % 4) {
      case 0:
        return Color.Spade;
      case 1:
        return Color.Club;
      case 2:
        return Color.Heart;
      case 3:
        return Color.Diamond
    }
  }
}

class Hand {
  /**
   * Indices of the 7 cards that I have.
   */
  myCards:Card[];

  /**
   *   card indices for detail comparison
   */
  resultNumbers:number[];
  private handType:HandType;

  constructor(myCards:number[]) {
    // TODO assert no duplicates
    let cardIndices = myCards.sort();
    this.myCards = [];
    for (let n of cardIndices) {
      let c:Card = new Card(n);
      this.myCards.push(c);
    }
    this.handType = this.analyse();
  }

  /**
   * Set cached fields after analyse
   * It will {resultNumbers}
   * @returns {HandType}
   */
  private analyse() {
    if (this.isFlushStraight()) return HandType.FlushStraight;
    else if (this.isFourOfAKind()) return HandType.FourOfAKind;
    else if (this.isFullHouse()) return HandType.FullHouse;
    else if (this.isFlush()) return HandType.Flush;
    else if (this.isStraight()) return HandType.Straight;
    else if (this.isThreeOfAKind()) return HandType.ThreeOfAKind;
    else if (this.isTwoPair()) return HandType.TwoPairs;
    else if (this.isOnePair()) return HandType.OnePair;
    else if (this.isHighCard()) return HandType.HighCard;
  }

  getHandType():HandType {
    return this.handType;
  }

  // FlushStraight = 9,
  // FourOfAKind = 8,
  // FullHouse = 7,
  // Flush = 6,
  // Straight = 5,
  // ThreeOfAKind = 4,
  // TwoPairs = 3,
  // OnePair = 2,
  // HighCard = 1,

  private isFlushStraight() {
    let colorSet = { };
    let flushColor:Color = null;
    let result = false;
    this.myCards.forEach(function (myCard:Card) {
      if (colorSet[myCard.getColor()] === undefined) colorSet[myCard.getColor()] = 1;
      else colorSet[myCard.getColor()] = colorSet[myCard.getColor()] + 1;
      if (colorSet[myCard.getColor()] >= 5) {
        flushColor = myCard.getColor();
      }
    });
    if (flushColor != null) {
      let numberSet = {};
      this.myCards.forEach(function (myCard:Card) {
        if (myCard.getColor() === flushColor) {
          if (numberSet[myCard.getNumber()] === undefined) numberSet[myCard.getNumber()] = 1;
          else numberSet[myCard.getNumber()] = numberSet[myCard.getNumber()] + 1;
        }
      });
      let numbers:number[] = Object.keys(numberSet)
          .map((keyStr) => parseInt(keyStr)).sort();
      if (numbers.indexOf(12) > 0) {
        numbers = [-1].concat(numbers);
      }
      let countConsecutive = 1;
      for (let i = 1; i < numbers.length; i++) {
        if (numbers[i] - numbers[i - 1] == 1) {
          countConsecutive ++;
        } else countConsecutive = 1;
        if (countConsecutive >= 5) {
          result = true;
          this.resultNumbers = [numbers[i]]; // only store the highest card index in a flushstraight
        }
      }
    }
    return result;
  }

  private isFourOfAKind():boolean {
    let numberSet = {};
    let result = false;
    let cardOfFourIndex:number = null;
    for (let myCard of this.myCards) {
      if (numberSet[myCard.getNumber()] === undefined) numberSet[myCard.getNumber()] = 1;
      else numberSet[myCard.getNumber()] = numberSet[myCard.getNumber()] + 1;
      if (numberSet[myCard.getNumber()] >= 4) {
        result = true;
        cardOfFourIndex = myCard.getNumber();
      }
    }
    if (result) {
      let kicker = Object.keys(numberSet)
          .map(keyStr => parseInt(keyStr))
          .filter(index => index!=cardOfFourIndex)
          .sort().reverse()[0];
      this.resultNumbers = [cardOfFourIndex, kicker];
    }
    return result;
  }

  private isFullHouse():boolean {
    let numberSet = {};
    let houseIndex = null;
    let pairIndex = null;
    for (let myCard of this.myCards) {
      if (numberSet[myCard.getNumber()] === undefined) numberSet[myCard.getNumber()] = 1;
      else numberSet[myCard.getNumber()] = numberSet[myCard.getNumber()] + 1;
    }
    let hasPair:boolean = false;
    let hasThreeOfAKind:boolean = false;
    for (let key in numberSet) {
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
  }
  
  private isFlush(): boolean {
    let colorSet = {};
    let flushColor:Color = null;
    let isFlush = false;
    for(let myCard of this.myCards) {
      if (colorSet[myCard.getColor()] === undefined) colorSet[myCard.getColor()] = 1;
      else colorSet[myCard.getColor()] = colorSet[myCard.getColor()] + 1;
      if (colorSet[myCard.getColor()] >= 5) {
        isFlush = true;
        flushColor = myCard.getColor();
      }
    }
    if(isFlush) {
      this.resultNumbers = this.myCards
          .filter((card:Card) => card.getColor() == flushColor)
          .map(card => card.getNumber())
          .reverse()
          .slice(0, 5);
    }
    return isFlush;
  }

  // TODO test-cases
  //   AKQJT98, top card A
  //   A2345 89, top card 5
  //   A 34567 9, top card 7
  //   345678 JQ, top card 8
  isStraight():boolean {
    let numberSet = {};
    let highCardIndex:number = null;
    let result = false;
    this.myCards.forEach(function (myCard:Card) {
      if (numberSet[myCard.getNumber()] === undefined) numberSet[myCard.getNumber()] = 1;
      else numberSet[myCard.getNumber()] = numberSet[myCard.getNumber()] + 1;
    });
    let numbers:number[] = Object.keys(numberSet).map((keyStr) => parseInt(keyStr)).sort();
    if (numbers.indexOf(12) > 0) {
      numbers = [-1].concat(numbers);
    }
    let countConsecutive = 1;
    for (let i = 1; i < numbers.length; i++) {
      if (numbers[i] - numbers[i - 1] == 1) { // TODO(zzn): also handle AKQJT and A2345 cases
        countConsecutive ++;

      } else countConsecutive = 1;
      if (countConsecutive >= 5) {
        highCardIndex = numbers[i];
        result = true;
      }
    }
    if (result) this.resultNumbers = [highCardIndex];
    return result;
  }

  // TODO test casse:
  //   AAAKKKQQ, resultNumbers should be AK
  private isThreeOfAKind(): boolean {
    let numberSet = {};
    let currentTopCardNumber:number = null;
    let result = false;
    for (let myCard of this.myCards) {
      if (numberSet[myCard.getNumber()] === undefined) numberSet[myCard.getNumber()] = 1;
      else numberSet[myCard.getNumber()] = numberSet[myCard.getNumber()] + 1;
    }
    for (let key in numberSet) {
      if (numberSet[key] >= 3) {
        result = true;
        if (currentTopCardNumber == null) currentTopCardNumber = numberSet[key];
        else {
          currentTopCardNumber = currentTopCardNumber > numberSet[key] ?
              currentTopCardNumber : numberSet[key];
        }
      }
    }
    if (result) {
      let otherNumbers = this.myCards.map((card:Card) => card.getNumber())
          .filter(number => number != currentTopCardNumber)
          .sort()
          .reverse()
          .slice(0, 2);
      this.resultNumbers = [currentTopCardNumber].concat(otherNumbers);
    }
    return result;
  }

  private isTwoPair(): boolean {
    let numberSet = {};
    for (let myCard of this.myCards) {
      if (numberSet[myCard.getNumber()] === undefined) numberSet[myCard.getNumber()] = 1;
      else numberSet[myCard.getNumber()] = numberSet[myCard.getNumber()] + 1;
    }
    let numPairs = 0;
    for (let key in numberSet) {
      if (numberSet[key] >= 2) {numPairs++}
    }
    if (numPairs >= 2) {
      let pairNumbers = Object.keys(numberSet)
          .filter((key) => numberSet[key] >= 2)
          .map((keyStr) => parseInt(keyStr))
          .sort()
          .reverse()
          .slice(0, 2);
      let restNumber = Object.keys(numberSet).map(keyStr => parseInt(keyStr))
          .filter(key => pairNumbers.indexOf(key) < 0) // not selected in pairIndex
          .sort()
          .reverse()[0];
      this.resultNumbers = pairNumbers.concat([restNumber]);
      return true;
    }
    return false;
  }

  private isOnePair(): boolean {
    let numberSet = {};
    for (let myCard of this.myCards) {
      if (numberSet[myCard.getNumber()] === undefined) numberSet[myCard.getNumber()] = 1;
      else numberSet[myCard.getNumber()] = numberSet[myCard.getNumber()] + 1;
      if (numberSet[myCard.getNumber()] >= 2) {
        let pairNumber = myCard.getNumber();
        let otherNumbers = this.myCards
            .map((card:Card) => card.getNumber())
            .filter(number => number != pairNumber)
            .sort()
            .reverse().slice(0,3);
        this.resultNumbers = [pairNumber].concat(otherNumbers);
        return true;
      }
    }
    return false;
  }

  /**
   * @returns {boolean} Alwayse return true
   */
  private isHighCard(): boolean {
    this.resultNumbers = this.myCards.map((card:Card) => card.getNumber())
        .sort()
        .reverse().slice(0,5);
    return true;
  }

  /**
   *
   * @param opponent
   * @returns 1 if win, 0 if split, -1 if lost
   */
  compareWith(opponent:Hand): number {
    let myHandType = this.getHandType();
    let oHandType = opponent.getHandType();
    if (myHandType > oHandType) {
      return 1;
    } else if (myHandType < oHandType){
      return -1;
    } else if (myHandType == oHandType) {
      console.assert(this.resultNumbers.length == opponent.resultNumbers.length);
      for (let i = 0; i < this.resultNumbers.length; i++) {
        if (this.resultNumbers[i] > opponent.resultNumbers[i]) return 1;
        else if (this.resultNumbers[i] < opponent.resultNumbers[i]) return -1;
      }
      return 0; // complete equal
    }
  }
}

class Computer {
  constructor(
      private cardIndex1,
      private cardIndex2,
      private emulationTimes = 100000,
      private numberOfPlayers = 2,
      private considerSplitAsPartiallyWin = true) {
    console.assert(cardIndex2 != cardIndex1, 'initial cards should not be the same');
    // TODO(zzn): add more validation
  }

  /**
   * Computes the equity of my cards given [emulationTimes] and [numberOfPlayers]
   * @returns {number}
   */
  computeEquity():number {
    let winTimes = 0;
    for (let i = 0 ; i < this.emulationTimes; i++) {
      let pickedCards = Computer.randomlyPickCards(
          (this.numberOfPlayers - 1) * 2 + 5,
          [this.cardIndex1, this.cardIndex2]);
      let communityCards = pickedCards.slice((this.numberOfPlayers - 1) *2); // last 5 cards as community cards;
      let myCards = [this.cardIndex1, this.cardIndex2].concat(communityCards);
      let myHand = new Hand(myCards);
      let numOfSplit = 1; // number of split players
      for (let o = 0; o < this.numberOfPlayers - 1; o++) {
        let oCards = [pickedCards[o * 2], pickedCards[o * 2 + 1]].concat(communityCards);
        let oHand = new Hand(oCards);
        let compareResult = myHand.compareWith(oHand);
        if (compareResult < 0) {
          numOfSplit = 0;
          break; // lost already
        } if (compareResult == 0) {
          // for split case, add one splitting player
          if (this.considerSplitAsPartiallyWin)numOfSplit ++;
          else numOfSplit = 0;
        }
      }
      if (numOfSplit > 0) {
        winTimes += 1 / numOfSplit;
      }
    }
    return winTimes / this.emulationTimes;
  }

  /**
   * Randomly picks a number of cards from a suit of poker, 52 cards, does not contain the jokers.
   * @param numberOfCardsToPick, for example, 5 means picking 5 cards from the suit of poker
   * @param alreadyPickedCards
   * @returns {null}
   */
  private static randomlyPickCards(numberOfCardsToPick:number, alreadyPickedCards:number[]):number[] {
    let localAlreadyPickedCards:number[] = alreadyPickedCards.concat([]); // clone a new instance
    let picked = [];
    for (let i = 0; i < numberOfCardsToPick; i++) {
      let candidateCardIndex = null;
      do {
        candidateCardIndex = Math.floor(Math.random() * 52);
      } while (localAlreadyPickedCards.indexOf(candidateCardIndex) >= 0);
      localAlreadyPickedCards.push(candidateCardIndex);
      picked.push(candidateCardIndex);
    }
    return picked;
  }
}
console.log('XXX creating computer!');
let computer = new Computer(0,5);
console.log('XXX start computing!');
console.log(computer.computeEquity());
console.log('XXX computation completes');
