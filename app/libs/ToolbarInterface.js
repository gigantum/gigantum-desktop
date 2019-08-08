// @flow
import childProcess from 'child_process';
// libs
import Docker from './Docker';
import Gigantum from './Gigantum';

class ToolbarInterface {
  /**
   * Declare defaults here
   */
  docker = new Docker();

  gigantum = new Gigantum();

  /**
   * Defaults END
   */

  /**
   * @param {callback} callback
   * checks if docker is installed
   */
  check = callback => {
    const success = true;
    const data = {};
    const dockerPS = childProcess.spawn('docker', ['ps']);
    console.log(dockerPS, callback);

    return { success, data };
  };

  /**
   * @param {Function} callback
   * restarts gigantum container
   */
  restart = callback => {
    const success = true;
    const data = {};
    console.log(callback);
    return { success, data };
  };

  /**
   * @param {Function} callback
   * starts gigntum and docker
   */
  start = callback => {
    const success = true;
    const data = {};
    console.log(callback);
    return { success, data };
  };

  /**
   * @param {Boolean} closeDocker
   * @param {Function} callback
   * stops gigantum container
   * stops docker if closeDocker is true
   */
  stop = (callback, closeDocker) => {
    const success = true;
    const data = {};

    console.log(closeDocker, callback);
    return { success, data };
  };
}

export default ToolbarInterface;
