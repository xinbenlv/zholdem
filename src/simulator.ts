import {Card} from "./card";
import {DevTool} from "./dev_tool";
import {Hand, HandType} from "./hand";

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

export class Simulator {
  constructor(
      private myCardIndex1,
      private myCardIndex2,
      private emulationTimes = 10000,
      private numberOfPlayers = 2) {
    DevTool.assert(myCardIndex2 != myCardIndex1, 'Initial cards should not be the same.');
    DevTool.assert(numberOfPlayers <= 10 && numberOfPlayers >= 2, 'There should be 2 - 9 players');
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
      let pickedCardIndices = Simulator.randomlyPickCards(
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
        if (DevTool.flags.debugOn) {
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
