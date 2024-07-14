
export enum EVENT_NAME_GAME {
  GAME_START = "游戏开始",
  GAME_OVER = "游戏结束",
  GAME_WIN = "游戏胜利",
  GAME_LOSE = "游戏失败",
}

export enum EVENT_NAME_GAME_LEVEL {
  GAME_LEVEL_START = "游戏关卡开始",
  GAME_LEVEL_RUNNING = "游戏关卡运行中",
  GAME_LEVEL_END = "游戏关卡结束",
}

export enum EVENT_NAME_PLAYER {
  PLAYER_HP_CHANGE = "玩家血量变化",
  PLAYER_COIN_CHANGE = "玩家金币变化",
}

// 关卡开始动画时间
export const gameStartAnimationSeconds = 1;