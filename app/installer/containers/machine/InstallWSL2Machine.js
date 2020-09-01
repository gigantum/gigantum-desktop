// @flow
import { Machine } from 'xstate';
// container states
import {
  PROMPT,
  INSTALLING,
  INSTALLED,
  LAUNCHING
} from './InstallDockerConstants';

const stateMachine = Machine({
  initial: PROMPT,
  states: {
    [PROMPT]: {
      meta: { message: 'Configure Windows Subsystem' },
      on: {
        INSTALL: INSTALLING
      }
    },
    [INSTALLING]: {
      meta: { message: 'Configure Windows Subsystem' },
      on: {
        SUCCESS: LAUNCHING
      }
    },
    [LAUNCHING]: {
      meta: { message: 'Configure Windows Subsystem' },
      on: {
        SUCCESS: INSTALLED
      }
    },
    [INSTALLED]: {
      meta: { message: 'Configure Windows Subsystem' },
      on: {}
    }
  }
});

export default stateMachine;
