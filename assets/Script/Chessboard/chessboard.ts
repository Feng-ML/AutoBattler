import { _decorator, Component, Node, find, Vec3, EventMouse, Input, input } from 'cc';
const { ccclass, property } = _decorator;

import { chessBase } from '../chesses/chessBase';

@ccclass('chessboard')
export class chessboard extends Component {

    @property({ type: Node, tooltip: '对手棋盘' })
    enemyChessboard: Node;

    start() {

    }

    update(deltaTime: number) {

    }

    // 寻找最近可攻击目标
    findNearestTarget(chessIndex: number): Node | null | undefined {
        let rowIndex = chessIndex % 3
        // const cellNumber = this.enemyChessboard.children.length

        let enemy: Node = find('chess', this.enemyChessboard.children[rowIndex])

        if (!enemy) {
            enemy = this.enemyChessboard.getComponentInChildren(chessBase)?.node
        }

        return enemy
    }
}