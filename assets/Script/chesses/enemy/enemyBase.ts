import { _decorator, Component, Node } from 'cc';
import { chessBase } from '../base/chessBase';
const { ccclass, property } = _decorator;

@ccclass('enemyBase')
export class enemyBase extends chessBase {

    override _registerChessDrag(): void { }
}


