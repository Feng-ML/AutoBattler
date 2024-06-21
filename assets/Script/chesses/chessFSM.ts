import { _decorator, Component, Node, Animation, AnimationState } from 'cc';
const { ccclass, property } = _decorator;
import { chessState } from '../Enum/chess';

// 棋子状态机
@ccclass('chessFSM')
export default class chessFSM extends Component {

  anim: Animation;

  curState: chessState = chessState.idle;

  start(): void {
    this.anim = this.getComponent(Animation);
    // @ts-ignore
    this.anim.on("finished", this.onFinished, this)
  }

  changeState(stateID: chessState) {
    this.curState = stateID;
    switch (stateID) {
      case chessState.skill:
        this.anim.play('skill');
        break;
      case chessState.attack:
        this.anim.play('attack');
      default:
        break;
    }
  }

  // 动画播放结束
  onFinished() {
    switch (this.curState) {
      case chessState.skill:
      case chessState.attack:
        this.changeState(chessState.idle);
        break;
      default:
        break;
    }
  }
}