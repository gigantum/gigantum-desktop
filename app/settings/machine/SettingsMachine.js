// @flow
import { Machine } from 'xstate';
// container states
import {
  AKNOWLEDGEMENTS,
  RELEASE_NOTES,
  BACK,
  ABOUT,
  MANAGE_SERVER
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
    },
    [MANAGE_SERVER]: {
      meta: { message: 'Manager Server' },
      on: {
        MANAGE_SERVER,
        [BACK]: MANAGE_SERVER
      }
    }
  }
});

export default stateMachine;
