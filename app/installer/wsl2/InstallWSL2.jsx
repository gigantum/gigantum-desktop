// @flow
import React, { useCallback, useEffect, useState } from 'react';
import { useMachine } from '@xstate/react';
// States
import installWSL2Machine from './machine/InstallWSL2Machine';
// constants
import { ERROR, SUCCESS } from '../machine/InstallerConstants';
import { INSTALL } from './machine/InstallWSL2Constants';
// containers
import Layout from '../layout/Layout';
// libs
import wslStatus from '../../libs/wslStatus';
// componenets
import InstallWSL2Main from './main/InstallWSL2Main';
import InstallWSL2Status from './status/InstallWSL2Status';

const InstallWSL2 = ({
  installerInterface,
  messenger,
  storage,
  transition,
}) => {
  // machine
  const [state, send] = useMachine(installWSL2Machine);
  // installer methods
  const [installer] = useInstaller();
  // states
  const [progress, setProgress] = useState(0);
  const [wslLookupComplete, setWslLookupComplete] = useState(0);


  useEffect(() => {
    const wslExistsCallback = () => {
      this.installWSL2Transition(SUCCESS);
      this.setState({ wslLookupComplete: true });
    };
    wslStatus(wslExistsCallback, wslExistsCallback, () =>
      this.setState({ wslLookupComplete: true })
    );
  }, []);

  /**
    @param {string} eventType
    sets transition of the state machine
  */
  const installWSL2Transition = useCallback(eventType => {
    console.log('remove me')
  });

  /**
   * @param {}
   *  deny kernal instlal
   */
  const denyKernal = useCallback(() => {
    storage.set('wslConfigured', true);
    transition(SUCCESS, {
      message: 'Checking For Docker'
    });
  }, [storage, transition]);

  /**
   * @param {}
   *  changes state when installing begins
   */
  const installKernal = useCallback(() => {
    const installCallback = response => {
      if (response.success) {
        storage.set('wslConfigured', true);
        transition(SUCCESS, {
          message: 'Checking For Docker'
        });
      } else {
        transition(ERROR, {
          message: 'WSL2 Setup Failed'
        });
      }
    };

    installWSL2Transition(SUCCESS);

    installerInterface.installKernal(installCallback);
  }, [storage, transition, installWSL2Transition, installerInterface]);

  /**
   * @param {}
   *  changes state when installing begins
   */
  const optOut = useCallback(() => {
    transition(SUCCESS, {
      message: 'Checking For Docker'
    });
  }, [transition]);

  /**
   * @param {}
   *  changes state when installing begins
   */
  const startInstall = useCallback(() => {

    const installErrorHandler = () => {
      transition(ERROR, {
        message: 'WSL2 Setup Failed'
      });
    };

    const callback = response => {
      if (response.success) {
        setTimeout(() => {
          installWSL2Transition(SUCCESS);
        }, 3000);
      } else {
        installErrorHandler();
      }
    };

    installWSL2Transition(INSTALL);

    installerInterface.enableSubsystem(callback);
  }, [transition, installWSL2Transition, installerInterface]);

  if (!wslLookupComplete) {
    return <div className="Spinner" />;
  }
  return (
    <div data-tid="container">
      <Layout
        currentState={value}
        section={machine.value}
        message={message}
        progress={1}
      >
        <InstallWSL2Main machineValue={state.value} />
        <InstallWSL2Status
          startInstall={startInstall}
          denyKernal={denyKernal}
          installKernal={installKernal}
          optOut={optOut}
          machineValue={state.value}
          progress={state.progress}
          storage={storage}
          messenger={messenger}
        />
      </Layout>
    </div>
  );

}

export default InstallWSL2;
