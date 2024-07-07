import { _decorator, Component, Node, Animation, AnimationState } from 'cc';
const { ccclass, property } = _decorator;
import { CHESS_STATE } from '../../enum/chess';

// 棋子状态机
@ccclass('chessFSM')
export default class chessFSM extends Component {

  anim: Animation;

  curState: CHESS_STATE = CHESS_STATE.idle;

  start(): void {
    this.anim = this.getComponent(Animation);
    // @ts-ignore
    this.anim.on("finished", this.onFinished, this)
  }

  changeState(stateID: CHESS_STATE) {
    this.curState = stateID;
    switch (stateID) {
      case CHESS_STATE.skill:
        this.anim.play('skill');
        break;
      case CHESS_STATE.attack:
        this.anim.play('attack');
      default:
        break;
    }
  }

  // 动画播放结束
  onFinished() {
    switch (this.curState) {
      case CHESS_STATE.skill:
      case CHESS_STATE.attack:
        this.changeState(CHESS_STATE.idle);
        break;
      default:
        break;
    }
  }
}