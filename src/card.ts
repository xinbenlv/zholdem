import {DevTool} from "./dev_tool";

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
