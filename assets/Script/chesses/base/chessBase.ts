import { _decorator, Vec3, ProgressBar, Input, EventMouse, find } from 'cc';
const { ccclass, property } = _decorator;

import chessFSM from './chessFSM';
import { CHESS_STATE, EVENT_NAME_CHESS } from '../../enum/chess';
import { chessAttr } from './chessAttr';
import EventManager from '../../runtime/EventManager';
import { GameLevelManager } from '../../runtime/GameLevelManager';
import { chessController } from './chessController';
import { popupTextManager, POPUP_TEXT_TYPE } from '../../UI/popupTextManager';

// 棋子基类
@ccclass('chessBase')
export class chessBase extends chessAttr {
    // 游戏关卡管理器
    gameLevelManager: GameLevelManager = null
    // 弹出文字管理器
    popupTextManager: popupTextManager = null
    // 状态机
    fsmManager: chessFSM;
    // 棋子控制器
    chessController: chessController = null;

    protected start() {
        this.gameLevelManager = find('Canvas').getComponent(GameLevelManager)
        this.chessController = find('Canvas').getComponent(chessController)
        this.popupTextManager = find('Canvas').getComponent(popupTextManager)
        this.fsmManager = this.node.getComponent(chessFSM)
        super.start()
        this._registerChessDrag()
    }

    protected update(deltaTime: number) {
        if (this.fsmManager.curState === CHESS_STATE.death) return;

        if (this.gameLevelManager.isRunning()) {
            // 累积攻击计时器
            if (this.fsmManager.curState === CHESS_STATE.idle && this.isOnBoard) this.attackTimer += deltaTime;
            // 计算每次攻击所需的时间间隔
            const attackInterval = 1.0 / this.attackSpeed;
            if (this.attackTimer >= attackInterval) {
                this.attack();
                this.attackTimer -= attackInterval;
            }

            // 释放技能
            if (this.isOnBoard) this.MPTimer += deltaTime;
            if (this.MPTimer >= 1 && this.currentMP < this.MP) {
                this.currentMP += 10
                this.MPTimer = 0
            }
            if (this.currentMP >= this.MP && this.fsmManager.curState === CHESS_STATE.idle) {
                this.releaseSkill()
            }
        }
    }

    init() {
        this.fsmManager.changeState(CHESS_STATE.idle)
        super.init()
    }

    // 注册棋子拖拽事件
    protected _registerChessDrag() {
        this.node.on(Input.EventType.TOUCH_START, (event: EventMouse) => {
            if (this.gameLevelManager.isRunning()) return
            EventManager.emit(EVENT_NAME_CHESS.CHESS_TOUCH_START, event, this.node)
        })
        this.node.on(Input.EventType.TOUCH_MOVE, (event: EventMouse) => {
            if (this.gameLevelManager.isRunning()) return
            const location = event.getUILocation();
            this.node.setWorldPosition(new Vec3(location.x, location.y, 0))
        })
        this.node.on(Input.EventType.TOUCH_END, (event: EventMouse) => {
            if (this.gameLevelManager.isRunning()) return
            EventManager.emit(EVENT_NAME_CHESS.CHESS_TOUCH_END, event)
        })
        this.node.on(Input.EventType.TOUCH_CANCEL, (event: EventMouse) => {
            if (this.gameLevelManager.isRunning()) return
            EventManager.emit(EVENT_NAME_CHESS.CHESS_TOUCH_END, event)
        })
    }

    takeDamage(damage: number) {
        if (this.fsmManager.curState === CHESS_STATE.death) return;
        this.popupTextManager.popupTextRender(damage, this.node.getWorldPosition(), POPUP_TEXT_TYPE.damage)
        if (this.currentHP <= damage) {
            this.currentHP = 0
            this.die()
        }
        else {
            this.currentHP -= damage
        }
    }

    attack() {
        const enemy = this.chessController.findEnemy(this.node, this.chessType)
        if (enemy) {
            this.fsmManager.changeState(CHESS_STATE.attack)
            const chess = enemy.node.getComponent(chessBase)
            chess.takeDamage(this.ATK)
        }
    }

    // 释放技能
    releaseSkill() {
        const enemy = this.chessController.findEnemy(this.node, this.chessType)
        if (enemy) {
            this.currentMP = 0
            this.fsmManager.changeState(CHESS_STATE.skill)
        }
    }

    die() {
        this.fsmManager.changeState(CHESS_STATE.death)
        this.node.active = false
        EventManager.emit(EVENT_NAME_CHESS.CHESS_DIE, this.node, this.chessType)
    }
}


