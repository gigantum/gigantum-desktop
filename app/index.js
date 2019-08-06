// @flow
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { configureStore, history } from './redux/store/configureStore';
import Storage from './storage/Storage';
// components
import ViewManager from './ViewManager';

const storage = new Storage();

const store = configureStore();

render(
  <AppContainer>
    <ViewManager store={store} history={history} storage={storage} />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./ViewManager', () => {
    // eslint-disable-next-line global-require
    const NextViewManager = require('./ViewManager').default;

    render(
      <AppContainer>
        <NextViewManager store={store} history={history} storage={storage} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
