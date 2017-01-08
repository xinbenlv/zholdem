import {DevTool} from "./dev_tool";
export class Cards {
  public static card2s = 0;
  public static card2c = 1;
  public static card2h = 2;
  public static card2d = 3;

  public static card3s = 4;
  public static card3c = 5;
  public static card3h = 6;
  public static card3d = 7;

  public static card4s = 8;
  public static card4c = 9;
  public static card4h = 10;
  public static card4d = 11;

  public static card5s = 12;
  public static card5c = 13;
  public static card5h = 14;
  public static card5d = 15;

  public static card6s = 16;
  public static card6c = 17;
  public static card6h = 18;
  public static card6d = 19;

  public static card7s = 20;
  public static card7c = 21;
  public static card7h = 22;
  public static card7d = 23;

  public static card8s = 24;
  public static card8c = 25;
  public static card8h = 26;
  public static card8d = 27;

  public static card9s = 28;
  public static card9c = 29;
  public static card9h = 30;
  public static card9d = 31;

  public static cardTs = 32;
  public static cardTc = 33;
  public static cardTh = 34;
  public static cardTd = 35;

  public static cardJs = 36;
  public static cardJc = 37;
  public static cardJh = 38;
  public static cardJd = 39;

  public static cardQs = 40;
  public static cardQc = 41;
  public static cardQh = 42;
  public static cardQd = 43;

  public static cardKs = 44;
  public static cardKc = 45;
  public static cardKh = 46;
  public static cardKd = 47;

  public static cardAs = 48;
  public static cardAc = 49;
  public static cardAh = 50;
  public static cardAd = 51;
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
    DevTool.assert(n>=0 && n<=12, `n is incorrect, n = ${n}`);
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
    if (DevTool.flags.debugOn) str += `(${this.index})`;
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
