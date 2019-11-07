// @flow
import type { GetState, Dispatch } from '../reducers/types';

export const START_TIMER = 'START_TIMER';
export const STOP_TIMER = 'STOP_TIMER';
export const CLEAR_TIMER = 'CLEAR_TIMER';
export const UPDATE_TIMER = 'UPDATE_TIMER';

export function startTimer() {
  return {
    type: START_TIMER
  };
}

export function stopTimer(time) {
  return {
    type: STOP_TIMER,
    time
  };
}

export function clearTimer() {
  return {
    type: CLEAR_TIMER,
    time: 0
  };
}

export function updateTimer(time) {
  return {
    type: UPDATE_TIMER,
    time
  };
}

export function incrementIfOdd() {
  return (dispatch: Dispatch, getState: GetState) => {
    const { time } = getState();

    if (time % 2 === 0) {
      return;
    }

    dispatch(stopTimer());
  };
}

export function incrementAsync(delay: number = 1000) {
  return (dispatch: Dispatch) => {
    setTimeout(() => {
      dispatch(stopTimer());
    }, delay);
  };
}
