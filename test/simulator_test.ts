
import {suite, test, slow, timeout} from "mocha-typescript";
import {SimulationParameter, Simulator, SimulationResult} from "../src/simulator";
import {Cards} from "../src/card";
import {assert} from "chai";
@suite("Simulator ")
class SimultorTest {

  @test('should correctly handle AA v KK on AAKKQ.')
  testAAvKKonAAKKQ() {
    let param:SimulationParameter = new SimulationParameter();
    param.simulationTimes = 100;
    param.knownPlayerCardIndices = [
      [Cards.cardAs, Cards.cardAc], [Cards.cardKs, Cards.cardKc]
    ];
    param.knownCommunityCardIndices = [
        Cards.cardAh, Cards.cardAd, Cards.cardKh, Cards.cardKd, Cards.cardQs];
    param.numOfPlayers = 2;
    let result:SimulationResult = Simulator.simulate(param);
    assert(result.winTimesByPlayers[0] == 100);
    assert(result.winTimesByPlayers[1] == 0);
    assert(result.splitTimesByPlayers[0] == 0);
    assert(result.splitTimesByPlayers[1] == 0);
    assert(result.totalEquityByPlayers[0] == 1);
    assert(result.totalEquityByPlayers[1] == 0);
    assert(result.totalEquityStdByPlayers[0] == 0);
    assert(result.totalEquityStdByPlayers[1] == 0);
  }

  @test('should correctly handle AA v ?? on ?????.')
  @slow(2000) // This test is randomized and not deterministic.
  testAAvXXonXXXXX() {
    // TODO(zzn): make this test deterministic
    let param:SimulationParameter = new SimulationParameter();
    param.simulationTimes = 1000;
    param.knownPlayerCardIndices = [
      [Cards.cardAs, Cards.cardAc],
    ];
    param.knownCommunityCardIndices = [];
    param.numOfPlayers = 2;
    let result:SimulationResult = Simulator.simulate(param);

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
        `But is actually ${result.winTimesByPlayers[0]}, ${result.winTimesByPlayers[1]}, `+
        `${result.splitTimesByPlayers[0]}`);
    assert(result.splitTimesByPlayers[0] == result.splitTimesByPlayers[1],
        `In two player game, split times should equal.`);
    SimultorTest.alwaysHoldRelationships(param, result);
  }

  @test('should correctly handle AA preflot in 9 players.')
  @slow(10000)
  @timeout(20000) // Long time out is set for coverage
  testAAin9Players() {
    // TODO(zzn): make this test deterministic
    let param:SimulationParameter = new SimulationParameter();
    param.simulationTimes = 1000;
    param.knownPlayerCardIndices = [
      [Cards.cardAs, Cards.cardAc],
    ];
    param.knownCommunityCardIndices = [];
    param.numOfPlayers = 9;
    let result:SimulationResult = Simulator.simulate(param);

    // AA should generally win
    assert(result.winTimesByPlayers[0] > param.simulationTimes * 0.3,
        `AA should generally win, but has a winTime of ${result.winTimesByPlayers[0]}.`);
    assert(result.totalEquityByPlayers[0] > 0.3);
    assert(result.totalEquityByPlayers[0] > 0);
    SimultorTest.alwaysHoldRelationships(param, result);
  }

  private static alwaysHoldRelationships(
      param:SimulationParameter, result:SimulationResult) {
    let totalEquity = 0;
    let totalWinTimes = 0;
    for (let e of result.totalEquityByPlayers) {
      totalEquity += e;
    }

    for (let t of result.winTimesByPlayers) {
      totalWinTimes += t;
    }

    assert(Math.abs(totalEquity - 1) <= 0.01, `Total equity should always equal to 1 but are ` +
      `${JSON.stringify(result.totalEquityByPlayers)}, result=${JSON.stringify(result)}.`);
  }
}
