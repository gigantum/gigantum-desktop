// @flow
import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// messenger
import ToolbarMessenger from './messenger/ToolbarMessenger';
// components
import routes from '../redux/constants/routes';
import Info from './containers/Info';
import Main from './containers/Main';

type Props = {
  storage: object
};

export default class Routes extends Component<Props> {
  // TODO: remove here for proof of concept
  showInstaller = () => {
    const toolbarMessenger = new ToolbarMessenger();

    toolbarMessenger.openInstaller();
  };

  // TODO: remove here for proof of concept
  hideInstaller = () => {
    const toolbarMessenger = new ToolbarMessenger();

    toolbarMessenger.hideInstaller();
  };

  render() {
    const { storage } = this.props;
    return (
      <div className="Routes">
        {/* <button type="button" onClick={() => this.showInstaller()}>
          Show
        </button>
        <button type="button" onClick={() => this.hideInstaller()}>
          hide
        </button> */}

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
