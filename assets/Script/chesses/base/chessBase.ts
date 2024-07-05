import { _decorator, Component, Vec3, ProgressBar, Input, EventMouse, find } from 'cc';
const { ccclass, property } = _decorator;

import chessFSM from './chessFSM';
import { chessState, EVENT_NAME_CHESS } from '../../enum/chess';
import { chessboard } from '../../chessboard/chessboard';
import { chessAttr } from './chessAttr';
import EventManager from '../../runtime/EventManager';
import { GameLevelManager } from '../../runtime/GameLevelManager';

// 棋子基类
@ccclass('chessBase')
export class chessBase extends chessAttr {

    gameLevelManager: GameLevelManager = null
    // 状态机
    fsmManager: chessFSM;

    protected start() {
        super.start()
        this.init()
        this._registerChessDrag()
    }

    protected update(deltaTime: number) {
        if (this.fsmManager.curState === chessState.death) return;

        if (this.gameLevelManager.isRunning()) {
            // 累积攻击计时器
            if (this.fsmManager.curState === chessState.idle) this.attackTimer += deltaTime;
            // 计算每次攻击所需的时间间隔
            const attackInterval = 1.0 / this.attackSpeed;
            if (this.attackTimer >= attackInterval) {
                this.attack();
                this.attackTimer -= attackInterval;
            }

            // 释放技能
            this.MPTimer += deltaTime;
            if (this.MPTimer >= 1 && this.currentMP < this.MP) {
                this.currentMP += 10
                this.MPTimer = 0
            }
            if (this.currentMP >= this.MP && this.fsmManager.curState === chessState.idle) {
                this.releaseSkill()
                this.currentMP = 0
            }
        }
    }

    private init() {
        this.gameLevelManager = find('Canvas').getComponent(GameLevelManager)
        this.fsmManager = this.getComponent(chessFSM)
    }

    // 注册棋子拖拽事件
    protected _registerChessDrag() {
        this.node.on(Input.EventType.TOUCH_START, (event: EventMouse) => {
            EventManager.emit(EVENT_NAME_CHESS.CHESS_TOUCH_START, event, this.node)
        })
        this.node.on(Input.EventType.TOUCH_MOVE, (event: EventMouse) => {
            const location = event.getUILocation();
            this.node.setWorldPosition(new Vec3(location.x, location.y, 0))
        })
        this.node.on(Input.EventType.TOUCH_END, (event: EventMouse) => {
            EventManager.emit(EVENT_NAME_CHESS.CHESS_TOUCH_END, event)
        })
        this.node.on(Input.EventType.TOUCH_CANCEL, (event: EventMouse) => {
            EventManager.emit(EVENT_NAME_CHESS.CHESS_TOUCH_END, event)
        })
    }

    takeDamage(damage: number) {
        if (this.fsmManager.curState === chessState.death) return;
        if (this.currentHP <= damage) {
            this.currentHP = 0
            this.die()
        }
        else {
            this.currentHP -= damage
        }
    }

    attack() {
        // const nodeIndex = this.node.parent.getSiblingIndex()
        // const Chessboard = this.node.parent.parent.getComponent(chessboard)

        // const enemy = Chessboard.findNearestTarget(nodeIndex)
        // if (enemy) {
        this.fsmManager.changeState(chessState.attack)
        //     const chess = enemy.getComponent(chessBase)
        //     chess.takeDamage(this.ATK)
        // }
    }

    // 释放技能
    releaseSkill() {
        this.fsmManager.changeState(chessState.skill)
    }

    die() {
        this.fsmManager.changeState(chessState.death)
        // this.node.destroy()
    }
}


