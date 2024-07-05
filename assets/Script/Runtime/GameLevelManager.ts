import { _decorator, Component, Node, Prefab, Label, Sprite, Input, ProgressBar } from 'cc';
const { ccclass, property } = _decorator;
import { chessController, enemyInfo } from '../chesses/base/chessController';

enum GAME_LEVEL_STATE {
  LEVEL_START,
  LEVEL_RUNNING,
  LEVEL_END,
}

// 游戏关卡管理器
@ccclass('GameLevelManager')
export class GameLevelManager extends Component {
  // 当前关卡
  private _currentLevel: number = 1;
  private _state: GAME_LEVEL_STATE = GAME_LEVEL_STATE.LEVEL_START;

  @property([Prefab])
  enemyList: Prefab[] = [];


  protected start(): void {
    const enemy: enemyInfo[] = [
      { name: 'daemon', prefab: this.enemyList[0], node: null, cellIndex: 1 },
      { name: 'daemon', prefab: this.enemyList[0], node: null, cellIndex: 3 },
      { name: 'daemon', prefab: this.enemyList[0], node: null, cellIndex: 5 },
    ]

    this.node.getComponent(chessController).renderEnemy(enemy)
  }

  isRunning(): boolean {
    return this._state === GAME_LEVEL_STATE.LEVEL_RUNNING;
  }

  begin() {
    this._state = GAME_LEVEL_STATE.LEVEL_RUNNING;
  }
}