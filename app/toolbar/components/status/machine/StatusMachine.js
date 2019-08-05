// @flow
import { Machine } from 'xstate';
// container states
export const RUNNING = 'RUNNING';
export const ERROR = 'ERROR';
export const STOPPED = 'STOPPED';
export const LOADING = 'LOADING';
export const STARTING = 'STARTING';
export const STOPPING = 'STOPPING';
export const TRY_AGAIN_STOPPED = 'TRY_AGAIN_STOPPED';
export const TRY_AGAIN_RUNNING = 'TRY_AGAIN_RUNNING';

const stateMachine = Machine({
  initial: LOADING,
  states: {
    [LOADING]: {
      meta: { message: 'Checking state of gigantum...' },
      on: {
        RUNNING,
        ERROR,
        STOPPED
      }
    },
    [STOPPED]: {
      meta: { message: 'Starting Gigantum', additionalInfo: '' },
      on: {
        START: STARTING
      }
    },
    [STARTING]: {
      meta: { message: 'Error Adding Credentials', additionalInfo: '' },
      on: {
        SUCCESS: RUNNING,
        ERROR
      }
    },
    [RUNNING]: {
      meta: {
        message: 'Could not create instance see error below',
        additionalInfo: ''
      },
      on: {
        ERROR,
        STOP: STOPPING
      }
    },
    [STOPPING]: {
      meta: {
        message: 'Could not create instance see error below',
        additionalInfo: ''
      },
      on: {
        ERROR,
        SUCCESS: STOPPED
      }
    },
    [ERROR]: {
      meta: {
        message: 'Could not create instance see error below',
        additionalInfo: ''
      },
      on: {
        TRY_AGAIN_STOPPED: STARTING,
        TRY_AGAIN_RUNNING: STOPPING
      }
    }
  }
});

export default stateMachine;
