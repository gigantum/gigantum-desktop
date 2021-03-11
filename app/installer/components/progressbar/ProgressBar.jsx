// @flow
import React, { Component } from 'react';
import classNames from 'classnames';
// assets
import './ProgressBar.scss';

type Props = {
  progress: number
};

class ProgressBar extends Component<Props> {
  props: Props;

  render() {
    const { progress } = this.props;
    const firstStepCSS = classNames({
      'ProgressBar__Steps--first': true,
      'ProgressBar__Steps--active': progress === 1,
      'ProgressBar__Steps--completed': progress > 1
    });
    const secondStepCSS = classNames({
      'ProgressBar__Steps--middle': true,
      'ProgressBar__Steps--active': progress === 2,
      'ProgressBar__Steps--completed': progress > 2
    });
    const thirdStepCSS = classNames({
      'ProgressBar__Steps--last': true,
      'ProgressBar__Steps--active': progress === 3,
      'ProgressBar__Steps--completed': progress > 3
    });
    return (
      <div className="ProgressBar">
        <div className="ProgressBar__container">
          <ul className="ProgressBar__Steps">
            <li className={firstStepCSS}>Install Docker</li>
            <li className={secondStepCSS}>Configure Docker</li>
            <li className={thirdStepCSS}>Configure Gigantum</li>
          </ul>
        </div>
      </div>
    );
  }
}

export default ProgressBar;
