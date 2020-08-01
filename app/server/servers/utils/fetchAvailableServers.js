// vendor
import fs from 'fs';
import os from 'os';
import glob from 'glob';

/**
 * Method gets directory for users servers config files
 * @param {}
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
 * Method gets all json files in `${homedir}/gigantum/.labmanager/servers/` and returns an array of Objects
 * @param {function} callback
 * @return {array}
 */
const fetchAvailableServers = callback => {
  const dir = serverConfigDir();

  glob(`${dir}/*.json`, (err, files) => {
    if (err) {
      return [{ name: 'Could not find any configured servers', url: '' }];
    }

    const servers = files.map(file => {
      const data = fs.readFileSync(file);
      const server = JSON.parse(data);

      return server;
    });

    callback(servers);
  });
};

export { fetchAvailableServers };

export default { fetchAvailableServers };
