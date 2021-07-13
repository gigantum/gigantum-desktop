import { Machine } from 'xstate';
import installer from '../../../libs/Installer';

const WSLMachine = Machine({
  id: 'WSL2',
  initial: 'idle',
  context: {
    retries: 0
  },
  states: {
    idle: {
      on: {
        check_compatibility: 'check_compatibility'
      }
    },
    // check for WSL compatibility
    check_compatibility: {
      invoke: {
        id: 'check_compatibility',
        src: () => installer.checkCompatibilityWSL(),
        onDone: {
          // if compatible, check if installeda
          target: 'check_WSL_install'
        },
        onError: {
          // if compatible, check if installed
          target: 'proceed_install'
        }
      }
    },
    // check to see if WSL is installed
    check_WSL_install: {
      id: 'check_WSL_install',
      src: () => installer.checkWSLInstallStatus(),
      onDone: {
        // If WSL is installed AND ready to use, proceed installer
        target: 'check_kernel_install'
      },
      onError: {
        // If WSL is uninstalled, prompt to install
        target: 'prompt_wsl_install'
      }
    },

    check_kernel_install: {
      id: 'check_kernel_install',
      src: () => installer.checkKernalInstall(),
      onDone: {
        // If WSL is installed AND ready to use, proceed installer
        target: 'proceed_install'
      },
      onError: {
        // If WSL is uninstalled, prompt to install
        target: 'install_kernel'
      }
    },
    // prompt user
    prompt_wsl_install: {
      on: {
        // on user accepting prompt
        RESOLVE: 'check_restart_require',
        // on user rejecting prompt
        REJECT: 'proceed_install'
      }
    },
    // check to see if WSL was installed but was not ready to use
    check_restart_require: {
      on: {
        // if WSL was installed but not ready to use
        RESOLVE: 'prompt_restart',
        // WSL not installed at all
        // WSL not installed at all
        REJECT: 'enable_WSL'
      }
    },
    // install kernal
    install_kernel: {
      on: {
        // if kernal installs sucessfully, proceed installer
        RESOLVE: 'proceed_install',
        // if kernal fails to install, error state
        REJECT: 'kernel_install_failed'
      }
    },

    // kernal installer error state
    kernel_install_failed: {
      on: {
        // try to install kernal again
        RETRY: {
          target: 'install_kernel'
        }
      }
    },

    // attempt to install WSL
    enable_WSL: {
      on: {
        // on success, prompt a restart
        RESOLVE: 'prompt_restart',
        // on failure, error state
        REJECT: 'enable_wsl_failed'
      }
    },

    // wsl installer error state
    enable_wsl_failed: {
      on: {
        // try to enable WSL again
        RETRY: {
          target: 'enable_WSL'
        }
      }
    },

    // restart prompt
    prompt_restart: {
      on: {
        // user accepts prompt
        RESOLVE: 'restart_required'
        // should rejecting this prompt be possible?, unsure if we want this option
        // REJECT: 'close_installer'
      }
    },
    restart_required: {
      type: 'final'
      // will require system restart
    },
    proceed_install: {
      type: 'final'
      // will proceed with installer
    }
  }
});

export default WSLMachine;
