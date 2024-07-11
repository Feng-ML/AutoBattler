import { _decorator, Component, Node, ProgressBar } from 'cc';
const { ccclass, property } = _decorator;

import { CHESS_TYPE } from '../../enum/chess';

@ccclass('chessAttr')
export class chessAttr extends Component {

    @property
    chessName: string = '棋子名称';

    chessType: CHESS_TYPE = CHESS_TYPE.player;

    @property
    cost: number = 1;

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

    isOnBoard: boolean = false; // 是否在棋盘上

    protected start(): void {
        this.HPBar = this.node.getChildByPath('UI/chessStatus/HPBar').getComponentInChildren(ProgressBar);
        this.MPBar = this.node.getChildByPath('UI/chessStatus/MPBar').getComponentInChildren(ProgressBar);
        this.starNode = this.node.getChildByPath('UI/chessStatus/starBox');
        this.init()
    }

    init() {
        this.currentHP = this.HP
        this.currentMP = 0
        this.attackTimer = 0
        this.MPTimer = 0
    }
}


