import { _decorator, Component, Node, Prefab, Label, Sprite, Input, ProgressBar } from 'cc';
const { ccclass, property } = _decorator;
import { chessController, enemyInfo } from '../chesses/base/chessController';
import EventManager from './EventManager';
import { EVENT_NAME_GAME_LEVEL, gameStartAnimationSeconds } from '../enum/game';

enum GAME_LEVEL_STATE {
  LEVEL_START,
  LEVEL_RUNNING,
  LEVEL_END,
  LEVEL_GAME_WIN,
  LEVEL_GAME_LOSE,
}

// 游戏关卡类型
export enum GAME_LEVEL_TYPE {
  RELIC = '遗物',
  GOLD = '金币',
  SHOP = '商店',
  BLACKSMITH = '铁匠',
}

// 游戏关卡管理器
@ccclass('GameLevelManager')
export class GameLevelManager extends Component {
  // 当前关卡
  private _currentLevel: number = 0;
  private _state: GAME_LEVEL_STATE = GAME_LEVEL_STATE.LEVEL_START;
  gameLevelType: GAME_LEVEL_TYPE = GAME_LEVEL_TYPE.GOLD;

  @property([Prefab])
  enemyList: Prefab[] = [];

  protected start(): void {
    this.nextLevelSelect(GAME_LEVEL_TYPE.GOLD)
  }

  isRunning(): boolean {
    return this._state === GAME_LEVEL_STATE.LEVEL_RUNNING;
  }

  begin() {
    this._state = GAME_LEVEL_STATE.LEVEL_RUNNING;
    EventManager.emit(EVENT_NAME_GAME_LEVEL.GAME_LEVEL_RUNNING, this._currentLevel);
  }

  win() {
    this._state = GAME_LEVEL_STATE.LEVEL_GAME_WIN;
    console.log('win');
    EventManager.emit(EVENT_NAME_GAME_LEVEL.GAME_LEVEL_END, this._currentLevel);
  }

  lose() {
    this._state = GAME_LEVEL_STATE.LEVEL_GAME_LOSE;
    console.log('lose');
    EventManager.emit(EVENT_NAME_GAME_LEVEL.GAME_LEVEL_END, this._currentLevel);
  }

  // 下一关
  nextLevelSelect(levelType: GAME_LEVEL_TYPE) {
    this._currentLevel++;
    this._state = GAME_LEVEL_STATE.LEVEL_START;
    this.gameLevelType = levelType;
    EventManager.emit(EVENT_NAME_GAME_LEVEL.GAME_LEVEL_START, levelType);
    setTimeout(() => {
      this.renderEnemy()
    }, gameStartAnimationSeconds * 1000);
  }

  // 渲染敌人
  private renderEnemy() {
    const enemy: enemyInfo[] = [
      { name: 'daemon', prefab: this.enemyList[0], node: null, cellIndex: 1 },
      { name: 'daemon', prefab: this.enemyList[0], node: null, cellIndex: 3 },
      { name: 'daemon', prefab: this.enemyList[0], node: null, cellIndex: 5 },
    ]

    this.node.getComponent(chessController).renderEnemy(enemy)
  }
}