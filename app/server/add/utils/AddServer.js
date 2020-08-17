// vendor
// import fetch from 'node-fetch';
import async from 'async';
import fs from 'fs';
import os from 'os';

/**
 * Fetches data from api and apprends results to object
 * @param {string} url
 * @param {Object} data
 * @param {string} fetchType
 * @param {Function} callback
 *
 * @return {string}
 */
const fetchServerData = (url, data, fetchType, callback) => {
  fetch(url)
    .then(res => {
      if (
        res.status !== 200 ||
        res.headers.get('content-type') !== 'application/json'
      ) {
        return { message: 'No json', server: false };
      }
      return res.json();
    })
    .then(body => {
      if (body.message) {
        callback(null, body);
        return;
      }
      data[fetchType] = body;
      callback(null, data);
      return true;
    })
    .catch(error => {
      callback(error);
    });
};

/**
 * Method gets users home directory
 *
 * @return {string}
 */
const serverConfigDir = () => {
  const homedir = os.homedir();
  const dir = `${homedir}/gigantum/.labmanager/servers/`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  return dir;
};

/**
 * Method writes data into a json file in the gigantum/.labmanager/servers/ folder
 * @param {Object} data
 * @param {Function} callback
 *
 * @return {string}
 */
const writeToFile = (data, callback) => {
  const serverId = data.server.id;
  const filename = `${serverId}.json`;
  const dir = serverConfigDir();
  const filePath = `${dir}${filename}`;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  callback(null, data);
};

const checkUrlFormat = (data, callback) => {
  const gitLastIndex = data.server.git_url.length - 1;
  data.server.git_url =
    data.server.git_url[gitLastIndex] === '/'
      ? data.server.git_url
      : `${data.server.git_url}/`;

  const hubLastIndex = data.server.hub_api_url.length - 1;
  data.server.hub_api_url =
    data.server.hub_api_url[hubLastIndex] === '/'
      ? data.server.hub_api_url
      : `${data.server.hub_api_url}/`;

  const objectServiceLastIndex = data.server.object_service_url.length - 1;
  data.server.object_service_url =
    data.server.object_service_url[objectServiceLastIndex] === '/'
      ? data.server.object_service_url
      : `${data.server.object_service_url}/`;

  callback(null, data);
};

/**
 * Method to discover a server's configuration and add it to the local configured servers
 * @param {string} url
 *
 * @return {string}
 */
const addServer = (url: string, callbackAdd) => {
  const teamURL = `${url}gigantum/.well-known/discover.json`;
  const enterpriseURL = `${url}.well-known/discover.json`;

  async.waterfall(
    [
      callback => {
        fetchServerData(teamURL, {}, 'server', callback);
      },
      (data, callback) => {
        if (data.server === false) {
          fetchServerData(enterpriseURL, {}, 'server', callback);
        } else {
          callback(null, data);
        }
      },
      (data, callback) => {
        if (data.server === false) {
          callback(null, data);
        } else {
          checkUrlFormat(data, callback);
        }
      },
      (data, callback) => {
        fetchServerData(data.server.auth_config_url, data, 'auth', callback);
      },
      (data, callback) => {
        writeToFile(data, callback);
      }
    ],
    (err, result) => {
      if (err) {
        callbackAdd(err, null);
      } else {
        callbackAdd(null, result);
      }
    }
  );
};

export { addServer };
export default { addServer };
