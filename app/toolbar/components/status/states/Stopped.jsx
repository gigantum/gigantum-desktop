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

    const callback = response => {
      if (response.success) {
        props.transition(SUCCESS, { message: 'Click to Quit' });
      } else if (response.error.message.indexOf('no such image') > -1) {
        props.transition(ERROR, { message: 'Gigantum is not configured' });
      } else if (
        response.error.message.indexOf('port is already allocated') > -1
      ) {
        props.transition(ERROR, { message: 'Gigantum could not start' });
      } else {
        props.transition(ERROR, { message: 'Gigantum failed to start' });
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
