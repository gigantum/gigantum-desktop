// @flow
import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
// components
import Toolbar from './toolbar/Toolbar';
import Installer from './installer/Installer';

type Props = {
  storage: object
};

class ViewManager extends Component<Props> {
  static Views(props) {
    return {
      toolbar: <Toolbar {...props} />,
      installer: <Installer {...props} />
    };
  }

  static View(props) {
    const name = props.location.search.substr(1);
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
        <div>
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
