export class DevTool {

  public static flags = {
    debugOn : false
  };

  public static assert = function(assertionBoolean, reason?:string) {
    if (!assertionBoolean) {
      throw new Error(reason === undefined ? 'Assertion failed.': reason);
    }
  };

}
