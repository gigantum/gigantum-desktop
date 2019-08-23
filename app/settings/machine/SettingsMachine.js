// @flow
import { Machine } from 'xstate';
// container states
import {
  AKNOWLEDGEMENTS,
  RELEASE_NOTES,
  BACK,
  ABOUT
} from './SettingsConstants';

const stateMachine = Machine({
  initial: ABOUT,
  states: {
    [ABOUT]: {
      meta: { message: 'About' },
      on: {
        AKNOWLEDGEMENTS,
        RELEASE_NOTES
      }
    },
    [RELEASE_NOTES]: {
      meta: { message: 'About' },
      on: {
        [BACK]: ABOUT
      }
    },
    [AKNOWLEDGEMENTS]: {
      meta: { message: 'About' },
      on: {
        [BACK]: ABOUT
      }
    }
  }
});

export default stateMachine;
