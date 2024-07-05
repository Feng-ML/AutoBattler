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
    name: string;
    prefab: Prefab;
    node: Node;
    star: number;
    cellIndex: number;
    position?: Vec3;
    location: CHESS_LOCATION;
}

export interface enemyInfo {
    name: string;
    prefab: Prefab;
    node: Node;
    cellIndex: number;
}

@ccclass('chessController')
export class chessController extends Component {

    @property(Node)
    chessBoardNode: Node = null;    // 棋盘
    @property(Node)
    bagNode: Node = null;   // 背包
    chessShowLayer: Node[] = null;     // 所有棋子存放地方

    @property(Node)
    enemyBoardNode: Node = null;       // 敌人棋盘
    enemyShowLayer: Node[] = null;     // 所有敌人存放地方


    handleChess: chessInfo = null;       // 当前选中的棋子
    // get boardList() {
    //     return [...this.boardSet]
    // }
    chessSet: Set<chessInfo> = new Set();   // 所有棋子分布列表
    get chessList() {
        return [...this.chessSet]
    }
    get bagList() {
        return this.chessList.filter(i => i.location === CHESS_LOCATION.bag)
    }

    start() {
        this.chessShowLayer = this.node.getChildByName("ChessList").children;
        this.enemyShowLayer = this.node.getChildByName("EnemyList").children;

        this._renderChess()
        this._registerChessDrag()
    }

    // 添加棋子
    addChess(chessPrefab: Prefab) {
        if (this.bagList.length >= 9) return false

        // 寻找空位
        let cellIndex;
        for (let i = 0; i < 9; i++) {
            if (!this.bagList.some(item => item.cellIndex === i)) {
                cellIndex = i;
                break;
            }
        }

        const chessInfo: chessInfo = {
            name: chessPrefab.name,
            star: 1,
            prefab: chessPrefab,
            node: null,
            cellIndex,
            location: CHESS_LOCATION.bag
        }

        this.chessSet.add(chessInfo)
        this.mergeChess(chessInfo)
        this._renderChess()
        return true
    }

    // 合并相同星级棋子
    mergeChess(chessInfo: chessInfo) {
        if (chessInfo.star >= 3) return
        const sameChessList: chessInfo[] = []

        this.chessSet.forEach((chess) => {
            if (chess.star === chessInfo.star && chess.name === chessInfo.name) {
                sameChessList.push(chess)
            }
        })

        if (sameChessList.length >= 3) {
            sameChessList[0].star += 1
            sameChessList[0].node.getComponent(chessBase).star += 1

            // 删除其他两个
            this.chessSet.delete(sameChessList[1])
            this.chessSet.delete(sameChessList[2])

            this.mergeChess(sameChessList[0])
        }
    }

    // 渲染敌人
    renderEnemy(enemyList: enemyInfo[]) {
        this.enemyShowLayer.forEach((layer) => {
            layer.removeAllChildren()
        })

        enemyList.forEach((element) => {
            const chessNode = element.node || instantiate(element.prefab);
            const cellPos = this.enemyBoardNode.children[element.cellIndex].getWorldPosition();

            // 设置棋子显示层级
            chessNode.setParent(this.enemyShowLayer[element.cellIndex % 3])
            chessNode.setWorldPosition(cellPos);

            element.node = chessNode;
        });
    }

    // 渲染棋子
    private _renderChess() {
        // this.chessListNode.removeAllChildren()
        this.chessShowLayer.forEach((layer) => {
            layer.removeAllChildren()
        })

        this.chessSet.forEach((element) => {
            const chessNode = element.node || instantiate(element.prefab);

            let cellPos
            if (element.location === CHESS_LOCATION.bag) {
                cellPos = this.bagNode.children[element.cellIndex].getWorldPosition();
            } else {
                cellPos = this.chessBoardNode.children[element.cellIndex].getWorldPosition();
            }

            // 设置棋子显示层级
            chessNode.setParent(this.chessShowLayer[element.cellIndex % 3])

            // chessNode.setParent(this.chessListNode);
            chessNode.setWorldPosition(cellPos);

            element.node = chessNode;
            element.position = cellPos;
        });
    }

    // 注册棋子拖拽
    private _registerChessDrag() {
        EventManager.on(EVENT_NAME_CHESS.CHESS_TOUCH_START, (event: EventMouse, chess: Node) => {
            this.handleChess = this.chessList.find(e => e?.node === chess);
            chess.setParent(this.chessShowLayer[2]);
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
    private _getChessByIndex(index: number, location: CHESS_LOCATION): chessInfo {
        return this.chessList.find(e => e.cellIndex == index && e.location == location)
    }

    // 移动棋子
    private _moveChess(targetLocation: CHESS_LOCATION, targetIndex: number) {
        const oldIndex = this.handleChess.cellIndex;
        const oldLocation = this.handleChess.location;
        const target = this._getChessByIndex(targetIndex, targetLocation);  // 获取目标位置的棋子

        this.handleChess.cellIndex = targetIndex;
        this.handleChess.location = targetLocation;
        this.handleChess.node.getComponent(chessBase).isOnBoard = targetLocation == CHESS_LOCATION.board;

        // 交换位置
        if (target) {
            target.cellIndex = oldIndex;
            target.location = oldLocation;
            target.node.getComponent(chessBase).isOnBoard = oldLocation == CHESS_LOCATION.board;
        }

        this._renderChess()
    }
}
