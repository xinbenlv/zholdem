import {DevTool} from "./dev_tool";
import {Hand} from "./hand";
export class SimulationParameter {
  public numOfPlayers:number;
  public knownPlayerCardIndices:number[][];
  public knownCommunityCardIndices:number[];
  public simulationTimes:number;
}

export class SimulationResult {
  public winTimesByPlayers:number[];
  public splitTimesByPlayers:number[];
  public splitPartialTimesByPlayers:number[];
  public totalEquityByPlayers:number[];
  public totalEquityStdByPlayers:number[];
}

export class Simulator {
  public static simulate(param:SimulationParameter):SimulationResult {
    let numOfPlayers = param.numOfPlayers;
    let splitPartialTimesByPlaysers:number[] = DevTool.createZeroArray(numOfPlayers);
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
        let nextP =Math.max(p1,p2) + 1;
        let whetherP12eatP2:number = hands[p1].compareWith(hands[p2]);
        if (whetherP12eatP2 > 0) {
          if (currentWinners.indexOf(p1) < 0) { // p1 is not the winner
            currentWinners = [p1];
          } // otherwise, if p1 is already in the current winner, we ignore
          p2 = nextP;
        } else if (whetherP12eatP2 == 0) {
          if (currentWinners.indexOf(p1) < 0) currentWinners = currentWinners.concat([p1]);
          if (currentWinners.indexOf(p2) < 0) currentWinners = currentWinners.concat([p2]);
          p2 = nextP;
        } else { // whetherP12eatP2 < 0
          if (currentWinners.indexOf(p2) < 0) { // p2 is not the winner
            currentWinners = [p2];
          } // otherwise, if p1 is already in the current winner, we ignore
          p1 = nextP;
        }
      } while(p1 < numOfPlayers && p2 < numOfPlayers);
      for (let p = 0; p < numOfPlayers; p++) {
        if (currentWinners.indexOf(p) >= 0) { // winners include me
          if (currentWinners.length > 1) { // me split with others
            splitTimesByPlayers[p] += 1;
            splitPartialTimesByPlaysers[p] += (1.0/currentWinners.length);
          }
          else winTimesByPlayers[p] += 1; // me win alone
        }
      }
    }

    let result = new SimulationResult();
    result.winTimesByPlayers = winTimesByPlayers;
    result.splitTimesByPlayers = splitTimesByPlayers;
    for (let p = 0; p < numOfPlayers; p++) {
      let e/*equity*/ = (winTimesByPlayers[p] + splitPartialTimesByPlaysers[p]) / param.simulationTimes;
      totalEquityByPlayers[p] = e;
      let part1 = Math.pow(1 - e, 2) * winTimesByPlayers[p];
      let part2 = Math.pow((e - splitPartialTimesByPlaysers[p]),2 ) * splitTimesByPlayers[p];
      let part3 = Math.pow(e, 2) * (param.simulationTimes - winTimesByPlayers[p] - splitTimesByPlayers[p]);
      let denominator = param.simulationTimes * (param.simulationTimes - 1);
      totalEquityStdByPlayers[p] = Math.sqrt((part1 + part2 + part3) / denominator);
    }
    result.totalEquityByPlayers = totalEquityByPlayers;
    result.totalEquityStdByPlayers = totalEquityStdByPlayers;
    result.splitTimesByPlayers = splitTimesByPlayers;
    result.splitPartialTimesByPlayers = splitPartialTimesByPlaysers;
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
