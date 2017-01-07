import {suite, test} from "mocha-typescript";
import {Hand, flags, HandType, Card} from "../compute";
import {assert} from "chai";
@suite("Hand ")
class HandTest {

  private card2s = 0;
  private card2c = 1;
  private card2h = 2;
  private card2d = 3;

  private card3s = 4;
  private card3c = 5;
  private card3h = 6;
  private card3d = 7;

  private card4s = 8;
  private card4c = 9;
  private card4h = 10;
  private card4d = 11;

  private card5s = 12;
  private card5c = 13;
  private card5h = 14;
  private card5d = 15;

  private card6s = 16;
  private card6c = 17;
  private card6h = 18;
  private card6d = 19;


  private card7s = 20;
  private card7c = 21;
  private card7h = 22;
  private card7d = 23;

  private card8s = 24;
  private card8c = 25;
  private card8h = 26;
  private card8d = 27;

  private card9s = 28;
  private card9c = 29;
  private card9h = 30;
  private card9d = 31;

  private cardTs = 32;
  private cardTc = 33;
  private cardTh = 34;
  private cardTd = 35;

  private cardJs = 36;
  private cardJc = 37;
  private cardJh = 38;
  private cardJd = 39;

  private cardQs = 40;
  private cardQc = 41;
  private cardQh = 42;
  private cardQd = 43;

  private cardKs = 44;
  private cardKc = 45;
  private cardKh = 46;
  private cardKd = 47;

  private cardAs = 48;
  private cardAc = 49;
  private cardAh = 50;
  private cardAd = 51;

  @test('creation should avoid duplications.')
  testDuplicationCheck() {
    flags.debugOn = true;
    try {
      new Hand([1, 1, 2, 3, 4, 5]);
      assert(false, 'Test should fail.') ;
    } catch (reason) {
      assert(reason instanceof Error);
      assert(reason.message.indexOf('duplicated') > 0,
          `Reason should contains "duplicated" but it doesn't, it is ${reason.message}`);
    }
  }

  @test('creation should avoid any hand that is less than 5 cards.')
  testLengthCheck() {
    flags.debugOn = true;
    try {
      new Hand([1, 1, 2, 3, 4, 5]);
      assert(false, 'Test should fail.') ;
    } catch (reason) {
      assert(reason instanceof Error);
      assert(reason.message.indexOf('duplicated') > 0,
          `Reason should contains "duplicated" but it doesn't, it is ${reason.message}`);
    }
  }

  @test('hand compare should correctly compare different card types.')
  testCompareDifferentTypes() {
    let handFlushStraight:Hand = new Hand([
      this.card2s, this.card3s, this.card4s,
      this.card5s, this.card6s, this.card9h, this.cardTc]);
    let handFourOfAKind:Hand = new Hand([
      this.card2s, this.card2h, this.card2c,
      this.card2d, this.card5d, this.card9h, this.cardTc]);
    let handFullHouse:Hand = new Hand([
      this.card2s, this.card2h, this.card2c,
      this.card5s, this.card5d, this.card9h, this.cardTc]);
    let handFlush:Hand = new Hand([
        this.card2s, this.card3s, this.card4s,
        this.card5s, this.card7s, this.card9h, this.cardTc]);
    let handStraight:Hand = new Hand([
        this.card2s, this.card3c, this.card4s,
        this.card5c, this.card6h, this.cardKh, this.cardQc]);
    let handThreeOfAKind:Hand = new Hand([this.card2s, this.card2c, this.card2d, 5, 51, 46, 41]);
    let handTwoPair:Hand = new Hand([this.card2s, this.card2c, this.card3h, this.card3d, 51, 46, 41]);
    let handOnePair:Hand = new Hand([this.card2s, this.card2c, 51, 46, 41]);
    let handHighCard:Hand = new Hand([this.card2s, 6/*2c*/, 51, 46, 41]);
    assert(handFlushStraight.getHandType() == HandType.FlushStraight);
    assert(handFourOfAKind.getHandType() == HandType.FourOfAKind);
    assert(handFullHouse.getHandType() == HandType.FullHouse);
    assert(handFlush.getHandType() == HandType.Flush);
    assert(handStraight.getHandType() == HandType.Straight);
    assert(handThreeOfAKind.getHandType() == HandType.ThreeOfAKind);
    assert(handTwoPair.getHandType() == HandType.TwoPairs);
    assert(handOnePair.getHandType() == HandType.OnePair);
    assert(handHighCard.getHandType() == HandType.HighCard);
    let orderList = [
      handFlushStraight, handFourOfAKind, handFullHouse,
      handFlush, handStraight, handThreeOfAKind,
      handTwoPair, handOnePair, handHighCard];
    for (let i = 0; i < orderList.length - 1; i++) {
      let compareResult = orderList[i].compareWith(orderList[i+1]);
      assert(compareResult > 0,
          `Compare failed, HandType ${orderList[i].getHandType()} 
          should breat ${orderList[i + 1].getHandType()} `);
    }
  }
}
