/// <reference path='compute.ts'/>

import {Card, Color, Computer, Hand, HandType} from "./compute";

let computeCsvSheet = function(numberOfPlayer:number = 2):void {
  let simTimes = 10000;
  let suitedOdds:{[indices:string]:number} = {};
  let offSuitedOdds:{[indices:string]:number} = {};
  /**
   * a 13x13 rows [rol][col] as shown in http://i35.tinypic.com/anmufp.jpg, topleft is AA
   * bottom right is 22.
   * First index is the row, and second index is the column
   * @type {Array}
   */
  let sheet:number[][] = [];
  for (let i = 0; i < 13; i++) {
    let row = [0,0,0,0,0,0,0,0,0,0,0,0,0];
    sheet.push(row);
  }

  // Suited
  for (let n1 = 12; n1 >= 0; n1--) {
    for (let n2=n1-1; n2 >= 0; n2 --) {
      let cardIndex1 = n1 * 4;
      let cardIndex2 = n2 * 4;
      let card1:Card = new Card(cardIndex1);
      let card2:Card = new Card(cardIndex2);
      let computer = new Computer(cardIndex1,cardIndex2, simTimes, numberOfPlayer);
      let equity:number = computer.computeEquity();
      suitedOdds[card1.getNumberStr() + card2.getNumberStr()] = equity;
      sheet[12 - n1][12 - n2] = equity;
    }
    console.log('XXX computed a line of suited odds, row card number = ' + n1);
  }

  // Off suited
  for (let n1 = 12; n1>= 0; n1--) {
    for (let n2 = 12; n2 >= n1; n2 --) {
      let cardIndex1 = n1 * 4 + 1;
      let cardIndex2 = n2 * 4;
      let card1:Card = new Card(cardIndex1);
      let card2:Card = new Card(cardIndex2);
      let computer = new Computer(cardIndex1,cardIndex2, simTimes, numberOfPlayer);
      let equity:number = computer.computeEquity();
      offSuitedOdds[card1.getNumberStr() + card2.getNumberStr()] = equity;
      sheet[12 - n1][12 - n2] = equity;
    }
    console.log('XXX computed a line of off suited odds, row card number = ' + n1);
  }
  console.log('Equity Ratio');
  for (let i = 0; i < 13; i++) {
    let row = '';
    for (let j = 0; j < 13; j++) {
      row = row + sheet[i][j] + ',';
    }
    console.log(row);
  }
  console.log('Percentage Ahead Compare To Average of All');

  for (let i = 0; i < 13; i++) {
    let row = '';
    for (let j = 0; j < 13; j++) {
      row = row + (sheet[i][j] * numberOfPlayer - 1) * 100 + '%,';
    }
    console.log(row);
  }
};

let computeSingleCellEquity = function():void {
  let computer:Computer = new Computer(51, 46);
  console.log('XXX Start computing equity of AKo in an headsup');
  console.log(computer.computeEquity());
};

let computeA2O_6p = function():void {
  let computer:Computer = new Computer(51, 0, 20, 6); // A2o
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
  console.log(`XXX DEBG starting player 9`);
  computeCsvSheet(9);
};

main();
