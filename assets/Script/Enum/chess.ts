
export enum chessState {
  idle = 0,
  attack,
  skill,
  move,
  death,
}

export enum EVENT_NAME_CHESS {
  CHESS_TOUCH_START = "CHESS_TOUCH_START",
  CHESS_TOUCH_END = "CHESS_TOUCH_END",
}