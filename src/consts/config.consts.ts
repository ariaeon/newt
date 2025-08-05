import { snakeConfig } from './snake.consts';
import { fishConfig } from './fish.consts';
import { newtConfig } from './newt.consts';

export const ConfigOptions = {
  SEGMENT_AMOUNT_MIN: 5,
  SEGMENT_AMOUNT_MAX: 40,
  SEGMENT_DISTANCE_MIN: 15,
  SEGMENT_DISTANCE_MAX: 40,
  MAX_BEND_MIN: Math.PI / 12, // 15 degrees
  MAX_BEND_MAX: Math.PI / 4, // 45 degrees
};

export const presets = {
  snake: snakeConfig,
  fish: fishConfig,
  newt: newtConfig,
};
