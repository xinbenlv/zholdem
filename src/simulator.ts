import {DevTool} from "./dev_tool";
import {Hand} from "./hand";
export class SimulationParameter {
  public numOfPlayers:number;
  public knownPlayerCardIndices:number[][];
  public knownCommunityCardIndices:number[];
  public simulationTimes:number;
}

export class SimulationResult {

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

    // TODO(zzn): add exact computation (instead of random)
    // to see if it's picking a small number of cards.
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
