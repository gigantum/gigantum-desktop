// @flow
import { Machine } from 'xstate';
// container states
import {
  PROMPT,
  ERROR,
  KERNAL_PROMPT,
  INSTALLING
} from './InstallWSL2Constants';

const stateMachine = Machine({
  initial: PROMPT,
  states: {
    [PROMPT]: {
      meta: { message: 'Configure Windows Subsystem' },
      on: {
        SUCCESS: KERNAL_PROMPT,
        ERROR
      }
    },
    [KERNAL_PROMPT]: {
      meta: { message: 'Configure Windows Subsystem' },
      on: {
        SUCCESS: INSTALLING,
        ERROR
      }
    },
    [INSTALLING]: {
      meta: { message: 'Configure Windows Subsystem' },
      on: {
        ERROR
      }
    },
    [ERROR]: {
      meta: { message: 'Configure Windows Subsystem' },
      on: {}
    }
  }
});

export default stateMachine;
