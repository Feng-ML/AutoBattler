import { _decorator, Component, Node, Prefab, Label, Sprite, Input, ProgressBar, EventMouse, Color, find } from 'cc';
const { ccclass, property } = _decorator;

import { equipBase } from '../equip/equipBase';
import { equipManager } from '../equip/equipManager';
import GameManager from '../runtime/GameManager';
import EventManager from '../runtime/EventManager';
import { EVENT_NAME_GAME_LEVEL } from '../enum/game';
import { EVENT_NAME_EQUIP } from '../enum/equip';
import { withinTarget } from '../commom';

@ccclass('equipShopManager')
export class equipShopManager extends Component {

    @property([Prefab])
    equipList: Prefab[] = [];

    @property(Node)
    shopListNode: Node = null

    @property(Node)
    sellBoxNode: Node = null

    @property(Node)
    sellCostNode: Node = null

    private equipManager: equipManager = null
    private shopList: Prefab[] = []

    start() {
        this.equipManager = find('Canvas').getComponent(equipManager)
        this.sellCostNode.active = false

        this.init()
        this.loadShopItem()
    }

    // 加载商店物品
    loadShopItem() {
        this.shopList = []
        this.shopListNode.children.forEach((item, index) => {
            // 刷新随机棋子
            const i = Math.floor(Math.random() * this.equipList.length)
            const prefab = this.equipList[i]
            item.getChildByName('img').getComponent(Sprite).spriteFrame = prefab.data.getComponent(Sprite).spriteFrame
            item.getChildByName('cost').getComponentInChildren(Label).string = prefab.data.getComponent(equipBase).cost
            item.children.forEach(child => {
                child.active = true
            })
            this.shopList.push(prefab)
        })
    }

    init() {
        // 点击事件
        this.shopListNode.children.forEach((item, index) => {
            // 购买
            item.on(Input.EventType.TOUCH_END, () => {
                const Prefab = this.shopList[index]
                if (!Prefab) return

                const cost = Prefab.data.getComponent(equipBase).cost
                if (cost <= GameManager.playerCoin) {
                    this.equipManager.addEquip(Prefab)
                    GameManager.coinChange(-cost)
                    item.children.forEach(child => {
                        child.active = false
                    })
                    this.shopList[index] = null
                }
            })
        })


        EventManager.on(EVENT_NAME_GAME_LEVEL.GAME_LEVEL_START, () => {
            this.loadShopItem()
        })

        EventManager.on(EVENT_NAME_EQUIP.EQUIP_TOUCH_START, (event: EventMouse, equipNode: Node) => {
            this.sellCostNode.active = true
            this.sellCostNode.getComponentInChildren(Label).string = equipNode.getComponent(equipBase).cost.toString()
        })

        EventManager.on(EVENT_NAME_EQUIP.EQUIP_TOUCH_END, (event: EventMouse, equipNode: Node) => {
            if (withinTarget(this.sellBoxNode, event)) {
                GameManager.coinChange(equipNode.getComponent(equipBase).cost)
                this.equipManager.removeEquip(equipNode)
            }
            this.sellCostNode.active = false
        })
    }
}
