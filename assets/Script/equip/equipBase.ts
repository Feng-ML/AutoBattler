import { _decorator, Component, Input, find, Vec3, EventMouse } from 'cc';
const { ccclass, property } = _decorator;

import { GameLevelManager } from '../runtime/GameLevelManager';
import EventManager from '../runtime/EventManager';
import { EVENT_NAME_EQUIP } from '../enum/equip';
import { chessController } from '../chesses/base/chessController';
import { withinTarget } from '../commom';
import { equipManager } from './equipManager';

@ccclass('equipBase')
export class equipBase extends Component {
    // 游戏关卡管理器
    gameLevelManager: GameLevelManager = null
    equipManager: equipManager = null
    chessController: chessController = null

    @property
    cost: number = 20

    start() {
        this.gameLevelManager = find('Canvas').getComponent(GameLevelManager)
        this.chessController = find('Canvas').getComponent(chessController)
        this.equipManager = find('Canvas').getComponent(equipManager)

        this._registerChessDrag()
    }


    // 注册拖拽事件
    protected _registerChessDrag() {
        this.node.on(Input.EventType.TOUCH_START, (event: EventMouse) => {
            if (this.gameLevelManager.isRunning()) return
            event.propagationStopped = true
            EventManager.emit(EVENT_NAME_EQUIP.EQUIP_TOUCH_START, event, this.node)
        })
        this.node.on(Input.EventType.TOUCH_MOVE, (event: EventMouse) => {
            if (this.gameLevelManager.isRunning()) return
            event.propagationStopped = true
            const location = event.getUILocation();
            this.node.setWorldPosition(new Vec3(location.x, location.y, 0))
        })
        this.node.on(Input.EventType.TOUCH_END, (event: EventMouse) => {
            if (this.gameLevelManager.isRunning()) return
            event.propagationStopped = true
            EventManager.emit(EVENT_NAME_EQUIP.EQUIP_TOUCH_END, event, this.node)
            this.equipMove(event)
        })
        this.node.on(Input.EventType.TOUCH_CANCEL, (event: EventMouse) => {
            if (this.gameLevelManager.isRunning()) return
            event.propagationStopped = true
            EventManager.emit(EVENT_NAME_EQUIP.EQUIP_TOUCH_END, event, this.node)
            this.equipMove(event)
        })
    }

    equipMove(event: EventMouse) {
        const chessSet = this.chessController.chessSet
        let inTarget = false
        chessSet.forEach(element => {
            if (withinTarget(element.node, event)) {
                const equipList = element.node.getChildByPath('UI/equipList')

                equipList.children.forEach(e => {
                    if (e.children.length === 0 && !inTarget) {
                        e.addChild(this.node)
                        this.node.setPosition(0, 0, 0)
                        inTarget = true
                    }
                });
            }
        });

        if (!inTarget) {
            this.node.setPosition(0, 0, 0)
            this.node.setParent(find('Canvas'))
            this.node.setParent(this.equipManager.equipListNode)
        }
    }
}


