module.exports = Object.freeze({
    PLAYER_RADIUS: 30,
    PLAYER_MAX_HP: 100,
    PLAYER_SPEED: 200,
    PLAYER_FIRE_COOLDOWN: 10,
  
    BULLET_RADIUS: 10,
    BULLET_SPEED: 600,
    BULLET_DAMAGE: 10,
  
    SCORE_BULLET_HIT: 20,
    SCORE_PER_SECOND: 1,

    CONSUMER_MAX_HP: 100,
    MAX_CONSUMERS: 20,
    MAX_RESOURCES: 2,
  
    MAP_SIZE: 2500,
    MSG_TYPES: {
      JOIN_GAME: 'join_game',
      GAME_UPDATE: 'update',
      KEYINPUT: 'keyinput',
      MOUSEMOVEINPUT: 'mousemoveinput',
      MOUSECLICKINPUT: 'mouseclickinput',
      GAME_OVER: 'dead',
      REDUCE_PELKEYS: "reduce",
      INCREASE_PELKEYS: "increase",
      NORMAL_PELKEYS: "normal",
      GDP_INCREASE: "gdpincrease",
    },
  });