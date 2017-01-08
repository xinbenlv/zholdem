export class DevTool {

  public static flags = {
    debugOn : false
  };

  public static assert = function(assertionBoolean, reason?:string) {
    if (!assertionBoolean) {
      throw new Error(reason === undefined ? 'Assertion failed.': reason);
    }
  };

  public static createZeroArray(size:number):number[] {
    let a = new Array<number>(size);
    for (let i = 0; i < size; i ++) {
      a[i] = 0;
    }
    return a;
  }

}
