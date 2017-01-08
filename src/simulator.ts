import {Card} from "./card";
import {DevTool} from "./dev_tool";
import {Hand, HandType} from "./hand";
export class SimulationParameter {
  public numOfPlayers:number;
  public knownPlayerCardIndices:number[][];
  public knownCommunityCardIndices:number[];
  public simulationTimes:number;
}

export class SimulationResult {
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


  public winTimesByPlayers:number[];

  /** for example, if in one time two players split the pot, the split times for each will be 0.5
  */
  public splitTimesByPlayers:number[];
  public totalEquityByPlayers:number[];
  public totalEquityStdByPlayers:number[];
  public splitEquitiesByPlaysers:number[];
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

  public static simulate(param:SimulationParameter):SimulationResult {
    let numOfPlayers = param.numOfPlayers;
    let splitEquitiesByPlaysers:number[] = DevTool.createZeroArray(numOfPlayers);
    let allPickedCardIndices = [];
    let winTimesByPlayers:number[] = DevTool.createZeroArray(numOfPlayers);
    let splitTimesByPlayers:number[] = DevTool.createZeroArray(numOfPlayers);
    let totalEquityStdByPlayers:number[] = new Array(numOfPlayers);
    let totalEquityByPlayers:number[] = new Array(numOfPlayers);
    param.knownPlayerCardIndices
        .forEach((cardIndicesList) => {
      allPickedCardIndices = allPickedCardIndices.concat(cardIndicesList);
    });
    allPickedCardIndices = allPickedCardIndices.concat(param.knownCommunityCardIndices);
    for (let s = 0 ; s < param.simulationTimes; s++) {
      let randomlyPickedCardIndices = Simulator.randomlyPickCards(
          numOfPlayers * 2 + 5 - allPickedCardIndices.length,
          allPickedCardIndices);

      // fill in all unfulfilled player's cards
      let cursorOfRandomPick = 0;
      let simulatedPlayerCardIndices:number[] = [];
      for (let p = 0; p < numOfPlayers; p++) {
        if (p < param.knownPlayerCardIndices.length) {
          if (param.knownPlayerCardIndices[p].length == 2) {
            simulatedPlayerCardIndices = simulatedPlayerCardIndices.concat(param.knownPlayerCardIndices[p]);
          } else {
            let fullFileNumOfCards = 2 - param.knownPlayerCardIndices[p].length;
            simulatedPlayerCardIndices = simulatedPlayerCardIndices.concat(
                randomlyPickedCardIndices
                    .slice(cursorOfRandomPick, cursorOfRandomPick + fullFileNumOfCards));
            cursorOfRandomPick += fullFileNumOfCards;
          }
        } else {
          simulatedPlayerCardIndices = simulatedPlayerCardIndices.concat(
              randomlyPickedCardIndices
                  .slice(cursorOfRandomPick, cursorOfRandomPick + 2));
          cursorOfRandomPick += 2;
        }
      }
      // last 5 cards as community cards;
      let communityCardIndices =
          param.knownCommunityCardIndices.concat(randomlyPickedCardIndices.slice(cursorOfRandomPick));

      let currentWinners = [];
      let hands:Hand[] = [];

      for (let p = 0; p < numOfPlayers; p++) {
        hands.push(new Hand([
            simulatedPlayerCardIndices[p * 2],
            simulatedPlayerCardIndices[p * 2 + 1]
        ].concat(communityCardIndices)));
      }
      let p1 = 0;
      let p2 = 1;
      do {
        let p1CompareWithP2:number = hands[p1].compareWith(hands[p2]);
        if (p1CompareWithP2 > 0) {
          currentWinners = [p1];
          p2++;
        } else if (p1CompareWithP2 == 0) {
          if (currentWinners.indexOf(p1) < 0) currentWinners = currentWinners.concat([p1]);
          if (currentWinners.indexOf(p2) < 0) currentWinners = currentWinners.concat([p2]);
          p2++;
        } else { // p1CompareWithP2 < 0
          currentWinners = [p2];
          p1++;
        }
      } while(p1 < numOfPlayers && p2 < numOfPlayers);
      for (let p = 0; p < numOfPlayers; p++) {
        if (currentWinners.indexOf(p) >= 0) { // winners include me
          if (currentWinners.length > 1) { // me split with others
              splitTimesByPlayers[p] += 1;
              splitEquitiesByPlaysers[p] += 1/ currentWinners.length;
          }
          else winTimesByPlayers[p] += 1; // me win alone
        }
      }
    }

    let result = new SimulationResult();
    result.winTimesByPlayers = winTimesByPlayers;
    result.splitTimesByPlayers = splitTimesByPlayers;

    let tmp = 0;
    for (let p = 0; p < numOfPlayers; p++) {
      let e/*equity*/ = (winTimesByPlayers[p] + splitEquitiesByPlaysers[p]) / param.simulationTimes;
      totalEquityByPlayers[p] = e;
      let part1 = Math.pow(1 - e, 2) * winTimesByPlayers[p];
      let part2 = Math.pow((e - splitEquitiesByPlaysers[p]),2 ) * splitTimesByPlayers[p];
      let part3 = Math.pow(e, 2) * (param.simulationTimes - winTimesByPlayers[p] - splitTimesByPlayers[p]);
      let denominator = param.simulationTimes * (param.simulationTimes - 1);
      totalEquityStdByPlayers[p] = Math.sqrt((part1 + part2 + part3) / denominator);
    }
    result.totalEquityByPlayers = totalEquityByPlayers;
    result.totalEquityStdByPlayers = totalEquityStdByPlayers;
    result.splitTimesByPlayers = splitTimesByPlayers;
    result.splitEquitiesByPlaysers = splitEquitiesByPlaysers;
    return result;
  }
  /**
   * Computes the equity of my cards given [emulationTimes] and [numberOfPlayers]
   * @returns {number}
   *
   * TODO(zzn): extract parameters to a separate functions for more players,
   *            more known cards and more range
   */
  computeEquity():SimulationResult {
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
    let result = new SimulationResult();
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
