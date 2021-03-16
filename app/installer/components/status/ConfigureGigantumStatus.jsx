// @flow
// vendor
import React, { Component } from 'react';
// components
import CircularProgress from '../progressbar/circular/CircularProgress';
// assets
import './Status.scss';
import './ConfigureGigantumStatus.scss';

type Props = {
  configureGigantum: () => void,
  progress: number
};

class ConfigureGigantumStatus extends Component<Props> {
  props: Props;

  componentDidMount = () => {
    const { props } = this;
    props.configureGigantum();
  };

  render() {
    const { props } = this;
    const { progress } = props;

    return (
      <div className="Layout__Status ConfigureGigantumStatus">
        <CircularProgress progress={progress} text="Configuring Gigantum" />
      </div>
    );
  }
}

export default ConfigureGigantumStatus;
