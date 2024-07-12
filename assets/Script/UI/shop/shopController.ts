import { _decorator, Component, Node, Prefab, Label, Sprite, Input, ProgressBar, EventMouse, Color } from 'cc';
const { ccclass, property } = _decorator;

import { chessBase } from '../../chesses/base/chessBase';
import { chessController } from '../../chesses/base/chessController';
import GameManager from '../../runtime/GameManager';
import EventManager from '../../runtime/EventManager';
import { EVENT_NAME_CHESS } from '../../enum/chess';
import { EVENT_NAME_PLAYER } from '../../enum/game';

@ccclass('shopController')
export class shopController extends Component {

    @property([Prefab])
    chessList1: Prefab[] = [];

    @property(chessController)
    chessController: chessController = null;


    private _shopList: Prefab[] = []
    private _shopListNode: Node = null

    private _shopBar: ProgressBar = null
    private _shopLvLabel: Label = null
    private _shopExpLabel: Label = null
    private _sellBoxNode: Node = null

    private shopLevel: number = 1   // 当前等级
    private shopCurEXP: number = 0  // 当前经验
    private shopMaxEXP: number = 0  // 升级所需经验
    private shopEXPList: number[] = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]   // 升级所需经验


    start() {
        this._shopListNode = this.node.getChildByName('shopList')
        this._shopBar = this.node.getChildByName('shopBar').getComponentInChildren(ProgressBar)
        this._shopExpLabel = this.node.getChildByName('shopBar').getComponentInChildren(Label)
        this._shopLvLabel = this.node.getChildByName('shopLv').getComponentInChildren(Label)
        this._sellBoxNode = this.node.getChildByName('sellBox')


        this.init()
        this.loadShopChess()
    }

    private init() {
        this.shopLevel = 1
        this.shopCurEXP = 0
        this.shopMaxEXP = this.shopEXPList[this.shopLevel - 1]

        this._renderShopInfo()

        // 棋子点击事件
        this._shopListNode.children.forEach((item, index) => {
            // 购买
            item.on(Input.EventType.TOUCH_END, () => {
                const Prefab = this._shopList[index]
                if (!Prefab) return

                const cost = Prefab.data.getComponent(chessBase).cost
                if (cost <= GameManager.playerCoin && this.chessController.addChess(Prefab)) {
                    GameManager.coinChange(-cost)

                    item.children.forEach(child => {
                        child.active = false
                    })
                    this._shopList[index] = null
                }
            })
        })

        // 棋子出售
        EventManager.on(EVENT_NAME_CHESS.CHESS_TOUCH_START, (event: EventMouse, chess: Node) => {
            this._sellBoxNode.active = true
            this._shopListNode.active = false
            // 获取出售价格
            const cost = this._getCost(chess)
            this._sellBoxNode.getChildByPath('content/number').getComponent(Label).string = cost.toString()
        })
        EventManager.on(EVENT_NAME_CHESS.CHESS_TOUCH_END, (event: EventMouse, chess: Node) => {
            this._sellBoxNode.active = false
            this._shopListNode.active = true
        })

        EventManager.on(EVENT_NAME_PLAYER.PLAYER_COIN_CHANGE, (coin: number) => {
            this._renderColor()
        });

    }

    sell(chess: Node) {
        GameManager.coinChange(this._getCost(chess))
    }

    // 加载商店棋子
    loadShopChess() {
        this._shopList = []
        this._shopListNode.children.forEach((item, index) => {
            // 刷新随机棋子
            const i = Math.floor(Math.random() * this.chessList1.length)
            const chessPrefab = this.chessList1[i]
            item.getChildByName('avatar').getComponent(Sprite).spriteFrame = chessPrefab.data.getChildByName('UI').getComponent(Sprite).spriteFrame
            item.getChildByName('name').getComponent(Label).string = chessPrefab.data.getComponent(chessBase).chessName
            item.getChildByName('cost').getComponentInChildren(Label).string = chessPrefab.data.getComponent(chessBase).cost
            item.children.forEach(child => {
                child.active = true
            })
            this._shopList.push(chessPrefab)
        })
        this._renderColor()
    }

    // 升级
    upgrade() {
        if (GameManager.playerCoin < 4) return

        GameManager.coinChange(-4)
        this.shopCurEXP += 4
        if (this.shopCurEXP >= this.shopMaxEXP) {
            this.shopLevel++
            this.shopCurEXP -= this.shopMaxEXP
            this.shopMaxEXP = this.shopEXPList[this.shopLevel - 1]
        }

        this._renderShopInfo()
    }

    // 刷新
    refresh() {
        if (GameManager.playerCoin < 1) return
        GameManager.coinChange(-1)
        this.loadShopChess()
    }

    // 渲染UI
    private _renderShopInfo() {
        this._shopLvLabel.string = this.shopLevel.toString()
        this._shopBar.progress = this.shopCurEXP / this.shopMaxEXP
        this._shopExpLabel.string = this.shopCurEXP + ' / ' + this.shopMaxEXP
    }

    // 渲染商店棋子颜色
    private _renderColor() {
        this._shopListNode.children.forEach((item, index) => {
            const cost = parseInt(item.getChildByName('cost').getComponentInChildren(Label).string)
            if (cost > GameManager.playerCoin) {
                item.getComponent(Sprite).color = new Color('#909399')
            } else {
                const colorMap = ['#1a2a3a', '#163f30', '#202d57', '#5d0e54', '#8a5c0a']
                item.getComponent(Sprite).color = new Color(colorMap[cost - 1])
            }
        })
    }

    private _getCost(chess: Node) {
        return chess.getComponent(chessBase).cost * 3 ** (chess.getComponent(chessBase).star - 1)
    }
}


