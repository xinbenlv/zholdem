import {suite, test} from "mocha-typescript";
import {Hand, HandType} from "../src/hand";
import {assert} from "chai";
import {DevTool} from "../src/dev_tool";

//noinspection BadExpressionStatementJS
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

  //noinspection JSUnusedGlobalSymbols,JSMethodCanBeStatic
  @test('creation should avoid duplications.')
  testDuplicationCheck() {
    DevTool.flags.debugOn = true; // need the thrown exceptions
    try {
      new Hand([1, 1, 2, 3, 4, 5]);
      assert(false, 'Test should fail.') ;
    } catch (reason) {
      assert(reason instanceof Error);
      assert(reason.message.indexOf('duplicated') > 0,
          `Reason should contains "duplicated" but it doesn't, it is ${reason.message}`);
    }
  }

  //noinspection JSUnusedGlobalSymbols,JSMethodCanBeStatic
  @test('creation should avoid any hand that is less than 5 cards.')
  testLengthCheck() {
    DevTool.flags.debugOn = true;  // need the thrown exceptions
    try {
      new Hand([1, 1, 2, 12, 45, 51]);
      assert(false, 'Test should fail.') ;
    } catch (reason) {
      assert(reason instanceof Error);
      assert(reason.message.indexOf('duplicated') > 0,
          `Reason should contains "duplicated" but it doesn't, it is ${reason.message}`);
    }
  }

  //noinspection JSUnusedGlobalSymbols
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
    let handHighCard:Hand = new Hand([this.card2s, 6, 51, 46, 41]);
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

  //noinspection JSUnusedGlobalSymbols
  @test('should recognize and compare FlushStraights correctly.')
  testRecognizeFlushStraight() {
    let handFlushStraight5high:Hand = new Hand([
      this.card2s, this.card3s, this.card4s,
      this.card5s, this.card9h, this.cardAs, this.cardQc]);
    let handFlushStraight6high:Hand = new Hand([
      this.card6s, this.card2s, this.card3s,
      this.card4s, this.card5s, this.cardKs, this.cardQs]);
    [handFlushStraight5high, handFlushStraight6high]
        .forEach((h)=> assert(h.getHandType() == HandType.FlushStraight));
    assert(handFlushStraight5high.resultNumbers[0] == 3);
    assert(handFlushStraight6high.resultNumbers[0] == 4);
    assert(handFlushStraight6high.compareWith(handFlushStraight5high) > 0,
        '6 high FlushStraight should beat 5 high');
  }

  //noinspection JSUnusedGlobalSymbols
  @test('should recognize and compare FourOfAKinds correctly.')
  testRecognizeFourOfAKind() {
    let handFour2WithAhigh:Hand = new Hand([
      this.card2s, this.card2c, this.card2h,
      this.card2d, this.card9h, this.cardAs, this.cardQc]);
    let handFour2WithQhigh:Hand = new Hand([
      this.card2s, this.card2c, this.card2h,
      this.card2d, this.card9h, this.cardTs, this.cardQc]);
    let handFour3With9high:Hand = new Hand([
      this.card3s, this.card3c, this.card3h,
      this.card3d, this.card9h, this.card8s, this.cardQc]);

    let handKKKKAAA:Hand = new Hand([
      this.cardKs, this.cardKc, this.cardKh,
      this.cardKd, this.cardAh, this.cardAs, this.cardAc]);
    [
        handFour2WithAhigh,
        handFour2WithQhigh,
        handFour3With9high,
        handKKKKAAA
    ]
        .forEach((h)=> assert(h.getHandType() == HandType.FourOfAKind));
    assert(handFour2WithAhigh.resultNumbers[0] == 0);
    assert(handFour2WithQhigh.resultNumbers[0] == 0);
    assert(handFour3With9high.resultNumbers[0] == 1);
    assert(handKKKKAAA.resultNumbers[0] == 11);
    assert(handKKKKAAA.resultNumbers[1] == 12);

    assert(handFour2WithAhigh.compareWith(handFour2WithQhigh) > 0,
        'Four of 2 With A high FourOfAKind should beat Four of 2 With Q high');
    assert(handFour3With9high.compareWith(handFour2WithAhigh) > 0,
        'Four of 3 With 9 high FourOfAKind should beat Four of 2 With A high');
  }

  //noinspection JSUnusedGlobalSymbols
  @test('should recognize and compare FullHouses correctly.')
  testRecognizeFullHouse() {
    let handFull2Pair9:Hand = new Hand([
      this.card2s, this.card2c, this.card2h,
      this.card3d, this.card3h, this.cardAs, this.cardQc]);
    let handFull3Pair8:Hand = new Hand([
      this.card3s, this.card3c, this.card3h,
      this.card8d, this.card8h, this.cardTs, this.cardQc]);
    let handFull3Pair8WithAHigh:Hand = new Hand([
      this.card3s, this.card3c, this.card3h,
      this.card8d, this.card9h, this.card8s, this.cardAh]);
    let handAAAKKKQQ:Hand = new Hand([
      this.cardAs, this.cardAc, this.cardAh,
      this.cardKs, this.cardKc, this.cardKh,
      this.cardQd, this.cardQh]);
    let handAAKKKQQQ:Hand = new Hand([
      this.cardQs, this.cardAc, this.cardAh,
      this.cardKs, this.cardKc, this.cardKh,
      this.cardQd, this.cardQh]);

    [
      handFull2Pair9,
      handFull3Pair8,
      handFull3Pair8WithAHigh,
      handAAAKKKQQ,
      handAAKKKQQQ
    ]
        .forEach((h)=> assert(h.getHandType() == HandType.FullHouse));

    assert(handFull2Pair9.resultNumbers[0] == 0);
    assert(handFull3Pair8.resultNumbers[0] == 1);
    assert(handFull3Pair8WithAHigh.resultNumbers[0] == 1);

    assert(handAAAKKKQQ.resultNumbers[0] == 12);
    assert(handAAAKKKQQ.resultNumbers[1] == 11);
    assert(handAAKKKQQQ.resultNumbers[0] == 11);
    assert(handAAKKKQQQ.resultNumbers[1] == 12);

    assert(handFull3Pair8.compareWith(handFull2Pair9) > 0,
        'House of 3 With Pair of 8 should beat House of 2 With Pair of 9');
    assert(handFull3Pair8.compareWith(handFull3Pair8WithAHigh) == 0,
        'House of 3 With Pair of 8 with different other cards should equal.');
  }

  //noinspection JSUnusedGlobalSymbols
  @test('should recognize and compare Flushes correctly.')
  testRecognizeFlush() {
    let handFlushAhigh:Hand = new Hand([
      this.card2s, this.card3h, this.card4h,
      this.card5h, this.card9h, this.cardAh, this.cardQc]);
    let handFlushQT976high:Hand = new Hand([
      this.card6s, this.card7s, this.card9s,
      this.cardTs, this.card6h, this.cardKh, this.cardQs]);
    let handFlushQT975high:Hand = new Hand([
      this.card5c, this.card7c, this.card9c,
      this.cardTc, this.card6h, this.cardKh, this.cardQc]);

    // If it's a flush then it's not a straight
    let hand45678AKFlush456AK:Hand = new Hand([
      this.card4c, this.card5c, this.card6c,
      this.card7s, this.card8h, this.cardAc, this.cardKc]);

    [
        handFlushAhigh,
        handFlushQT975high,
        handFlushQT976high,
        hand45678AKFlush456AK
    ]
        .forEach((h)=> assert(h.getHandType() == HandType.Flush));
    assert(handFlushAhigh.resultNumbers[0] == 12);
    assert(handFlushQT976high.resultNumbers[0] == 10);
    assert(handFlushQT975high.resultNumbers[0] == 10);
    assert(handFlushAhigh.compareWith(handFlushQT976high) > 0,
        'A high flush should beat Q high');
    assert(handFlushQT976high.compareWith(handFlushQT975high) > 0,
        'QT976 high flush should beat QT975 high');
  }

  //noinspection JSUnusedGlobalSymbols
  @test('should recognize and compare Straights correctly, including A2345 as 5 high.')
  testRecognizeStraight() {
    let handStraight6high:Hand = new Hand([
      this.card2s, this.card3c, this.card4s,
      this.card5c, this.card6h, this.cardKh, this.cardQc]);
    let handStraight5high:Hand = new Hand([
      this.card2s, this.card3c, this.card4s,
      this.card5c, this.card9h, this.cardAh, this.cardQc]);
    let handStraightAhigh:Hand = new Hand([
      this.cardTs, this.cardJc, this.cardKs,
      this.card5c, this.card9h, this.cardAh, this.cardQc]);

    //   AKQJT98, top card A
    let handAKQJT98:Hand = new Hand([
      this.cardAs, this.cardKc, this.cardQs,
      this.cardJc, this.cardTh, this.card9h, this.card8c]);

    //   A2345 89, top card 5
    let hand1234589:Hand = new Hand([
      this.cardAs, this.card2c, this.card3s,
      this.card4c, this.card5h, this.card8h, this.card9c]);

    //   A 34567 9, top card 5
    let handA345679:Hand = new Hand([
      this.cardAs, this.card3c, this.card4s,
      this.card5c, this.card6h, this.card7h, this.card9c]);

    [
      handStraight6high,
      handStraight5high,
      handStraightAhigh,
      handAKQJT98,
      hand1234589,
      handA345679
    ]
        .forEach((h)=> assert(h.getHandType() == HandType.Straight));
    assert(handStraight6high.resultNumbers[0] == 4);
    assert(handStraight5high.resultNumbers[0] == 3);
    assert(handStraightAhigh.resultNumbers[0] == 12);

    assert(handAKQJT98.resultNumbers[0] == 12);
    assert(hand1234589.resultNumbers[0] == 3);
    assert(handA345679.resultNumbers[0] == 5);

    assert(handStraight6high.compareWith(handStraight5high) > 0,
        '6 high straight should beat 5 high');
    assert(handStraightAhigh.compareWith(handStraight6high) > 0,
        'A high straight should beat 6 high');
  }

  //noinspection JSUnusedGlobalSymbols
  @test('should recognize and compare ThreeOfAkIND correctly.')
  testRecognizeThreeOfAKind() {
    let hand222Q7:Hand = new Hand([
      this.card2s, this.card2c, this.card2h,
      this.card3d, this.card5h, this.card7s, this.cardQc]);
    let hand333JT:Hand = new Hand([
      this.card3s, this.card3c, this.card3h,
      this.card4d, this.card5h, this.cardTs, this.cardJc]);
    [
      hand222Q7,
      hand333JT,
    ]
        .forEach((h)=> assert(h.getHandType() == HandType.ThreeOfAKind));
    assert(hand222Q7.resultNumbers[0] == 0);
    assert(hand333JT.resultNumbers[0] == 1);
    assert(hand333JT.compareWith(hand222Q7) > 0,
        'Three of 333TJ should beat Three of 222q7');
  }

  //noinspection JSUnusedGlobalSymbols
  @test('should recognize and compare TwoPairs correctly.')
  testRecognizeTwoPairs() {
    let hand9922T:Hand = new Hand([
      this.card2s, this.card2c, this.card9h,
      this.card9d, this.card4h, this.card8s, this.cardTc]);
    let hand8833K:Hand = new Hand([
      this.card3s, this.card3c, this.cardTh,
      this.card8d, this.card8h, this.cardKs, this.cardJc]);
    let hand997744A:Hand = new Hand([
      this.card9s, this.card9c, this.card7h,
      this.card7d, this.card4h, this.card4s, this.cardAc]);
    let hand9977443:Hand = new Hand([
      this.card9s, this.card9c, this.card7h,
      this.card7d, this.card4h, this.card4s, this.card3c]);
    [
      hand9922T,
      hand8833K,
      hand997744A,
      hand9977443,
    ]
        .forEach((h)=> assert(h.getHandType() == HandType.TwoPairs,
            `Type is actually ${HandType[h.getHandType()]}`));
    assert(hand9922T.resultNumbers[0] == 7);
    assert(hand8833K.resultNumbers[0] == 6);

    assert(hand997744A.resultNumbers[0] == 7);
    assert(hand997744A.resultNumbers[1] == 5);
    assert(hand997744A.resultNumbers[2] == 12);

    assert(hand9977443.resultNumbers[0] == 7);
    assert(hand9977443.resultNumbers[1] == 5);
    assert(hand9977443.resultNumbers[2] == 2);

    assert(hand9922T.compareWith(hand8833K) > 0,
        '9922T should beat 3388K');
  }

  //noinspection JSUnusedGlobalSymbols
  @test('should recognize and compare OnePairs correctly.')
  testRecognizeOnePair() {
    let hand99T84:Hand = new Hand([
      this.card2s, this.card3c, this.card9h,
      this.card9d, this.card4h, this.card8s, this.cardTc]);
    let hand77T84:Hand = new Hand([
      this.card2s, this.card3c, this.card7h,
      this.card7d, this.card4h, this.card8s, this.cardTc]);
    [
      hand99T84,
      hand77T84,
    ]
        .forEach((h)=> assert(h.getHandType() == HandType.OnePair));
    assert(hand99T84.resultNumbers[0] == 7);
    assert(hand77T84.resultNumbers[0] == 5);
    assert(hand99T84.compareWith(hand77T84) > 0,
        '99T84 should beat 77T84');
  }

  //noinspection JSUnusedGlobalSymbols
  @test('should recognize and compare HightCards correctly.')
  testRecognizeHighCard() {
    let handAKQ97:Hand = new Hand([
      this.card5s, this.card7c, this.card9h,
      this.cardQd, this.cardKh, this.cardAs, this.card2c]);
    let handKQJ97:Hand = new Hand([
      this.card5s, this.card7c, this.card9h,
      this.cardQd, this.cardKh, this.cardJs, this.card2c]);
    [
      handAKQ97,
      handKQJ97,
    ]
        .forEach((h)=> assert(h.getHandType() == HandType.HighCard));
    assert(handAKQ97.resultNumbers[0] == 12);
    assert(handKQJ97.resultNumbers[0] == 11);
    assert(handAKQ97.compareWith(handKQJ97) > 0,
        'AKQ975 should beat KQJ975');
  }

  //noinspection JSUnusedGlobalSymbols
  @test('should correctly compare Ad Kh v 7s Ah given community cards 4h 4d 4c 9c 6c.')
  testSingleCase1() {
    // My Cards: Ad Kh
    // O Cards: 7s Ah
    // Community Cards: 4h 4d 4c 9c 6c
    // My Hand Type: ThreeOfAKind
    // O Hand Type: ThreeOfAKind
    let communityCards = [this.card4h, this.card4d, this.card4c, this.card9c, this.card6c];
    let myHand:Hand = new Hand([this.cardAd, this.cardKh].concat(communityCards));
    let oHand:Hand = new Hand([this.card7s, this.cardAh].concat(communityCards));
    assert(myHand.compareWith(oHand) > 0);
  }

  //noinspection JSUnusedGlobalSymbols
  @test('should correctly compare Ad Kh v Ts Ac given community cards 5s 6c Td 5d Kc.')
  testSingleCase2() {
    // My Cards: Ad Kh
    // O Cards: Ts Ac
    // Community Cards: 5s 6c Td 5d Kc
    // My Hand Type: TwoPairs
    // O Hand Type: TwoPairs
    let communityCards = [this.card5s, this.card6c, this.cardTd, this.card5d, this.cardKc];
    let myHand:Hand = new Hand([this.cardAd, this.cardKh].concat(communityCards));
    let oHand:Hand = new Hand([this.cardTs, this.cardAc].concat(communityCards));
    assert(myHand.compareWith(oHand) > 0);
  }

  //noinspection JSUnusedGlobalSymbols
  @test('should correctly compare Ad Kh v 5d 7s given community cards 9s 6d 4c 2d 4h.')
  testSingleCase3() {
    // My Cards: Ad(51) Kh(46)
    // O Cards: 5d(15) 7s(20)
    // Community Cards: 9s(28) 6d(19) 4c(9) 2d(3) 4h(10)
    // My Hand Type: OnePair
    // O Hand Type: OnePair
    let communityCards = [this.card9s, this.card6d, this.card4c, this.card2d, this.card4h];
    let myHand:Hand = new Hand([this.cardAd, this.cardKh].concat(communityCards));
    let oHand:Hand = new Hand([this.card5d, this.card7s].concat(communityCards));
    assert(myHand.compareWith(oHand) > 0);
  }

}
