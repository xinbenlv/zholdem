import {Card, Color} from "./card";
import {DevTool} from "./dev_tool";

Object.prototype['sortAsIntegerArray'] = function() {
  // assumming this is an Array<number>
  return this.sort((a,b) => a-b);
};

export enum HandType {
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


export class Hand {
  /**
   * Indices of the 7 cards that I have.
   */
  public myCards:Card[];

  /**
   *   card indices for detail comparison
   */
  resultNumbers:number[];
  private handType:HandType;

  constructor(myCardIndices:number[]) {
    if (DevTool.flags.debugOn) {
      DevTool.assert(myCardIndices.length >= 5,
          `There should be at least 5 cards, but only is ${myCardIndices.length}.`);
      let s = {};
      let duplicated = false;
      let dupIndex = null;
      myCardIndices.forEach((i) => {
        if (s[i]) {
          duplicated = true;
          dupIndex = i;
        } else s[i] = true;
      });
      DevTool.assert(!duplicated, `There are duplicated indices. Duplicated Index = ${dupIndex}.`);
    }

    this.myCards = [];
    this.myCards = myCardIndices.map(cI => new Card(cI));
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
          .map((keyStr) => parseInt(keyStr))['sortAsIntegerArray']();
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
          ['sortAsIntegerArray']().reverse()[0];
      this.resultNumbers = [cardOfFourIndex, kicker];
    }
    return result;
  }

  private isFullHouse():boolean {
    let numberSet = {};
    for (let myCard of this.myCards) {
      if (numberSet[myCard.getNumber()] === undefined) numberSet[myCard.getNumber()] = 1;
      else numberSet[myCard.getNumber()] = numberSet[myCard.getNumber()] + 1;
    }

    // TODO(zzn): The following logic might be shared by FullHouse and TwoPairs, pick and pick

    // First pick a largest house
    let currentLargestHouseNumber:number = null;
    Object.keys(numberSet).forEach((keyStr) =>{
      if (numberSet[keyStr] >= 3) {
        let key = parseInt(keyStr);
        if (currentLargestHouseNumber == null || currentLargestHouseNumber <= key)
          currentLargestHouseNumber = key;
      }
    });

    // Then pick a largest pair
    let currentLargestPairNumber:number = null;
    Object.keys(numberSet).forEach((keyStr) =>{
      if (parseInt(keyStr) != currentLargestHouseNumber && numberSet[keyStr] >= 2) {
        let key = parseInt(keyStr);
        if (
            currentLargestPairNumber == null || currentLargestPairNumber <= key)
          currentLargestPairNumber = key;
      }
    });
    if (currentLargestPairNumber != null && currentLargestHouseNumber != null) {
      this.resultNumbers = [currentLargestHouseNumber, currentLargestPairNumber];
      return true;
    }
    return false;
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

  isStraight():boolean {
    let numberSet = {};
    let highCardIndex:number = null;
    let result = false;
    this.myCards.forEach(function (myCard:Card) {
      if (numberSet[myCard.getNumber()] === undefined) numberSet[myCard.getNumber()] = 1;
      else numberSet[myCard.getNumber()] = numberSet[myCard.getNumber()] + 1;
    });
    let numbers:number[] = Object.keys(numberSet).map((keyStr) => parseInt(keyStr))['sortAsIntegerArray']();
    if (numbers.indexOf(12) > 0) {
      numbers = [-1].concat(numbers);
    }
    let countConsecutive = 1;
    for (let i = 1; i < numbers.length; i++) {
      if (numbers[i] - numbers[i - 1] == 1) {
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
        if (currentTopCardNumber == null) currentTopCardNumber = parseInt(key);
        else {
          currentTopCardNumber = currentTopCardNumber > parseInt(key) ?
              currentTopCardNumber : parseInt(key);
        }
      }
    }
    if (result) {
      let otherNumbers = this.myCards.map((card:Card) => card.getNumber())
          .filter(number => number != currentTopCardNumber)
          ['sortAsIntegerArray']()
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
          ['sortAsIntegerArray']()
          .reverse()
          .slice(0, 2);
      let restNumber = Object.keys(numberSet).map(keyStr => parseInt(keyStr))
          .filter(key => pairNumbers.indexOf(key) < 0) // not selected in pairIndex
          ['sortAsIntegerArray']()
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
        let pairNumber:number = myCard.getNumber();
        let otherNumbers:number[] = this.myCards
            .map((card:Card) => card.getNumber())
            .filter((n:number) => n != pairNumber)
            ['sortAsIntegerArray']()
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
        ['sortAsIntegerArray']()
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
