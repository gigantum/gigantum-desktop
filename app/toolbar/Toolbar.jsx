// @flow
import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// messenger
import ToolbarMessenger from './messenger/ToolbarMessenger';
// docker
import ToolbarInterface from '../libs/ToolbarInterface';
// components
import routes from '../redux/constants/routes';
import Info from './containers/Info';
import Main from './containers/Main';

type Props = {
  storage: object
};

export default class Routes extends Component<Props> {
  toolbarMessenger = new ToolbarMessenger();

  toolbarInterface = new ToolbarInterface();

  render() {
    const { storage } = this.props;
    return (
      <div className="Routes">
        <button
          type="button"
          onClick={() => this.toolbarMessenger.showInstaller()}
        >
          Show
        </button>
        <button
          type="button"
          onClick={() => this.toolbarMessenger.hideInstaller()}
        >
          hide
        </button>

        <button
          type="button"
          onClick={() => this.toolbarInterface.startDockerApplication()}
        >
          start docker
        </button>

        <button
          type="button"
          onClick={() => this.toolbarInterface.stopDockerApplication()}
        >
          stop docker
        </button>

        <Router>
          <Switch>
            <Route
              storage={storage}
              exact
              path={routes.Info}
              component={Info}
            />
            <Route
              storage={storage}
              path={routes.Main}
              component={renderProps => (
                <Main storage={storage} {...renderProps} />
              )}
            />
          </Switch>
        </Router>
      </div>
    );
  }
}
