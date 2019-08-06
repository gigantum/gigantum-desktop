// @flow
import * as React from 'react';
// assets
import './Transition.scss';

type Props = {
  message: string
};

class Transition extends React.Component<Props> {
  props: Props;

  render() {
    const { props } = this;
    return (
      <div className="Transition">
        <div className="Transition__message">{props.message}</div>
      </div>
    );
  }
}

export default Transition;
