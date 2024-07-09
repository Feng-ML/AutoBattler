import { _decorator, Component, Node, Prefab, Label, Sprite, Input, ProgressBar } from 'cc';
const { ccclass, property } = _decorator;

import { shopItem } from './shopItem';
import { chessBase } from '../../chesses/base/chessBase';
import { chessController } from '../../chesses/base/chessController';
import GameManager from '../../runtime/GameManager';

@ccclass('shopController')
export class shopController extends Component {

    @property([Prefab])
    chessList1: Prefab[] = [];

    @property(chessController)
    chessController: chessController = null;


    private _shopList: Prefab[] = []
    private _shopItemNodeList: shopItem[] = []

    private _shopBar: ProgressBar = null
    private _shopLvLabel: Label = null
    private _shopExpLabel: Label = null

    private shopLevel: number = 1   // 当前等级
    private shopCurEXP: number = 0  // 当前经验
    private shopMaxEXP: number = 0  // 升级所需经验
    private shopEXPList: number[] = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]   // 升级所需经验


    start() {
        this._init()
        this.loadShopChess()
    }

    private _init() {
        this._shopItemNodeList = this.node.getComponentsInChildren(shopItem)
        this._shopBar = this.node.getChildByName('shopBar').getComponentInChildren(ProgressBar)
        this._shopExpLabel = this.node.getChildByName('shopBar').getComponentInChildren(Label)
        this._shopLvLabel = this.node.getChildByName('shopLv').getComponentInChildren(Label)

        this.shopLevel = 1
        this.shopCurEXP = 0
        this.shopMaxEXP = this.shopEXPList[this.shopLevel - 1]

        this._shopInfoRender()

        // 棋子点击事件
        this._shopItemNodeList.forEach((item, index) => {
            // 购买
            item.node.on(Input.EventType.TOUCH_END, () => {
                const Prefab = this._shopList[index]
                if (!Prefab) return

                const cost = Prefab.data.getComponent(chessBase).cost
                if (cost <= GameManager.playerCoin && this.chessController.addChess(Prefab)) {
                    GameManager.coinChange(-cost)

                    item.node.children.forEach(child => {
                        child.active = false
                    })
                    this._shopList[index] = null
                }
            })
        })
    }


    // 加载商店棋子
    loadShopChess() {
        this._shopList = []
        this._shopItemNodeList.forEach((item, index) => {
            // 刷新随机棋子
            const i = Math.floor(Math.random() * this.chessList1.length)
            const chessPrefab = this.chessList1[i]
            item.node.getChildByName('avatar').getComponent(Sprite).spriteFrame = chessPrefab.data.getChildByName('UI').getComponent(Sprite).spriteFrame
            item.node.getChildByName('name').getComponent(Label).string = chessPrefab.data.getComponent(chessBase).chessName
            item.node.getChildByName('cost').getComponentInChildren(Label).string = chessPrefab.data.getComponent(chessBase).cost
            item.node.children.forEach(child => {
                child.active = true
            })
            this._shopList.push(chessPrefab)
        })
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

        this._shopInfoRender()
    }

    // 渲染UI
    private _shopInfoRender() {
        this._shopLvLabel.string = this.shopLevel.toString()
        this._shopBar.progress = this.shopCurEXP / this.shopMaxEXP
        this._shopExpLabel.string = this.shopCurEXP + ' / ' + this.shopMaxEXP
    }
}


