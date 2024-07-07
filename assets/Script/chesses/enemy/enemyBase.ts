import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import { chessBase } from '../base/chessBase';
import { CHESS_TYPE } from '../../enum/chess';

@ccclass('enemyBase')
export class enemyBase extends chessBase {

    chessType: CHESS_TYPE = CHESS_TYPE.enemy;
    isOnBoard: boolean = true

    override _registerChessDrag(): void { }
}


