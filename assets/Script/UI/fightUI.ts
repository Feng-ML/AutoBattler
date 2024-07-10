import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

import EventManager from '../runtime/EventManager';
import { EVENT_NAME_GAME_LEVEL } from '../enum/game';

@ccclass('fightUI')
export class fightUI extends Component {

    @property(Node)
    bottomNode: Node = null;

    start() {
        EventManager.on(EVENT_NAME_GAME_LEVEL.GAME_LEVEL_START, () => {
            this.bottomNode.active = false;
        })
    }

    update(deltaTime: number) {

    }
}


