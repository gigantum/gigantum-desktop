// @flow
import * as React from 'react';
// State
import { SUCCESS, START, ERROR } from '../../../machine/ToolbarConstants';
// assets
import './Stopped.scss';

type Props = {
  transition: () => void,
  message: string,
  interface: {
    start: () => void
  }
};

class Stopped extends React.Component<Props> {
  props: Props;

  startGigantum = () => {
    const { props } = this;
    props.transition(START, {
      message: 'Starting Gigantum'
    });

    const handleErrorTransition = message => {
      props.transition(ERROR, { message });
    };

    const callback = response => {
      const errorMessage = response.error && response.error.message;
      if (response.success) {
        props.transition(SUCCESS, { message: 'Click to Quit' });
      } else if (errorMessage.indexOf('no such image') > -1) {
        handleErrorTransition('Gigantum is not configured');
      } else if (errorMessage.indexOf('port is already allocated') > -1) {
        handleErrorTransition('Gigantum could not start');
      } else {
        handleErrorTransition('Gigantum failed to start');
      }
    };
    props.interface.start(callback);
  };

  render() {
    const { props } = this;
    return (
      <div className="Stopped">
        <div className="Stopped__message">{props.message}</div>
        <button
          type="button"
          className="Btn__Start"
          onClick={this.startGigantum}
        />
      </div>
    );
  }
}

export default Stopped;
