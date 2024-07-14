import { _decorator, Component, Node, Vec3, tween, Widget } from 'cc';
const { ccclass, property } = _decorator;

import EventManager from '../runtime/EventManager';
import { EVENT_NAME_GAME_LEVEL, gameStartAnimationSeconds } from '../enum/game';

@ccclass('fightUI')
export class fightUI extends Component {

    @property(Node)
    bottomNode: Node = null;

    @property(Node)
    rightNode: Node = null;

    start() {
        EventManager.on(EVENT_NAME_GAME_LEVEL.GAME_LEVEL_START, () => {
            this.bottomNode.active = true;
            tween(this.rightNode).to(0, { position: new Vec3(600, 0, 0) }).to(gameStartAnimationSeconds, { position: new Vec3() }).start()
        })
        EventManager.on(EVENT_NAME_GAME_LEVEL.GAME_LEVEL_RUNNING, () => {
            this.bottomNode.active = false;
        })
    }
}


