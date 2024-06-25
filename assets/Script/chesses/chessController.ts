import { _decorator, Component, Node, instantiate, Prefab, Input, EventMouse, Vec3, Vec2, UITransform } from 'cc';
const { ccclass, property } = _decorator;

import { chessBase } from './chessBase';
import EventManager from '../Runtime/EventManager';
import { EVENT_NAME_CHESS } from '../Enum/chess';


interface chessInfo {
    node: Node;
    cellIndex: number;
    position?: Vec3;
}

@ccclass('chessController')
export class chessController extends Component {

    chessBoard: Node = null;    // 棋盘
    chessListNode: Node = null;
    chessList: chessInfo[] = [null, { node: null, cellIndex: null }, null, null, null, null, { node: null, cellIndex: null }];    // 棋子分布列表

    handleChess: chessInfo = null;       // 当前选中的棋子

    @property(Prefab)
    chessPrefab: Prefab = null;

    start() {
        this.chessBoard = this.node.getChildByName("Chessboard");
        this.chessListNode = this.node.getChildByName("ChessList");

        this.setChess()
        this.registerChessDrag()
    }

    update(deltaTime: number) {

    }

    // 渲染棋子
    setChess() {
        this.chessList.forEach((element, index) => {
            if (element) {
                let chessNode = instantiate(this.chessPrefab);
                const cellList = this.chessBoard.children;
                const cellPos = cellList[index].getWorldPosition();

                chessNode.setParent(this.chessListNode);
                chessNode.setWorldPosition(cellPos);
                element.node = chessNode;
                element.cellIndex = index;
                element.position = cellPos;
            }
        });
    }

    // 注册棋子拖拽
    registerChessDrag() {
        EventManager.on(EVENT_NAME_CHESS.CHESS_TOUCH_START, (event: EventMouse, chess: Node) => {
            this.handleChess = this.chessList.find(element => element?.node == chess);
        })
        // 松手后
        EventManager.on(EVENT_NAME_CHESS.CHESS_TOUCH_END, (event: EventMouse) => {
            const cellList = this.chessBoard.children;
            let inTarget = false;
            for (let i = 0; i < cellList.length; i++) {
                const cellItem = cellList[i];
                // 移到对应格子上
                if (this._withinTarget(cellItem, event) && this.chessList[i] == null) {
                    const cellPos = cellItem.getWorldPosition();
                    this.handleChess.node.setWorldPosition(cellPos)
                    this.handleChess.position = cellPos;
                    inTarget = true;

                    this.chessList[this.handleChess.cellIndex] = null;
                    this.handleChess.cellIndex = i;
                    this.chessList[i] = this.handleChess
                    break;
                }
            }

            // 不在格子上返回原位置
            if (!inTarget) {
                this.handleChess.node.setWorldPosition(this.handleChess.position)
            }
            this.handleChess = null;

            console.log(this.chessList);
        })
    }

    // 判断触摸事件是否在槽位里
    _withinTarget(targetNode: Node, touchEvent: EventMouse) {
        const uiTransform = targetNode.getComponent(UITransform);
        const rect = uiTransform.getBoundingBox();  // 获取格子框

        const location = touchEvent.getUILocation();    // 触摸事件世界坐标
        const relativePoint = this.chessBoard.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(location.x, location.y));     // 转相对坐标

        return rect.contains(new Vec2(relativePoint.x, relativePoint.y))
    }
}


