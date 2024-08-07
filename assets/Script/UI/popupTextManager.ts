import { _decorator, Component, Node, Prefab, Vec3, Label, instantiate } from 'cc';
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

    popupTextRender(text: string | number, position: Vec3, textType: POPUP_TEXT_TYPE) {
        const popupTextNode = instantiate(this.damagePopupText);
        popupTextNode.getChildByName('label').getComponent(Label).string = text.toString();
        // popupTextNode.setWorldPosition(position);

        popupTextNode.setParent(this.node.getChildByName('PopupText'));
        // 添加随机曲线动画
        popupTextNode.setPosition(position.x + Math.random() * 10, position.y + Math.random() * 10 + 15, position.z);

        // 消失时间
        setTimeout(() => {
            popupTextNode.destroy();
        }, 1000)
    }
}


