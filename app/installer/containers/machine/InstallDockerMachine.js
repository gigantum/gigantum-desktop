// @flow
import { Machine } from 'xstate';
// container states
import { PROMPT, INSTALLING, INSTALLED } from './InstallDockerConstants';

const stateMachine = Machine({
  initial: PROMPT,
  states: {
    [PROMPT]: {
      meta: { message: 'Install Docker' },
      on: {
        INSTALL: INSTALLING
      }
    },
    [INSTALLING]: {
      meta: { message: 'Install Docker' },
      on: {
        SUCCESS: INSTALLED
      }
    },
    [INSTALLED]: {
      meta: { message: 'Install Docker' },
      on: {}
    }
  }
});

export default stateMachine;
