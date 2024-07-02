import { _decorator, Component, Node, Prefab, Label, Sprite, Input } from 'cc';
const { ccclass, property } = _decorator;

import { shopItem } from './shopItem';
import { chessBase } from '../chesses/base/chessBase';
import { chessController } from '../chesses/base/chessController';

@ccclass('shopController')
export class shopController extends Component {

    @property([Prefab])
    chessList1: Prefab[] = [];

    @property(chessController)
    chessController: chessController = null;


    private _shopList: Prefab[] = []
    private _shopItemNodeList: shopItem[] = []


    start() {
        this._shopItemNodeList = this.node.getComponentsInChildren(shopItem)
        this.loadShopChess()

        this._shopItemNodeList.forEach((item, index) => {
            // 购买
            item.node.on(Input.EventType.TOUCH_END, () => {
                if (this._shopList[index] && this.chessController.addChess(this._shopList[index])) {
                    item.node.children.forEach(child => {
                        child.active = false
                    })
                    this._shopList[index] = null
                }
            })
        })
    }

    update(deltaTime: number) {

    }

    // 加载商店棋子
    loadShopChess() {
        this._shopList = []
        this._shopItemNodeList.forEach((item, index) => {
            // 刷新随机棋子
            const i = Math.floor(Math.random() * this.chessList1.length)
            const chess = this.chessList1[i]
            item.node.getChildByName('avatar').getComponent(Sprite).spriteFrame = chess.data.getComponent(Sprite).spriteFrame
            item.node.getChildByPath('name').getComponent(Label).string = chess.data.getComponent(chessBase).chessName
            item.node.children.forEach(child => {
                child.active = true
            })
            this._shopList.push(chess)
        })
    }
}


