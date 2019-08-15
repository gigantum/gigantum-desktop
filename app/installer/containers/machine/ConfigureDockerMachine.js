// @flow
import { Machine } from 'xstate';
// container states
import { PROMPT, CONFIGURING, LAUNCHING } from './ConfigureDockerConstants';

const stateMachine = Machine({
  initial: PROMPT,
  states: {
    [PROMPT]: {
      meta: { message: 'Configure Docker' },
      on: {
        CONFIGURE: CONFIGURING,
        LAUNCH: LAUNCHING
      }
    },
    [CONFIGURING]: {
      meta: { message: 'Configure Docker' },
      on: {}
    },
    [LAUNCHING]: {
      meta: { message: 'Configure Docker' },
      on: {}
    }
  }
});

export default stateMachine;
