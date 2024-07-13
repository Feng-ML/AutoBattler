import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;


interface equipInfo {
    prefab: Prefab;
    node: Node;
}

@ccclass('equipManager')
export class equipManager extends Component {

    equipSet: Set<equipInfo> = new Set();   // 所有装备

    @property(Node)
    equipListNode: Node = null;     // 装备显示列表

    start() {
        this.renderEquip()
    }


    addEquip(equipPrefab: Prefab) {
        let equipInfo = {
            prefab: equipPrefab,
            node: null
        }
        this.equipSet.add(equipInfo)
        this.renderEquip()
    }

    renderEquip() {
        this.equipListNode.removeAllChildren()
        this.equipSet.forEach((element) => {
            const equipNode = instantiate(element.prefab);
            this.equipListNode.addChild(equipNode)
        })
    }
}


