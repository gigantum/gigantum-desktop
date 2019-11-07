// @flow
import {
  START_TIMER,
  STOP_TIMER,
  CLEAR_TIMER,
  UPDATE_TIMER
} from '../actions/timer';
import type { Action, timerStateType } from './types';

export default function timer(
  state: timerStateType = { time: 0, date: 0 },
  action: Action
) {
  switch (action.type) {
    case START_TIMER:
      return state;
    case STOP_TIMER:
      return {
        ...state,
        time: action.time
      };
    case CLEAR_TIMER:
      return {
        ...state,
        time: action.time
      };
    case UPDATE_TIMER:
      return {
        ...state,
        time: action.time
      };
    default:
      return state;
  }
}
