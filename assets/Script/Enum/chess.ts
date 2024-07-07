
export enum CHESS_TYPE {
  player,
  enemy,
}

export enum CHESS_STATE {
  idle = 0,
  attack,
  skill,
  move,
  death,
}

export enum EVENT_NAME_CHESS {
  CHESS_TOUCH_START = "棋子拖拽开始",
  CHESS_TOUCH_END = "棋子拖拽结束",

  CHESS_DIE = "棋子死亡",
  CHESS_ATTACK = "棋子攻击",
  CHESS_SKILL = "棋子释放技能",
}
