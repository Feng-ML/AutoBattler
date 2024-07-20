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
        const equipInfo = {
            prefab: equipPrefab,
            node: null
        }
        const equipNode = instantiate(equipPrefab);
        equipInfo.node = equipNode;
        this.equipSet.add(equipInfo)
        this.equipListNode.addChild(equipNode)
    }

    renderEquip() {
        this.equipListNode.removeAllChildren()
        this.equipSet.forEach((element) => {
            const equipNode = instantiate(element.prefab);
            this.equipListNode.addChild(equipNode)
        })
    }

    removeEquip(equipNode: Node) {
        this.equipSet.forEach((element) => {
            if (element.node === equipNode) {
                this.equipSet.delete(element)
                equipNode.destroy()
            }
        })
    }
}


