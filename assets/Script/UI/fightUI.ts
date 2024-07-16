import { _decorator, Component, Node, Vec3, tween, Widget } from 'cc';
const { ccclass, property } = _decorator;

import EventManager from '../runtime/EventManager';
import { EVENT_NAME_GAME_LEVEL, gameStartAnimationSeconds } from '../enum/game';
import { GAME_LEVEL_TYPE } from '../runtime/GameLevelManager';

@ccclass('fightUI')
export class fightUI extends Component {

    @property(Node)
    bottomNode: Node = null;

    @property(Node)
    rightNode: Node = null;

    start() {
        EventManager.on(EVENT_NAME_GAME_LEVEL.GAME_LEVEL_START, (levelType: GAME_LEVEL_TYPE) => {
            this.rightNode.setPosition(new Vec3(600, 0, 0));
            this.bottomNode.active = true;
            this.rightNode.children.forEach(node => {
                node.active = false;
            })
            this.bottomNode.getChildByName('BeginBtn').active = false;
            this.bottomNode.getChildByName('NextBtn').active = false;
            if (levelType === GAME_LEVEL_TYPE.FIGHT) {
                this.rightNode.getChildByName('Chessboard-enemy').active = true;
                this.bottomNode.getChildByName('BeginBtn').active = true;
            } else if (levelType === GAME_LEVEL_TYPE.SHOP) {
                this.rightNode.getChildByName('shop').active = true;
                this.bottomNode.getChildByName('NextBtn').active = true;
            } else {
                this.bottomNode.getChildByName('NextBtn').active = true;
            }
            tween(this.rightNode).to(gameStartAnimationSeconds, { position: new Vec3() }).start()
        })
        EventManager.on(EVENT_NAME_GAME_LEVEL.GAME_LEVEL_RUNNING, () => {
            this.bottomNode.active = false;
        })
        EventManager.on(EVENT_NAME_GAME_LEVEL.GAME_LEVEL_END, () => {
            this.bottomNode.active = false;
        })
    }
}


