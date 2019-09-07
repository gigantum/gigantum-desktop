// @flow
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { init } from '@sentry/electron';
import { configureStore, history } from './redux/store/configureStore';
import Storage from './storage/Storage';

// components
import ViewManager from './ViewManager';

const storage = new Storage();

const store = configureStore();

init({
  dsn: 'https://165a5c668fe141a7a25e84b5eb05c02b@sentry.io/1243058',
  enableNative: false
});

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
