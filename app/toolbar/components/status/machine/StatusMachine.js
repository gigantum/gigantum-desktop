// @flow
import { Machine } from 'xstate';
// container states
export const RUNNING = 'RUNNING';
export const ERROR = 'ERROR';
export const STOPPED = 'STOPPED';
export const LOADING = 'LOADING';
export const STARTING = 'STARTING';
export const STOPPING = 'STOPPING';

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
    }
  }
});

export default stateMachine;
