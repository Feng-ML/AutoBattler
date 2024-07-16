import { _decorator, Component, find, Input } from 'cc';
const { ccclass, property } = _decorator;

import { GAME_LEVEL_TYPE, GameLevelManager } from '../runtime/GameLevelManager';
import EventManager from '../runtime/EventManager';
import { EVENT_NAME_GAME_LEVEL } from '../enum/game';

@ccclass('gameLevelSelect')
export class gameLevelSelect extends Component {

    gameLevelManager: GameLevelManager = null;

    start() {
        this.gameLevelManager = find('Canvas').getComponent(GameLevelManager)
        this.registerEvent()
        this.node.active = false;
        EventManager.on(EVENT_NAME_GAME_LEVEL.GAME_LEVEL_END, () => {
            this.showOptions()
            this.node.active = true;
        })
    }


    registerEvent() {
        this.node.children.forEach((child, index) => {
            child.on(Input.EventType.TOUCH_END, () => {
                const map = {
                    'relic': GAME_LEVEL_TYPE.RELIC,
                    'fight': GAME_LEVEL_TYPE.FIGHT,
                    'blacksmith': GAME_LEVEL_TYPE.BLACKSMITH,
                    'shop': GAME_LEVEL_TYPE.SHOP
                }
                this.gameLevelManager.nextLevelSelect(map[child.name])
                this.node.active = false
            })
        })
    }

    // 随机显示两个关卡
    showOptions() {
        let selected = [];
        while (selected.length < 2) {
            const index = Math.floor(Math.random() * this.node.children.length);
            if (!selected.includes(index)) {
                selected.push(index);
            }
        }
        this.node.children.forEach((child, index) => {
            child.active = selected.includes(index);
        })
    }
}


