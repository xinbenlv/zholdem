
import {Simulator, SimulationResult, SimulationParameter} from "./simulator";
import {Cards} from "./card";
import {Hand, HandType} from "./hand";
import {Street} from "./street";
let filesystem = require('fs');
const jsonfile = require('jsonfile');

class PercentageEntry {
  public simulationResult:SimulationResult;
  public positionInSheetI:number;
  public positionInSheetJ:number;
  public numberOfEquivalentHands:number;
  public handsBeat:number;
}

let generateCsvSheet = function(numberOfPlayer:number = 9,
                                simTimes:number = 10000,
                                file:string):void {
  let debugOutput = false;
  /**
   * a 13x13 rows [rol][col] as shown in http://i35.tinypic.com/anmufp.jpg, topleft is AA
   * bottom right is 22.
   * First index is the row, and second index is the column
   * @type {Array}
   */
  let sheet:SimulationResult[][] = [];
  let percentageSheet:PercentageEntry[][] = [];
  for (let i = 0; i < 13; i++) {
    let row = new Array<SimulationResult>(13);
    sheet.push(row);
    percentageSheet.push(new Array<PercentageEntry>(13));
  }

  // Suited
  for (let n1 = 12; n1 >= 0; n1--) {
    for (let n2=n1-1; n2 >= 0; n2 --) {
      let cardIndex1 = n1 * 4;
      let cardIndex2 = n2 * 4;
      let param:SimulationParameter = new SimulationParameter();
      param.maxSimulationTimes = simTimes;
      param.knownPlayerCardIndices = [
        [cardIndex1, cardIndex2],
      ];
      param.knownCommunityCardIndices = [];
      param.numOfPlayers = numberOfPlayer;
      let result:SimulationResult = Simulator.simulate(param);
      sheet[12 - n1][12 - n2] = result;
    }
    if (debugOutput) console.log('XXX computed a line of suited odds, row card number = ' + n1);
  }

  // Off suited
  for (let n1 = 12; n1>= 0; n1--) {
    for (let n2 = 12; n2 >= n1; n2 --) {
      let cardIndex1 = n1 * 4 + 1;
      let cardIndex2 = n2 * 4;
      let param:SimulationParameter = new SimulationParameter();
      param.maxSimulationTimes = simTimes;
      param.knownPlayerCardIndices = [
        [cardIndex1, cardIndex2],
      ];
      param.knownCommunityCardIndices = [];
      param.numOfPlayers = numberOfPlayer;
      let result:SimulationResult = Simulator.simulate(param);
      sheet[12 - n1][12 - n2] = result;
    }
    if (debugOutput)  console.log('XXX computed a line of off suited odds, row card number = ' + n1);
  }

  if (debugOutput) console.log(''); // newline
  if (debugOutput) console.log('Total Equity');
  for (let i = 0; i < 13; i++) {
    let row = '';
    for (let j = 0; j < 13; j++) {
      row = row + sheet[i][j].totalEquityByPlayers[0].toFixed(4) + ',';
    }
    if (debugOutput) console.log(row);
  }

  if (debugOutput) console.log(''); // newline
  if (debugOutput) console.log('Total Equity Confidential Interval of 95% (2*Sigma)');
  for (let i = 0; i < 13; i++) {
    let row = '';
    for (let j = 0; j < 13; j++) {
      row = row + (sheet[i][j].totalEquityStdByPlayers[0] * 2).toFixed(4) + ',';
    }
    if (debugOutput) console.log(row);
  }

  if (debugOutput)  console.log(''); // newline
  if (debugOutput)  console.log('Total Equity Over Average Of Players');
  for (let i = 0; i < 13; i++) {
    let row = '';
    for (let j = 0; j < 13; j++) {
      row = row + ((sheet[i][j].totalEquityByPlayers[0] * numberOfPlayer - 1) * 100.0).toFixed(2) + '%,';
    }
    if (debugOutput)  console.log(row);
  }

  // Compute top percentage;
  let handRanks = [];
  for (let i = 0; i < 13; i++ ){
    for (let j = 0; j < 13; j++) {
      let p = new PercentageEntry();
      p.positionInSheetI = i;
      p.positionInSheetJ = j;
      if (i == j) p.numberOfEquivalentHands = 6;
      else if (j > i) p.numberOfEquivalentHands = 4;
      else if (j < i) p.numberOfEquivalentHands = 12;
      p.simulationResult = sheet[i][j];
      handRanks.push(p);
      percentageSheet[i][j] = p;
    }
  }

  handRanks.sort((p1, p2) => {
    return p1.simulationResult.totalEquityByPlayers[0] -
        p2.simulationResult.totalEquityByPlayers[0];
  }).reverse();

  let currentHandsBeat = 1326;
  for (let p of handRanks) {
    p.handsBeat = currentHandsBeat - p.numberOfEquivalentHands;
    currentHandsBeat -= p.numberOfEquivalentHands;
  }

  if (debugOutput) console.log(''); // newline
  if (debugOutput) console.log('Percentage Map');

  for (let i = 0; i < 13; i++) {
    let row = '';
    for (let j = 0; j < 13; j++) {
      row = row + (percentageSheet[i][j].handsBeat / 1326 * 100).toFixed(2) + '%,';
    }
    if (debugOutput) console.log(row);
  }
  jsonfile.writeFileSync(file, percentageSheet);
  let output = [];
  for (let i = 0; i < 13; i++) {
    let row = [];
    for (let j = 0; j < 13; j++) {
      row.push((percentageSheet[i][j].handsBeat / 1326 * 100).toFixed(2) + '');
    }
    output.push(row);
    if (debugOutput) console.log(row);
  }
  console.log(JSON.stringify(output));
};

let computeAAvKK = function () {
  console.log(`Start 1s`);
  let param:SimulationParameter = new SimulationParameter();
  param.maxSimulationTimes = 1000;
  param.knownPlayerCardIndices = [
    [Cards.cardAs, Cards.cardAh],
    [Cards.cardKs, Cards.cardKh],
  ];
  param.knownCommunityCardIndices = [Cards.card2s, Cards.card3s, Cards.cardQh];
  param.numOfPlayers = 2;
  let result:SimulationResult = Simulator.simulate(param);
  console.log(`Simulation result of 9 players in AA v KK color crush is: ` +
      `${result.totalEquityByPlayers}, split is ${result.splitPartialTimesByPlayers}.`);
};

let handTypeBeforeStreet = function(numPlayer:number, street:Street, file:string) {
  let param = new SimulationParameter();
  param.maxSimulationTimes = 10000;
  param.knownPlayerCardIndices = [];
  param.knownCommunityCardIndices = [];
  param.streetLimit = street;
  param.numOfPlayers = numPlayer;
  let result:SimulationResult = Simulator.simulate(param);
  console.log(`TotalEquity by HandType in a ${param.numOfPlayers} players game.`);
  let strictlyBeatsPercentage = 100;
  let beatsRatioSet = {};
  for (let handType of Hand.allHandTypes) {
    let strictlyBeatenByPercentage = 100 - strictlyBeatsPercentage;
    let equityRatio = result.totalEquityByHandTypes[handType];
    strictlyBeatsPercentage -= result.totalEquityByHandTypes[handType] * 100;
    console.log(
        `HandType ${HandType[handType]}, \n` +
        `         equilty = ${(equityRatio * 100).toFixed(2)}%\t\t` +
        `         Strictly beats ${strictlyBeatsPercentage.toFixed(2)}%\t\t` +
        `         Strictly beaten by ${strictlyBeatenByPercentage.toFixed(2)}%\t\t`);
    beatsRatioSet[handType] = {
      'StrictlyBeatsRatio': strictlyBeatsPercentage / 100,
      'EquityRatio':equityRatio,
      'StrictlyBeatenByRatio': strictlyBeatenByPercentage / 100
    }
  }
  jsonfile.writeFileSync(file, beatsRatioSet);
};
let printCsvSheet = function() {
  for (let i = 1; i <= 10; i++) {
    let file = `simulation-${i}-players.json`;
    generateCsvSheet(i, 10000, file);
  }
};
let printBeatsRatio = function() {
  for (let i = 1; i <= 10; i++) {
    let file = `beatsRatio-${i}-players.json`;
    handTypeBeforeStreet(i, Street.river, file);
  }
};
let main = function():void {
  printBeatsRatio();
};

main();
