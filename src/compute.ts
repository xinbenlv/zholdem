
export let flags = {
  debugOn : false
};

export let assert = function(assertionBoolean, reason?:string) {
  if (!assertionBoolean) {
    throw new Error(reason === undefined ? 'Assertion failed.': reason);
  }
};

Object.prototype['sortAsIntegerArray'] = function() {
  // assumming this is an Array<number>
  return this.sort((a,b) => a-b);
};
export class EquitySimulationResult {

  /**
   * An array of all ratio of split in the size of number of players
   *
   * Index = NumberOfPlayersSplit the number of player the HERO split with, 0 means HERO lost
   */
  public splitRates:number[];

  /**
   * An array of all number of times of split in the size of number of players
   *
   * Index = NumberOfPlayersSplit, 0 means HERO lost
   */
  public splitTimes:number[];

  /**
   * a double between 0 and 1 describing the probability the hand splitting the pot with other player
   * assuming 10% of time the player will split a pot with another player,
   * the {splitEquity} = 0.05 = 10% / 2
   *
   * Index = NumberOfPlayersSplit, 0 means HERO lost
   */
  public splitEquities:number[];

  /**
   * splitInMRate = splitRates[M -1];
   * totalEquity = splitIn1Rate / 1 + splitIn2Rate / 2 + ... splitIn9Rate / 9
   */
  public totalEquity:number;

  /**
   * (
   *    (splitIn2Rate / 1 - totalEquity)^2 * splitIn1Rate * N +
   *    (splitIn2Rate / 2 - totalEquity)^2 * splitIn2Rate * N +
   *    (splitIn2Rate / 3 - totalEquity)^2 * splitIn3Rate * N +
   *    ...
   *    (splitIn2Rate / 9 - totalEquity)^2 * splitIn9Rate * N +
   *
   *    (totalEquity - 0)^2 * (1 - Sum(all split rate)) * N +
   * ) ^ 0.5 / (n-1)^0.5
   */
  public totalEquityStD:number;
}
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

export enum Color {
  Spade = 0,
  Club = 1,
  Heart = 2,
  Diamond = 3,
}

export class Card {
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
   * where the index of Card 2s is 0
   * the index of Card A is 12, in straight check Card A also has an index of -1
   * */
  getNumber(): number {
    return Math.floor(this.index / 4);
  } //

  getNumberStr(): string {
    let n = this.getNumber();
    assert(n>=0 && n<=12, `n is incorrect, n = ${n}`);
    if (n < 8) return (n + 2).toString();
    else {
      switch(n) {
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
  }

  getColorStrShort(): string {
    let c = this.getColor();
    switch(c) {
      case Color.Spade:
        return 's';
      case Color.Club:
        return 'c';
      case Color.Heart:
        return 'h';
      case Color.Diamond:
        return 'd';
    }
  }

  getNumberWithColorStr(): string {
    let str = this.getNumberStr() + this.getColorStrShort();
    if (flags.debugOn) str += `(${this.index})`;
    return str;
  }

  toString(): string {
    return this.getNumberWithColorStr();
  }

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
    if (flags.debugOn) {
      assert(myCardIndices.length >= 5,
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
      assert(!duplicated, `There are duplicated indices. Duplicated Index = ${dupIndex}.`);
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
    let houseIndex = null;
    let pairIndex = null;
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

export class Computer {
  constructor(
      private myCardIndex1,
      private myCardIndex2,
      private emulationTimes = 10000,
      private numberOfPlayers = 2) {
    assert(myCardIndex2 != myCardIndex1, 'Initial cards should not be the same.');
    assert(numberOfPlayers <= 10 && numberOfPlayers >= 2, 'There should be 2 - 9 players');
  }

  /**
   * Computes the equity of my cards given [emulationTimes] and [numberOfPlayers]
   * @returns {number}
   *
   * TODO(zzn): extract parameters to a separate functions for more players,
   *            more known cards and more range
   */
  computeEquity():EquitySimulationResult {
    let splitTimes:number[] = new Array(this.numberOfPlayers + 1);
    for (let i = 0; i <= this.numberOfPlayers; i++) splitTimes[i] = 0;
    let splitRates:number[] = new Array(this.numberOfPlayers + 1);
    let splitEquities = new Array<number>(this.numberOfPlayers + 1);
    for (let i = 0 ; i < this.emulationTimes; i++) {
      let pickedCardIndices = Computer.randomlyPickCards(
          (this.numberOfPlayers - 1) * 2 + 5,
          [this.myCardIndex1, this.myCardIndex2]);

      // last 5 cards as community cards;
      let communityCardIndices = pickedCardIndices.slice((this.numberOfPlayers - 1) *2);

      let myCards = [this.myCardIndex1, this.myCardIndex2].concat(communityCardIndices);
      let myHand = new Hand(myCards);
      let numOfSplit = 1; // number of split players
      for (let o = 0; o < this.numberOfPlayers - 1; o++) {
        let oCards = [pickedCardIndices[o * 2], pickedCardIndices[o * 2 + 1]].concat(communityCardIndices);
        let oHand = new Hand(oCards);
        let compareResult = myHand.compareWith(oHand);

        // PURE DEBUG LOGIC,
        // TODO(zzn) DELETE AFTER DEBUGGING DONE
        if (flags.debugOn) {
          let oCardIndex1 = pickedCardIndices[o * 2];
          let oCardIndex2 = pickedCardIndices[o * 2 + 1];
          let oCard1 = new Card(oCardIndex1);
          let oCard2 = new Card(oCardIndex2);
          let myCard1 = new Card(this.myCardIndex1);
          let myCard2 = new Card(this.myCardIndex2);
          let communityCards:Card[] = communityCardIndices.map(i => new Card(i));
          if (compareResult < 1) {
            console.log(`XXX DEBUG: Simulation #${i}`);
            console.log(`XXX DEBUG: My Cards: ${myCard1.getNumberWithColorStr() + ' ' + myCard2.getNumberWithColorStr()}`);
            console.log(`XXX DEBUG: O Cards: ${oCard1.getNumberWithColorStr() + ' ' + oCard2.getNumberWithColorStr()}`);
            console.log(`XXX DEBUG: Community Cards: ${communityCards.map(c => c.getNumberWithColorStr()).join(' ')}`);
            console.log(`XXX DEBUG: My Hand Type: ${HandType[myHand.getHandType()]}`);
            console.log(`XXX DEBUG: O Hand Type: ${HandType[oHand.getHandType()]}`);
            console.log(`XXX DEBUG: compare result = ${compareResult}`);
            console.log('');
          }
        }

        if (compareResult < 0) {
          numOfSplit = 0; // reset to 0 because HERO lost
          break; // lost already, stop continue computing
        } if (compareResult == 0) {
          // for split case, add one splitting player
          numOfSplit ++;
        }
        // We don't count win because you will have to win everyone to get the pool
      }
      splitTimes[numOfSplit] ++;
    }
    let result = new EquitySimulationResult();
    for (let i = 0; i <= this.numberOfPlayers /*yes it is LTE(<=) */ ; i++) {
      splitRates[i] = splitTimes[i] / this.emulationTimes;
      if (i > 0) splitEquities[i] = splitRates[i] / i;
    }
    result.splitRates = splitRates;
    result.splitTimes = splitTimes;
    result.splitEquities = splitEquities;
    result.totalEquity = splitEquities.reduce((a, b) => a + b);
    let tmp = 0;
    for (let i = 0; i <= this.numberOfPlayers /*yes it LTE(<=)*/ ; i++) {
      if (i == 0) tmp = tmp + result.totalEquity^2 + splitTimes[i];
      else tmp = tmp + (splitRates[i] - result.totalEquity)^2 * splitTimes[i];
    }
    result.totalEquityStD = Math.sqrt(tmp / (this.emulationTimes * (this.emulationTimes - 1)));
    return result;
  }

  /**
   * Randomly picks a number of cards from a suit of poker, 52 cards, does not contain the jokers.
   * @param numberOfCardsToPick, for example, 5 means picking 5 cards from the suit of poker
   * @param alreadyPickedCards
   * @returns {null}
   * TODO(zzn): test randomness
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
