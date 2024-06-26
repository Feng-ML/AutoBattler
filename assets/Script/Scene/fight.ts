import { _decorator, Component, Node, Input, Vec3, EventMouse } from 'cc';
const { ccclass, property } = _decorator;

import { chessBase } from '../chesses/base/chessBase';

@ccclass('fight')
export class fight extends Component {

    // 当前选中的棋子
    handleChess: chessBase = null;

    start() {
        // // 拖拽棋子
        // this.node.on(Input.EventType.MOUSE_DOWN, (event: EventMouse) => {
        //     console.log(event.target);

        //     let chess = event.target.getComponentInChildren(chessBase)
        //     if (chess) {
        //         this.handleChess = chess
        //     }
        // })
        // this.node.on(Input.EventType.MOUSE_MOVE, (event: EventMouse) => {

        //     if (this.handleChess) {
        //         this.handleChess.node.setWorldPosition(new Vec3(event.getUILocationX(), event.getUILocationY(), 0))
        //     }
        // })
        // this.node.on(Input.EventType.MOUSE_UP, (event) => {
        //     if (this.handleChess) {
        //         this.handleChess = null
        //     }
        // })
    }

    update(deltaTime: number) {

    }
}


