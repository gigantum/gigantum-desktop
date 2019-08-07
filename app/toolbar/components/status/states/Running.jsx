// @flow
import * as React from 'react';
// State
import { STOP, FORCE_STOP } from '../../../machine/ToolbarConstants';
// assets
import './Running.scss';

type Props = {
  transition: () => void,
  message: string
};

class Running extends React.Component<Props> {
  props: Props;

  confirmClose = () => {
    const { props } = this;
    // TODO check to see if any project containers are running, true if there are, false otherwise. False if setting is remembered
    const validateGigantumClose = true;
    // TODO check config to see if setting is remembered
    const validateDockerClose = true;

    if (validateGigantumClose) {
      props.transition(STOP, {
        message: 'Are you sure?',
        category: 'closeGigantum'
      });
    } else if (validateDockerClose) {
      props.transition(STOP, {
        message: 'Would you like to close Docker?',
        category: 'closeDocker'
      });
    } else {
      props.transition(FORCE_STOP, {
        message: 'Closing Gigantum'
      });
    }
  };

  render() {
    const { props } = this;
    return (
      <div className="Running">
        <div className="Running__message">{props.message}</div>
        <button
          type="button"
          className="Btn__Stop"
          onClick={this.confirmClose}
        />
      </div>
    );
  }
}

export default Running;
