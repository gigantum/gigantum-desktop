// @flow
import * as React from 'react';
// State
import { SUCCESS, START, ERROR } from '../../../machine/ToolbarConstants';
// assets
import './Stopped.scss';

type Props = {
  transition: () => void,
  message: string
};

class Stopped extends React.Component<Props> {
  props: Props;

  startGigantum = () => {
    const { props } = this;
    props.transition(START, {
      message: 'Starting Gigantum'
    });

    // start gigantum
    setTimeout(() => {
      const error = false;
      if (error) {
        props.transition(ERROR, {
          message: 'error.message'
        });
      } else {
        props.transition(SUCCESS, {
          message: 'Click to Quit'
        });
      }
    }, 5000);
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
