// @flow
import React, { Component } from 'react';
import classNames from 'classnames';
// assets
import './ProgressBar.scss';

type Props = {
  progress: number
};

export default class ProgressBar extends Component<Props> {
  props: Props;

  render() {
    const { progress } = this.props;
    const firstStepCSS = classNames({
      'first-item': true,
      'is-active': progress === 1,
      'is-completed': progress > 1
    });
    const secondStepCSS = classNames({
      'middle-item': true,
      'is-active': progress === 2,
      'is-completed': progress > 2
    });
    const thirdStepCSS = classNames({
      'last-item': true,
      'is-active': progress === 3,
      'is-completed': progress > 3
    });
    return (
      <div className="ProgressBar">
        <div className="ProgressBar__container">
          <ul className="list-unstyled multi-steps">
            <li className={firstStepCSS}>Install Docker</li>
            <li className={secondStepCSS}>Configure Docker</li>
            <li className={thirdStepCSS}>Configure Gigantum</li>
          </ul>
        </div>
      </div>
    );
  }
}
