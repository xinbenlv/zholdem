import {suite, test} from "mocha-typescript";
import {Cards, Card, Color} from "../src/card";
import {assert} from "chai";

//noinspection BadExpressionStatementJS
@suite("Card ")
class CardTest {
  @test(" should correctly convert into number.")
  testGetNumber() {
    let card2s = new Card(Cards.card2s);
    assert(card2s.getNumber() == 0,
        `Card Spade of 2 should have number 2, but is ${card2s.getNumber()}`);
    let cardAs = new Card(Cards.cardAs);
    assert(cardAs.getNumber() == 12,
        `Card Spade of A should have number 12, but is ${cardAs.getNumber()}`);
  }

  @test(" should correctly convert into color.")
  testGetColorAndNumber() {
    let card2s = new Card(Cards.card2s);
    let cardAc = new Card(Cards.cardAc);
    let cardTh = new Card(Cards.cardTh);
    let cardJd = new Card(Cards.cardJd);
    let cardQh = new Card(Cards.cardQh);
    let cardKh = new Card(Cards.cardKh);
    assert(card2s.getColor() == Color.Spade,
        `Card Spade of 2 should have color of Spade, but is ${Color[card2s.getColor()]}`);
    assert(cardAc.getColor() == Color.Club,
        `Card Club of A should have color of Club, but is ${Color[cardAc.getColor()]}`);
    assert(card2s.getNumberStr() == '2', 'Card2s should get number str of 2.');
    assert(cardAc.getNumberStr() == 'A', 'CardAc should get number str of A.');
    assert(card2s.getColorStrShort() == 's', 'Card2s should get color str of s.');
    assert(cardAc.getColorStrShort() == 'c', 'CardAc should get color str of c.');
    assert(card2s.getNumberWithColorStr() == '2s', 'Card2s should get color str of 2s.');
    assert(cardAc.getNumberWithColorStr() == 'Ac', 'CardAc should get color str of Ac.');
    assert(cardTh.getNumberWithColorStr() == 'Th', 'CardTh should get color str of Th.');
    assert(cardJd.getNumberWithColorStr() == 'Jd', 'CardJd should get color str of Jd.');
    assert(cardQh.getNumberWithColorStr() == 'Qh', 'CardQh should get color str of Qh.');
    assert(cardKh.getNumberWithColorStr() == 'Kh', 'CardKh should get color str of Kh.');
  }
}
