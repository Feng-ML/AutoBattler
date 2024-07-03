import { _decorator, Component, Node, ProgressBar } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('chessAttr')
export class chessAttr extends Component {

    @property
    chessName: string = '棋子名称';

    // 星级
    private _star: number = 1;
    starNode: Node = null;
    set star(value: number) {
        this._star = value;
        const child = this.starNode.children
        child.forEach((element, index) => {
            element.active = index === value - 1;
        });
    }
    get star() {
        return this._star;
    }

    // 生命值
    @property
    HP: number = 100;
    private _currentHP: number = 0;
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
    protected attackTimer: number = 0; // 添加攻击计时器

    // 魔法值
    @property
    MP: number = 30;
    private _currentMP: number = 0;
    protected MPTimer: number = 0;
    MPBar: ProgressBar = null;
    get currentMP() {
        return this._currentMP;
    }
    set currentMP(value: number) {
        this._currentMP = value;
        this.MPBar.progress = value / this.MP;
    }

    // 攻击力
    @property
    ATK: number = 10;

    protected start(): void {
        this.HPBar = this.node.getChildByPath('chessStatus/HPBar').getComponent(ProgressBar);
        this.MPBar = this.node.getChildByPath('chessStatus/MPBar').getComponent(ProgressBar);
        this.starNode = this.node.getChildByPath('chessStatus/starBox');
        this.currentHP = this.HP
    }
}


