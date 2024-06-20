import { _decorator, Component, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('chessBase')
export class chessBase extends Component {

    HP: number = 100;
    currentHP: number = 100;

    // 攻击速度
    attackSpeed: number = 5;
    private attackTimer: number = 0; // 添加攻击计时器

    // 魔法值
    MP: number = 100;
    currentMP: number = 0;

    isActive: boolean = false;
    isDeath: boolean = false;

    protected start(): void {
        this.init()
    }

    protected update(deltaTime: number) {
        if (this.isDeath && !this.isActive) return;

        // 累积攻击计时器
        this.attackTimer += deltaTime;
        // 计算每次攻击所需的时间间隔
        const attackInterval = 1.0 / this.attackSpeed;
        // 当累积时间足够执行一次攻击时
        while (this.attackTimer >= attackInterval) {
            this.attack(); // 执行攻击
            this.attackTimer -= attackInterval; // 减去这次攻击所需的时间间隔
        }
    }

    init() {
        this.isDeath = false
        this.isActive = true
        this.currentHP = this.HP
    }

    takeDamage(damage: number) {
        if (this.isDeath) return;
        if (this.currentHP <= damage) {
            this.currentHP = 0
            this.die()
        }
        else {
            this.currentHP -= damage
        }
    }

    attack() {
        if (this.isDeath) return;
        const attackInterval = 1.0 / (this.attackSpeed * 3);
        // 组件向右移动一段距离后返回
        const moveDistance = 50;
        tween(this.node)
            .by(attackInterval, { position: new Vec3(moveDistance, 0) }) // 移动到右侧
            .by(attackInterval, { position: new Vec3(-moveDistance, 0) }) // 移动到左侧
            .start()
    }

    // 释放技能
    releaseSkill() {
        if (this.isDeath) return;
        const moveDistance = 50;
        tween(this.node)
            .by(0.2, { position: new Vec3(0, moveDistance) })
            .by(0.2, { position: new Vec3(0, -moveDistance) })
            .start()
    }

    die() {
        this.isDeath = true
    }
}


