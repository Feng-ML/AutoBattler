import { _decorator, Component, Node, instantiate, Prefab, Input, EventMouse, Vec3, Vec2, UITransform } from 'cc';
const { ccclass, property } = _decorator;

import { chessBase } from './chessBase';
import EventManager from '../../runtime/EventManager';
import { EVENT_NAME_CHESS } from '../../enum/chess';

enum CHESS_LOCATION {
    board,
    bag
}

interface chessInfo {
    node: Node;
    cellIndex: number;
    position?: Vec3;
    location: CHESS_LOCATION;
}

@ccclass('chessController')
export class chessController extends Component {

    @property(Node)
    chessBoardNode: Node = null;    // 棋盘
    chessListNode: Node = null;     // 所有棋子存放地方

    boardList: chessInfo[] = [{ node: null, cellIndex: 5, location: 0 }, { node: null, cellIndex: 2, location: 0 }];    // 棋盘棋子分布列表

    handleChess: chessInfo = null;       // 当前选中的棋子

    @property(Prefab)
    chessPrefab: Prefab = null;

    @property(Node)
    bagNode: Node = null;   // 背包
    bagList: chessInfo[] = [{ node: null, cellIndex: 2, location: 1 }, { node: null, cellIndex: 5, location: 1 }];    // 背包棋子分布列表

    start() {
        this.chessListNode = this.node.getChildByName("ChessList");

        this.renderChess()
        this.registerChessDrag()
    }

    update(deltaTime: number) {

    }

    // 渲染棋子
    private renderChess() {
        function setChessPos(nodeList: chessInfo[], cellListNode: Node) {
            nodeList.forEach((element, index) => {
                const chessNode = instantiate(this.chessPrefab);
                const cellList = cellListNode.children;
                const cellPos = cellList[element.cellIndex].getWorldPosition();

                chessNode.setParent(this.chessListNode);
                chessNode.setWorldPosition(cellPos);
                element.node = chessNode;
                element.position = cellPos;
            });
        }

        this.chessListNode.removeAllChildren()
        // 渲染棋盘棋子
        setChessPos.call(this, this.boardList, this.chessBoardNode)
        // 渲染备战区棋子
        setChessPos.call(this, this.bagList, this.bagNode)
    }


    // 注册棋子拖拽
    private registerChessDrag() {
        EventManager.on(EVENT_NAME_CHESS.CHESS_TOUCH_START, (event: EventMouse, chess: Node) => {
            let b = this.boardList.find(e => e?.node === chess);
            let a = this.bagList.find(e => e?.node === chess);
            this.handleChess = b || a;
        })
        // 松手后
        EventManager.on(EVENT_NAME_CHESS.CHESS_TOUCH_END, (event: EventMouse) => {
            let inTarget = false;

            // 判断是否在棋盘上
            const cellList = this.chessBoardNode.children;
            for (let i = 0; i < cellList.length; i++) {
                const cellItem = cellList[i];
                if (this._withinTarget(cellItem, event)) {
                    // 移到对应格子上
                    inTarget = true;
                    this._moveChess(CHESS_LOCATION.board, i)
                    break;
                }
            }

            // 判断是否在背包上
            if (!inTarget) {
                const bagList = this.bagNode.children;
                for (let i = 0; i < bagList.length; i++) {
                    const bagItem = bagList[i];
                    if (this._withinTarget(bagItem, event)) {
                        // 移到对应格子上
                        inTarget = true;
                        this._moveChess(CHESS_LOCATION.bag, i)
                        break;
                    }
                }
            }

            // 不在格子上返回原位置
            if (!inTarget) {
                this.handleChess.node.setWorldPosition(this.handleChess.position)
            }
            this.handleChess = null;
        })
    }

    // 判断触摸事件是否在槽位里
    private _withinTarget(targetNode: Node, touchEvent: EventMouse): boolean {
        const uiTransform = targetNode.getComponent(UITransform);
        const rect = uiTransform.getBoundingBox();  // 获取格子框

        const location = touchEvent.getUILocation();    // 触摸事件世界坐标
        const relativePoint = targetNode.parent.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(location.x, location.y));     // 转相对坐标

        return rect.contains(new Vec2(relativePoint.x, relativePoint.y))
    }

    // 获取指定格子的棋子
    private _getChessByIndex(index: number): chessInfo {
        if (this.handleChess.location === CHESS_LOCATION.bag) {
            return this.bagList.find(e => e.cellIndex === index);
        }
        return this.boardList.find(e => e.cellIndex === index);
    }

    // 移动棋子
    private _moveChess(location: CHESS_LOCATION, index: number) {
        // 棋子父级相同
        if (this.handleChess.location === location) {
            if (this.handleChess.cellIndex === index) return this.handleChess.node.setWorldPosition(this.handleChess.position);     // 相同格子
            const target = this._getChessByIndex(index);
            if (target) {
                target.cellIndex = this.handleChess.cellIndex;
            }
            this.handleChess.cellIndex = index;
        }
        // 棋子父级不同
        else {
            this.handleChess.cellIndex = index;
            this.handleChess.location = location;
            if (location === CHESS_LOCATION.bag) {
                const i = this.boardList.findIndex(e => e === this.handleChess);
                this.bagList.push(...this.boardList.splice(i, 1));
            } else {
                const i = this.bagList.findIndex(e => e === this.handleChess);
                this.boardList.push(...this.bagList.splice(i, 1));
            }
        }

        this.renderChess()
    }
}
