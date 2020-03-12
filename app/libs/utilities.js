import open from 'open';
import Storage from '../storage/Storage';

const storage = new Storage();

export default {
  open: route => {
    const defaultBrowser = storage.get('defaultBrowser');
    const browserDictionary = {
      Chrome: 'google chrome',
      Firefox: 'firefox'
    };
    const options = defaultBrowser
      ? {
          app: browserDictionary[defaultBrowser]
        }
      : {};
    open(route, options);
  }
};
