import { _decorator, Component, Vec3, ProgressBar, Input, EventMouse, input } from 'cc';
const { ccclass, property } = _decorator;

import chessFSM from './chessFSM';
import { chessState, EVENT_NAME_CHESS } from '../Enum/chess';
import { chessboard } from '../Chessboard/chessboard';
import EventManager from '../Runtime/EventManager';


// 棋子基类
@ccclass('chessBase')
export class chessBase extends Component {

    // 状态机
    fsmManager: chessFSM;

    // 生命值
    HP: number = 100;
    private _currentHP: number = 0;
    @property(ProgressBar)
    HPBar: ProgressBar = null;
    set currentHP(value: number) {
        this._currentHP = value;
        this.HPBar.progress = value / this.HP;
    }
    get currentHP() {
        return this._currentHP;
    }

    // 攻击速度
    attackSpeed: number = 5;
    private attackTimer: number = 0; // 添加攻击计时器

    // 魔法值
    MP: number = 30;
    private _currentMP: number = 0;
    private MPTimer: number = 0;
    @property(ProgressBar)
    MPBar: ProgressBar = null;
    get currentMP() {
        return this._currentMP;
    }
    set currentMP(value: number) {
        this._currentMP = value;
        this.MPBar.progress = value / this.MP;
    }

    // 攻击力
    ATK: number = 10;

    // 当前选中的棋子
    handleChess: chessBase = null;

    protected start() {
        this.init()
        this.registerChessDrag()
    }

    protected update(deltaTime: number) {
        if (this.fsmManager.curState === chessState.death) return;

        // 累积攻击计时器
        if (this.fsmManager.curState === chessState.idle) this.attackTimer += deltaTime;
        // 计算每次攻击所需的时间间隔
        const attackInterval = 1.0 / this.attackSpeed;
        // 当累积时间足够执行一次攻击时
        if (this.attackTimer >= attackInterval) {
            // this.attack();
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

    init() {
        this.fsmManager = this.getComponent(chessFSM)
        this.currentHP = this.HP
    }

    // 注册棋子拖拽事件
    registerChessDrag() {
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
        const nodeIndex = this.node.parent.getSiblingIndex()
        const Chessboard = this.node.parent.parent.getComponent(chessboard)

        const enemy = Chessboard.findNearestTarget(nodeIndex)
        if (enemy) {
            this.fsmManager.changeState(chessState.attack)
            const chess = enemy.getComponent(chessBase)
            chess.takeDamage(this.ATK)
        }
    }

    // 释放技能
    releaseSkill() {
        // this.fsmManager.changeState(chessState.skill)
    }

    die() {
        this.fsmManager.changeState(chessState.death)
        // this.node.destroy()
    }
}


