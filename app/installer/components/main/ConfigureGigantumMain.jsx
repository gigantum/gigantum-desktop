// @flow
import React, { Component } from 'react';
// assets
import './ConfigureGigantumMain.scss';

type Props = {};

export default class ConfigureGigantumMain extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className="Layout__Main">
        <p>The final step is to download the Gigantum Client container.</p>
        <p>
          Depending on your internet speed, this should take no more than 5
          minutes.
        </p>
      </div>
    );
  }
}
