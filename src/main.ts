import {Simulator, EquitySimulationResult} from "./simulator";
import {Card} from "./card";
import {Hand, HandType} from "./hand";

class PercentageEntry {
  public simulationResult:EquitySimulationResult;
  public positionInSheetI:number;
  public positionInSheetJ:number;
  public numberOfEquivalentHands:number;
  public handsBeat:number;
}
let computeCsvSheet = function(numberOfPlayer:number = 9, simTimes:number = 10009):void {
  /**
   * a 13x13 rows [rol][col] as shown in http://i35.tinypic.com/anmufp.jpg, topleft is AA
   * bottom right is 22.
   * First index is the row, and second index is the column
   * @type {Array}
   */
  let sheet:EquitySimulationResult[][] = [];
  let percentageSheet:PercentageEntry[][] = [];
  for (let i = 0; i < 13; i++) {
    let row = new Array<EquitySimulationResult>(13);
    sheet.push(row);
    percentageSheet.push(new Array<PercentageEntry>(13));
  }

  // Suited
  for (let n1 = 12; n1 >= 0; n1--) {
    for (let n2=n1-1; n2 >= 0; n2 --) {
      let cardIndex1 = n1 * 4;
      let cardIndex2 = n2 * 4;
      let computer = new Simulator(cardIndex1,cardIndex2, simTimes, numberOfPlayer);
      let equityResult:EquitySimulationResult = computer.computeEquity();
      sheet[12 - n1][12 - n2] = equityResult;
    }
    console.log('XXX computed a line of suited odds, row card number = ' + n1);
  }

  // Off suited
  for (let n1 = 12; n1>= 0; n1--) {
    for (let n2 = 12; n2 >= n1; n2 --) {
      let cardIndex1 = n1 * 4 + 1;
      let cardIndex2 = n2 * 4;
      let computer = new Simulator(cardIndex1,cardIndex2, simTimes, numberOfPlayer);
      let equityResult:EquitySimulationResult = computer.computeEquity();
      sheet[12 - n1][12 - n2] = equityResult;
    }
    console.log('XXX computed a line of off suited odds, row card number = ' + n1);
  }

  console.log(''); // newline
  console.log('Total Equity');
  for (let i = 0; i < 13; i++) {
    let row = '';
    for (let j = 0; j < 13; j++) {
      row = row + sheet[i][j].totalEquity.toFixed(4) + ',';
    }
    console.log(row);
  }

  console.log(''); // newline
  console.log('Total Equity Confidential Interval of 95% (2*Sigma)');
  for (let i = 0; i < 13; i++) {
    let row = '';
    for (let j = 0; j < 13; j++) {
      row = row + (sheet[i][j].totalEquityStD * 2).toFixed(4) + ',';
    }
    console.log(row);
  }

  console.log(''); // newline
  console.log('Total Equity Over Average Of Players');
  for (let i = 0; i < 13; i++) {
    let row = '';
    for (let j = 0; j < 13; j++) {
      row = row + ((sheet[i][j].totalEquity * numberOfPlayer - 1) * 100.0).toFixed(2) + '%,';
    }
    console.log(row);
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
    return p1.simulationResult.totalEquity - p2.simulationResult.totalEquity;
  }).reverse();

  let currentHandsBeat = 1326;
  for (let p of handRanks) {
    p.handsBeat = currentHandsBeat - p.numberOfEquivalentHands;
    currentHandsBeat -= p.numberOfEquivalentHands;
  }

  console.log(''); // newline
  console.log('Percentage Map');
  for (let i = 0; i < 13; i++) {
    let row = '';
    for (let j = 0; j < 13; j++) {
      row = row + (percentageSheet[i][j].handsBeat / 1326 * 100).toFixed(2) + '%,';
    }
    console.log(row);
  }
};

let compute22v33 = function():void {
  console.log(`XXX DEBG starting 22o v 33o 10000 times for 9 players`);
  let computer:Simulator;
  computer = new Simulator(0, 1,10000,9);
  console.log('XXX Start computing equity of 22o in an headsup');
  console.log(computer.computeEquity());
  computer = new Simulator(4, 5,10000,9);
  console.log('XXX Start computing equity of 33o in an headsup');
  console.log(computer.computeEquity());
};
let computeSingleCellEquity = function():void {
  let computer:Simulator = new Simulator(0, 1);
  console.log('XXX Start computing equity of AKo in an headsup');
  console.log(computer.computeEquity());
};

let computeA2O_6p = function():void {
  let computer:Simulator = new Simulator(51, 0, 20, 6); // A2o
  console.log('XXX Start computing equity of AKo in an headsup');
  console.log(computer.computeEquity());
};

let computeSingleHand = function():void {
  let communityCardIndices = [28, 19, 9, 3, 10];
  let myHand = new Hand([51, 46].concat(communityCardIndices));
  let oHand = new Hand([15, 20].concat(communityCardIndices));
  let result = myHand.compareWith(oHand);
  console.log(`XXX DEBUG: My Cards: ${myHand.myCards[0].getNumberWithColorStr() + ' ' + myHand.myCards[1].getNumberWithColorStr()}`);
  console.log(`XXX DEBUG: O Cards: ${oHand.myCards[0].getNumberWithColorStr() + ' ' + oHand.myCards[1].getNumberWithColorStr()}`);
  console.log(`XXX DEBUG: My Hand Type: ${HandType[myHand.getHandType()]}`);
  console.log(`XXX DEBUG: O Hand Type: ${HandType[oHand.getHandType()]}`);
  console.log(`XXX DEBUG: Community Cards: ${communityCardIndices.map(cI => new Card(cI).getNumberWithColorStr()).join(' ')}`);
  console.log(`XXX DEBUG: compare result = ${result}`);
  console.log('');
  console.log(`XXX DEBUG result = ${result}`);
};

let main = function():void {
  computeCsvSheet();
};

main();
