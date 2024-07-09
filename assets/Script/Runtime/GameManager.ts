import { EVENT_NAME_PLAYER } from "../enum/game";
import EventManager from "./EventManager";

class GameManager {
  //玩家金币
  playerCoin: number = 10;

  playerHP: number = 100;
  playerMaxHP: number = 100;

  coinChange(coin: number) {
    if (coin < 0 && this.playerCoin < -coin) return false;
    this.playerCoin += coin;
    EventManager.emit(EVENT_NAME_PLAYER.PLAYER_COIN_CHANGE, this.playerCoin);
    return true;
  }

  hpChange(hp: number) {
    this.playerHP += hp;
    if (this.playerHP < 0) this.playerHP = 0;
    if (this.playerHP > this.playerMaxHP) this.playerHP = this.playerMaxHP;
    EventManager.emit(EVENT_NAME_PLAYER.PLAYER_HP_CHANGE, this.playerHP, this.playerMaxHP);
  }
}

export default new GameManager();