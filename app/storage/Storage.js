// @flow
import electron from 'electron';
import path from 'path';
import fs from 'fs';
import chmod from 'chmod';

/**
 * Dynamically sets a deeply nested value in an object.
 * Optionally "bores" a path to it if its undefined.
 * @function
 * @param {!object} obj  - The object which contains the value you want to change/set.
 * @param {!array} path  - The array representation of path to the value you want to change/set.
 * @param {!mixed} value - The value you want to set it to.
 * @param {boolean} setrecursively - If true, will set value of non-existing path as well.
 */
function setDeep(obj, keys, value) {
  let level = 0;

  keys.reduce((node, b) => {
    level += 1;

    if (typeof node[b] === 'undefined' && level !== keys.length) {
      node[b] = {};
      return node[b];
    }

    if (level === keys.length) {
      node[b] = value;
      return value;
    }

    return node[b];
  }, obj);
}

class Store {
  constructor() {
    // Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
    // app.getPath('userData') will return a string of the user's app data directory path.
    const userDataPath = (electron.app || electron.remote.app).getPath(
      'userData'
    );

    if (!fs.existsSync(`${userDataPath}/GigantumDesktop`)) {
      fs.mkdirSync(`${userDataPath}/GigantumDesktop`);
    }
    // We'll use the `configName` property to set the file name and path.join to bring it all together as a string
    this.path = path.join(userDataPath, `GigantumDesktop/GigantumDesktop.json`);

    this.schema = {
      install: false
    };
    this.data = this.parseDataFile(this.path);
  }

  // This will just return the property on the `data` object
  get(key) {
    return this.data[key];
  }

  getRoot() {
    return this.data;
  }

  // ...and this will set it
  set(key, value) {
    this.data[key] = value;
    // Wait, I thought using the node.js' synchronous APIs was bad form?
    // We're not writing a server so there's not nearly the same IO demand on the process
    // Also if we used an async API and our app was quit before the asynchronous write had a chance to complete,
    // we might lose that data. Note that in a real app, we would try/catch this.
    fs.writeFileSync(this.path, JSON.stringify(this.data, null, 4));
  }

  setDeepState(keys, value) {
    setDeep(this.data, keys, value);

    // Wait, I thought using the node.js' synchronous APIs was bad form?
    // We're not writing a server so there's not nearly the same IO demand on the process
    // Also if we used an async API and our app was quit before the asynchronous write had a chance to complete,
    // we might lose that data. Note that in a real app, we would try/catch this.
    fs.writeFileSync(this.path, JSON.stringify(this.data, null, 4));
  }

  parseDataFile = filePath => {
    const self = this;
    // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
    // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
    try {
      return JSON.parse(fs.readFileSync(filePath));
    } catch (error) {
      fs.writeFileSync(self.path, JSON.stringify(self.schema, null, 4));
      // if there was some kind of error, return the passed in defaults instead.
      return self.schema;
    }
  };

  parsePem = data => {
    const userDataPath = (electron.app || electron.remote.app).getPath(
      'userData'
    );
    const filePath = path.join(
      userDataPath,
      `GigantumDesktop/${data.KeyName}.pem`
    );
    // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
    // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
    //
    fs.writeFileSync(filePath, data.KeyMaterial);

    chmod(filePath, 400);
  };

  getPem = () => {
    const userDataPath = (electron.app || electron.remote.app).getPath(
      'userData'
    );
    const filePath = path.join(
      userDataPath,
      `GigantumDesktop/${this.data.userId}.pem`
    );
    // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
    // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
    //
    const pem = fs.readFileSync(filePath);

    return pem;
  };
}

// expose the class
export default Store;
