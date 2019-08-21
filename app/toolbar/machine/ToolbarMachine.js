// @flow
import { Machine } from 'xstate';
// container states
import {
  RUNNING,
  ERROR,
  STOPPED,
  LOADING,
  STARTING,
  STOPPING,
  CONFIRM_ACTION
} from './ToolbarConstants';

const stateMachine = Machine({
  initial: LOADING,
  states: {
    [LOADING]: {
      meta: { message: 'Checking for Docker' },
      on: {
        RUNNING,
        ERROR,
        STOPPED
      }
    },
    [STOPPED]: {
      meta: { message: 'Click to Start', additionalInfo: '' },
      on: {
        START: STARTING
      }
    },
    [STARTING]: {
      meta: { message: 'Starting Gigantum', additionalInfo: '' },
      on: {
        SUCCESS: RUNNING,
        ERROR
      }
    },
    [RUNNING]: {
      meta: {
        message: 'Click to Quit',
        additionalInfo: ''
      },
      on: {
        ERROR,
        STOP: CONFIRM_ACTION,
        RESTART: CONFIRM_ACTION,
        FORCE_STOP: STOPPING,
        FORCE_RESTART: STARTING,
        UNEXPECTED_STOP: STOPPED
      }
    },
    [STOPPING]: {
      meta: {
        message: 'Stopping Gigantum',
        additionalInfo: ''
      },
      on: {
        ERROR,
        SUCCESS: STOPPED
      }
    },
    [CONFIRM_ACTION]: {
      meta: {
        message: 'Are you sure?',
        additionalInfo: ''
      },
      on: {
        ERROR,
        CONFIRM: STOPPING,
        CANCEL: RUNNING,
        REPROMPT: CONFIRM_ACTION,
        CONFIRM_RESTART: STARTING
      }
    },
    [ERROR]: {
      meta: {
        message: 'Could not create instance see error below',
        additionalInfo: ''
      },
      on: {
        TRY_AGAIN: STARTING,
        TRY_AGAIN_STOPPED: STOPPED
      }
    }
  }
});

export default stateMachine;
