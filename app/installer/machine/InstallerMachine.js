// @flow
import { Machine } from 'xstate';
// container states
import {
  CHECKING,
  ERROR,
  INSTALL_DOCKER,
  INSTALL_WSL2,
  CONFIGURE_DOCKER,
  CONFIGURE_GIGANTUM,
  INSTALL_COMPLETE,
  TRY_AGAIN_INSTALL_DOCKER,
  TRY_AGAIN_CONFIGURE_GIGANTUM,
  TRY_AGAIN_CONFIGURE_DOCKER
} from './InstallerConstants';

const stateMachine = Machine({
  initial: CHECKING,
  states: {
    [CHECKING]: {
      meta: { message: 'Checking for Docker' },
      on: {
        ERROR,
        INSTALL_DOCKER,
        CONFIGURE_DOCKER,
        CONFIGURE_GIGANTUM,
        INSTALL_WSL2
      }
    },
    [INSTALL_WSL2]: {
      meta: { message: 'Configure WSL 2', additionalInfo: '' },
      on: {
        SUCCESS: CHECKING,
        ERROR
      }
    },
    [INSTALL_DOCKER]: {
      meta: { message: 'Starting Gigantum', additionalInfo: '' },
      on: {
        SUCCESS: CONFIGURE_DOCKER,
        SKIP_CONFIGURE: CONFIGURE_GIGANTUM,
        ERROR
      }
    },
    [CONFIGURE_DOCKER]: {
      meta: {
        message: 'Click to Quit',
        additionalInfo: ''
      },
      on: {
        ERROR,
        SUCCESS: CONFIGURE_GIGANTUM
      }
    },
    [CONFIGURE_GIGANTUM]: {
      meta: {
        message: 'Stopping Gigantum',
        additionalInfo: ''
      },
      on: {
        ERROR,
        SUCCESS: INSTALL_COMPLETE
      }
    },
    [INSTALL_COMPLETE]: {
      meta: {
        message: 'Are you sure?',
        additionalInfo: ''
      },
      on: {}
    },
    [ERROR]: {
      meta: { message: 'Click to Start', additionalInfo: '' },
      on: {
        [TRY_AGAIN_INSTALL_DOCKER]: CHECKING,
        [TRY_AGAIN_CONFIGURE_DOCKER]: CONFIGURE_DOCKER,
        [TRY_AGAIN_CONFIGURE_GIGANTUM]: CONFIGURE_GIGANTUM
      }
    }
  }
});

export default stateMachine;
