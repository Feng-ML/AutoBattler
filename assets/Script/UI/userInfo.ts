import { _decorator, Component, Label, ProgressBar } from 'cc';
const { ccclass, property } = _decorator;

import EventManager from '../runtime/EventManager';
import { EVENT_NAME_PLAYER } from '../enum/game';
import GameManager from '../runtime/GameManager';

@ccclass('userInfo')
export class userInfo extends Component {

    @property(Label)
    userHp: Label = null;
    @property(ProgressBar)
    userHpBar: ProgressBar = null;

    @property(Label)
    userCoin: Label = null;


    start() {
        this.userCoin.string = GameManager.playerCoin.toString();
        this.userHp.string = GameManager.playerHP + " / " + GameManager.playerMaxHP;

        EventManager.on(EVENT_NAME_PLAYER.PLAYER_COIN_CHANGE, (coin: number) => {
            this.userCoin.string = coin.toString();
        })
        EventManager.on(EVENT_NAME_PLAYER.PLAYER_HP_CHANGE, (hp: number, maxHp: number) => {
            this.userHp.string = hp + " / " + maxHp;
            this.userHpBar.progress = hp / maxHp;
        })
    }
}


