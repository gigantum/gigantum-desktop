// @flow
import { Machine } from 'xstate';
// container states
import {
  UPDATE_AVAILABLE,
  UPDATE_IN_PROGRESS,
  DOWNLOAD_COMPLETE,
  CONFIRM,
  SUCCESS
} from './UpdaterConstants';

const stateMachine = Machine({
  initial: UPDATE_AVAILABLE,
  states: {
    [UPDATE_AVAILABLE]: {
      meta: { message: 'Update Available' },
      on: {
        [CONFIRM]: UPDATE_IN_PROGRESS
      }
    },
    [UPDATE_IN_PROGRESS]: {
      meta: { message: 'Update in Progress' },
      on: {
        [SUCCESS]: DOWNLOAD_COMPLETE
      }
    },
    [DOWNLOAD_COMPLETE]: {
      meta: { message: 'Download Complete' },
      on: {}
    }
  }
});

export default stateMachine;
