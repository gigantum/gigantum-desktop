// @flow
import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
// components
import Toolbar from './toolbar/Toolbar';
import Settings from './settings/Settings';
import Installer from './installer/Installer';
import Updater from './updater/Updater';
import ManageServer from './server/ManageServer';
// assets
import './assets/css/critical.scss';

type Props = {
  storage: object
};

class ViewManager extends Component<Props> {
  static Views(props) {
    return {
      toolbar: <Toolbar {...props} />,
      settings: <Settings {...props} />,
      installer: <Installer {...props} />,
      updater: <Updater {...props} />,
      manageServer: <ManageServer {...props} />
    };
  }

  static View(props) {
    const { search } = props.location;
    const subString = search.substr(1).split('&');
    const name = subString[0];
    const ViewComponent = ViewManager.Views(props)[name];
    if (ViewComponent == null) {
      throw new Error(ViewComponent);
    }
    return ViewComponent;
  }

  render() {
    const { props } = this;
    const { storage } = props;

    return (
      <Router>
        <div style={{ width: '100%', height: '100%' }}>
          <Route
            path="/"
            component={renderProps => (
              <ViewManager.View storage={storage} {...renderProps} />
            )}
          />
        </div>
      </Router>
    );
  }
}

export default ViewManager;
