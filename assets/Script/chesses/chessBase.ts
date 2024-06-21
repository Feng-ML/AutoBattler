import { _decorator, Component, Vec3, tween, animation } from 'cc';
const { ccclass, property } = _decorator;
import chessFSM from './chessFSM';
import { chessState } from '../Enum/chess';
import { chessboard } from '../Chessboard/chessboard';


// 棋子基类
@ccclass('chessBase')
export class chessBase extends Component {

    // 状态机
    fsmManager: chessFSM;

    HP: number = 100;
    currentHP: number = 100;

    // 攻击速度
    attackSpeed: number = 5;
    private attackTimer: number = 0; // 添加攻击计时器

    // 魔法值
    MP: number = 30;
    currentMP: number = 0;
    private MPTimer: number = 0;

    protected start(): void {
        this.init()
    }

    protected update(deltaTime: number) {
        if (this.fsmManager.curState === chessState.death) return;

        // 累积攻击计时器
        if (this.fsmManager.curState === chessState.idle) this.attackTimer += deltaTime;
        // 计算每次攻击所需的时间间隔
        const attackInterval = 1.0 / this.attackSpeed;
        // 当累积时间足够执行一次攻击时
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

    init() {
        this.fsmManager = this.getComponent(chessFSM)
        this.currentHP = this.HP
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
        this.fsmManager.changeState(chessState.attack)

        const nodeIndex = this.node.parent.getSiblingIndex()
        const Chessboard = this.node.parent.parent.getComponent(chessboard)
        Chessboard.findNearestTarget(nodeIndex)
    }

    // 释放技能
    releaseSkill() {
        this.fsmManager.changeState(chessState.skill)
    }

    die() {
        this.fsmManager.changeState(chessState.death)
    }
}


