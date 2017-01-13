export class DevTool {
  public static flags = {
    debugOn : false,
    doubleEqualLimit: 0.0001,
  };

  public static assert = function(assertionBoolean, reason?:string) {
    if (!assertionBoolean) {
      throw new Error(reason === undefined ? 'Assertion failed.': reason);
    }
  };

  public static doubleEqual = function(n1:number, n2:number) {
    return Math.abs(n1 - n2) <= DevTool.flags.doubleEqualLimit;
  };


  public static sortAsIntegerArray = function(a, b) {
    // assuming this is an Array<number>
    return a - b;
  };

  public static createZeroArray(size:number):number[] {
    let a = new Array<number>(size);
    for (let i = 0; i < size; i ++) {
      a[i] = 0;
    }
    return a;
  }

}
