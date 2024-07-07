import { instantiate } from 'cc';
import { Label } from 'cc';
import { Vec3 } from 'cc';
import { Prefab } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export enum POPUP_TEXT_TYPE {
    damage,
    heal,
    criticalDamage  // 暴击
}

@ccclass('popupTextManager')
export class popupTextManager extends Component {

    @property(Prefab)
    damagePopupText: Prefab = null;

    @property(Prefab)
    healPopupText: Prefab = null;

    @property(Prefab)
    criticalDamagePopupText: Prefab = null;


    start() {

    }

    update(deltaTime: number) {

    }


    popupTextRender(text: string | number, position: Vec3, textType: POPUP_TEXT_TYPE) {
        const popupTextNode = instantiate(this.damagePopupText);
        popupTextNode.getChildByName('label').getComponent(Label).string = text.toString();
        // popupTextNode.setWorldPosition(position);

        popupTextNode.setParent(this.node.getChildByName('popupText'));
        // 添加随机曲线动画
        popupTextNode.setPosition(position.x + Math.random() * 10, position.y + Math.random() * 10 + 15, position.z);

        // 消失时间
        setTimeout(() => {
            popupTextNode.destroy();
        }, 1000)
    }
}


