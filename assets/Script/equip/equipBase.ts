import { _decorator, Component, Input, find, Vec3, EventMouse } from 'cc';
const { ccclass, property } = _decorator;

import { GameLevelManager } from '../runtime/GameLevelManager';
import EventManager from '../runtime/EventManager';
import { EVENT_NAME_EQUIP } from '../enum/equip';

@ccclass('equipBase')
export class equipBase extends Component {
    // 游戏关卡管理器
    gameLevelManager: GameLevelManager = null

    start() {
        this.gameLevelManager = find('Canvas').getComponent(GameLevelManager)

        this._registerChessDrag()
    }


    // 注册拖拽事件
    protected _registerChessDrag() {
        this.node.on(Input.EventType.TOUCH_START, (event: EventMouse) => {
            if (this.gameLevelManager.isRunning()) return
            EventManager.emit(EVENT_NAME_EQUIP.EQUIP_TOUCH_START, event)
        })
        this.node.on(Input.EventType.TOUCH_MOVE, (event: EventMouse) => {
            if (this.gameLevelManager.isRunning()) return
            const location = event.getUILocation();
            this.node.setWorldPosition(new Vec3(location.x, location.y, 0))
        })
        this.node.on(Input.EventType.TOUCH_END, (event: EventMouse) => {
            if (this.gameLevelManager.isRunning()) return
            EventManager.emit(EVENT_NAME_EQUIP.EQUIP_TOUCH_END, event)
        })
        this.node.on(Input.EventType.TOUCH_CANCEL, (event: EventMouse) => {
            if (this.gameLevelManager.isRunning()) return
            EventManager.emit(EVENT_NAME_EQUIP.EQUIP_TOUCH_END, event)
        })
    }
}


