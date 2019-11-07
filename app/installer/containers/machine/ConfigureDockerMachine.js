// @flow
import { Machine } from 'xstate';
// container states
import {
  PROMPT,
  CONFIGURING,
  RESTARTING,
  LAUNCHING,
  RESTART_PROMPT
} from './ConfigureDockerConstants';

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
      on: {
        RESTART_PROMPT
      }
    },
    [RESTART_PROMPT]: {
      meta: { message: 'Configure Docker' },
      on: {
        RESTARTING
      }
    },
    [RESTARTING]: {
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
