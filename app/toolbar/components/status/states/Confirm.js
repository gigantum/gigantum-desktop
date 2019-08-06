// @flow
import * as React from 'react';
// assets
import './Confirm.scss';

type Props = {
  message: string
};

class Confirm extends React.Component<Props> {
  props: Props;

  render() {
    const { props } = this;
    return (
      <div className="Confirm">
        <div className="Confirm__message">{props.message}</div>
        <div className="Confirm__container">
          <button type="button" className="Btn__Confirm Btn--primary">
            Yes
          </button>
          <button type="button" className="Btn__Confirm">
            No
          </button>
        </div>
      </div>
    );
  }
}

export default Confirm;
