import { _decorator, Component, Node } from 'cc';
import { chessBase } from '../base/chessBase';
const { ccclass, property } = _decorator;

@ccclass('enemyBase')
export class enemyBase extends chessBase {
    isOnBoard: boolean = true

    override _registerChessDrag(): void { }

    override findEnemy() {
        return this.chessController.findEnemy(this.node, 'player')
    }
}


