import {suite, test, slow, timeout} from "mocha-typescript";
import {SimulationParameter, Simulator, SimulationResult} from "../src/simulator";
import {Cards} from "../src/card";
import {assert} from "chai";
@suite("Simulator ")
class SimultorTest {

  @test('should correctly handle AA v KK on AAKKQ.')
  testAAvKKonAAKKQ() {
    let param: SimulationParameter = new SimulationParameter();
    param.simulationTimes = 100;
    param.knownPlayerCardIndices = [
      [Cards.cardAs, Cards.cardAc], [Cards.cardKs, Cards.cardKc]
    ];
    param.knownCommunityCardIndices = [
      Cards.cardAh, Cards.cardAd, Cards.cardKh, Cards.cardKd, Cards.cardQs];
    param.numOfPlayers = 2;
    let result: SimulationResult = Simulator.simulate(param);
    assert(result.winTimesByPlayers[0] == 100);
    assert(result.winTimesByPlayers[1] == 0);
    assert(result.splitTimesByPlayers[0] == 0);
    assert(result.splitTimesByPlayers[1] == 0);
    assert(result.totalEquityByPlayers[0] == 1);
    assert(result.totalEquityByPlayers[1] == 0);
    assert(result.totalEquityStdByPlayers[0] == 0);
    assert(result.totalEquityStdByPlayers[1] == 0);
  }

  @test('should correctly handle AA preflot in headsup (2 players).')
  @slow(2000) // This test is randomized and not deterministic.
  testAAin2Players() {
    // TODO(zzn): make this test deterministic
    let param: SimulationParameter = new SimulationParameter();
    param.simulationTimes = 1000;
    param.knownPlayerCardIndices = [
      [Cards.cardAs, Cards.cardAc],
    ];
    param.knownCommunityCardIndices = [];
    param.numOfPlayers = 2;
    let result: SimulationResult = Simulator.simulate(param);

    // AA should generally win
    assert(result.winTimesByPlayers[0] > param.simulationTimes * 0.8,
        `AA should generally win, but has a winTime of ${result.winTimesByPlayers[0]}.`);
    assert(result.winTimesByPlayers[1] > 0,
        `Other player have valid win times.`);
    assert(result.totalEquityByPlayers[0] > 0.8);
    assert(result.totalEquityByPlayers[0] > 0);
    assert(
        result.winTimesByPlayers[0] +
        result.winTimesByPlayers[1] +
        result.splitTimesByPlayers[0]
        == param.simulationTimes,
        `Total win times and split times should equal to total simulation time. ` +
        `But is actually ${result.winTimesByPlayers[0]}, ${result.winTimesByPlayers[1]}, ` +
        `${result.splitTimesByPlayers[0]}`);
    assert(result.splitTimesByPlayers[0] == result.splitTimesByPlayers[1],
        `In two player game, split times should equal.`);
    SimultorTest.assertAlwaysHoldRelationships(param, result);
  }

  @test('should correctly handle AA preflot in 9 players.')
  @slow(10000)
  @timeout(20000) // Long time out is set for coverage
  testAAin9Players() {
    // TODO(zzn): make this test deterministic
    let param: SimulationParameter = new SimulationParameter();
    param.simulationTimes = 1000;
    param.knownPlayerCardIndices = [
      [Cards.cardAs, Cards.cardAc],
    ];
    param.knownCommunityCardIndices = [];
    param.numOfPlayers = 9;
    let result: SimulationResult = Simulator.simulate(param);

    // AA should generally win
    assert(result.winTimesByPlayers[0] > param.simulationTimes * 0.3,
        `AA should generally win, but has a winTime of ${result.winTimesByPlayers[0]}.`);
    assert(result.totalEquityByPlayers[0] > 0.3);
    assert(result.totalEquityByPlayers[0] > 0);
    SimultorTest.assertAlwaysHoldRelationships(param, result);
  }

  @test('should correctly handle simple split case with two players split in one hand.')
  testSimpleSplitCase() {
    // TODO(zzn): make this test deterministic
    let param: SimulationParameter = new SimulationParameter();
    param.simulationTimes = 1;
    param.knownPlayerCardIndices = [
      [Cards.cardQs, Cards.cardQc],
      [Cards.cardQh, Cards.cardQd],
    ];
    param.knownCommunityCardIndices = [Cards.cardAh, Cards.cardKd, Cards.card2s, Cards.card7d];
    param.numOfPlayers = 2;
    let result: SimulationResult = Simulator.simulate(param);

    // Pure split scanario.
    assert(result.winTimesByPlayers[0] == 0);
    assert(result.winTimesByPlayers[1] == 0);
    assert(result.totalEquityByPlayers[0] == 0.5);
    assert(result.totalEquityByPlayers[1] == 0.5);
    assert(result.splitPartialTimesByPlayers[0] == 0.5);
    assert(result.splitPartialTimesByPlayers[1] == 0.5);
    assert(result.splitTimesByPlayers[0] == 1);
    assert(result.splitTimesByPlayers[1] == 1);
    SimultorTest.assertAlwaysHoldRelationships(param, result);
  }

  @test('should correctly handle multi split cases like JJ, JJ, QQ, QQ board AK27.')
  testMutliSplitCase1() {
    // TODO(zzn): make this test deterministic
    let param: SimulationParameter = new SimulationParameter();
    param.simulationTimes = 1;
    param.knownPlayerCardIndices = [
      [Cards.cardJs, Cards.cardJc],
      [Cards.cardJh, Cards.cardJd],
      [Cards.cardQs, Cards.cardQc],
      [Cards.cardQh, Cards.cardQd],
    ];
    param.knownCommunityCardIndices = [
      Cards.cardAh, Cards.cardKd, Cards.card2s, Cards.card7d, Cards.card8c];
    param.numOfPlayers = 4;
    let result: SimulationResult = Simulator.simulate(param);

    // Pure split scanario.
    assert(result.winTimesByPlayers[0] == 0, `Win times of player 0 is ${result.winTimesByPlayers[0]}, all is ${JSON.stringify(result)}.`);
    assert(result.winTimesByPlayers[1] == 0, `Win times of player 1 is ${result.winTimesByPlayers[1]}.`);
    assert(result.winTimesByPlayers[2] == 0, `Win times of player 2 is ${result.winTimesByPlayers[2]}.`);
    assert(result.winTimesByPlayers[3] == 0, `Win times of player 3 is ${result.winTimesByPlayers[3]}.`);
    assert(result.totalEquityByPlayers[0] == 0, `Total equity of player 0 is ${result.totalEquityByPlayers[0]}`);
    assert(result.totalEquityByPlayers[1] == 0, `Total equity of player 1 is ${result.totalEquityByPlayers[1]}.`);
    assert(result.totalEquityByPlayers[2] == 0.5, `Total equity of player 2 is ${result.totalEquityByPlayers[2]}.`);
    assert(result.totalEquityByPlayers[3] == 0.5, `Total equity of player 3 is ${result.totalEquityByPlayers[3]}.`);
    assert(result.splitPartialTimesByPlayers[0] == 0, `Split equity of player 0 is ${result.splitPartialTimesByPlayers[0]}.`);
    assert(result.splitPartialTimesByPlayers[1] == 0, `Split equity of player 1 is ${result.splitPartialTimesByPlayers[1]}.`);
    assert(result.splitPartialTimesByPlayers[2] == 0.5, `Split equity of player 2 is ${result.splitPartialTimesByPlayers[2]}.`);
    assert(result.splitPartialTimesByPlayers[3] == 0.5, `Split equity of player 3 is ${result.splitPartialTimesByPlayers[3]}.`);
    assert(result.splitTimesByPlayers[0] == 0, `Split times of player 0 is ${result.splitPartialTimesByPlayers[0]}.`);
    assert(result.splitTimesByPlayers[1] == 0, `Split times of player 1 is ${result.splitPartialTimesByPlayers[1]}.`);
    assert(result.splitTimesByPlayers[2] == 1, `Split times of player 2 is ${result.splitPartialTimesByPlayers[2]}.`);
    assert(result.splitTimesByPlayers[2] == 1, `Split times of player 3 is ${result.splitPartialTimesByPlayers[3]}.`);
    SimultorTest.assertAlwaysHoldRelationships(param, result);
  }


  @test('should correctly handle split simple 3 split case with multiple players split in separate ' +
      'tiers in one hand.')
  testThreePlayerSplitCase() {
    // TODO(zzn): make this test deterministic
    let param: SimulationParameter = new SimulationParameter();
    param.simulationTimes = 1;
    param.knownPlayerCardIndices = [
      [Cards.cardQs, Cards.cardJs],
      [Cards.cardQd, Cards.cardJd],
      [Cards.cardQh, Cards.cardJh],
    ];
    param.knownCommunityCardIndices = [Cards.cardAh, Cards.cardKd, Cards.card2s, Cards.card7d];
    param.numOfPlayers = 3;
    let result: SimulationResult = Simulator.simulate(param);

    // Pure 3 split scanario.
    assert(result.winTimesByPlayers[0] == 0, 'Win time for player 0 should be 0');
    assert(result.winTimesByPlayers[1] == 0, 'Win time for player 1 should be 0');
    assert(result.winTimesByPlayers[2] == 0, 'Win time for player 2 should be 0');
    assert(result.totalEquityByPlayers[0] == 1 / 3);
    assert(result.totalEquityByPlayers[1] == 1 / 3);
    assert(result.totalEquityByPlayers[2] == 1 / 3);
    assert(result.splitPartialTimesByPlayers[0] == 1 / 3);
    assert(result.splitPartialTimesByPlayers[1] == 1 / 3);
    assert(result.splitPartialTimesByPlayers[2] == 1 / 3);
    assert(result.splitTimesByPlayers[0] == 1);
    assert(result.splitTimesByPlayers[1] == 1);
    assert(result.splitTimesByPlayers[2] == 1);
    SimultorTest.assertAlwaysHoldRelationships(param, result);
  }

  /**
   * Assert always hold relationships.
   *   1. the simulation results should always have total equity sum up to 1.
   * @param param
   * @param result
   */
  private static assertAlwaysHoldRelationships(param: SimulationParameter, result: SimulationResult) {
    let totalEquity = 0;
    let totalWinTimes = 0;
    for (let e of result.totalEquityByPlayers) {
      assert(e <= 1, `The equity of every player should be <= 1, ` +
          `, but is actually ${JSON.stringify(result)}.`);
      assert(e >= 0, `The equity of every player should be >= 0,` +
          `, but is actually ${JSON.stringify(result)}.`);
      totalEquity += e;
    }

    for (let wt of result.winTimesByPlayers) {
      assert(wt <= param.simulationTimes,
          `The win times of every player should be <= ${param.simulationTimes}.`);
      assert(wt >= 0, `The win times of every player should be >= 0,` +
          `, but is actually ${JSON.stringify(wt)}.`);
      totalWinTimes += wt;
    }

    for (let st of result.splitTimesByPlayers) {
      assert(st <= param.simulationTimes,
          `The split times of every player should be <= ${param.simulationTimes}, ` +
          `but is actually ${JSON.stringify(result)}.`);
      assert(st >= 0, `The split times of every player should be >= 0, ` +
          `but is actually ${JSON.stringify(result)}.`);
      totalWinTimes += st;
    }

    for (let spt of result.splitPartialTimesByPlayers) {
      assert(spt <= param.simulationTimes,
          `The split partial times of every player should be <= ${param.simulationTimes}, ` +
          `but is actually ${JSON.stringify(result)}.`);
      assert(spt >= 0, `The split partial times of every player should be >= 0, ` +
          `but is actually ${JSON.stringify(result)}.`);
      totalWinTimes += spt;
    }

    assert(Math.abs(totalEquity - 1) <= 0.01, `Total equity should always equal to 1, but is ` +
        `${JSON.stringify(result.totalEquityByPlayers)}, result=${JSON.stringify(result)}.`);
  }
}
