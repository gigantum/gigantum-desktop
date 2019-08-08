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
   * @param {} -
   *
   */
  check = () => {
    const success = true;
    const data = {};
    const dockerPS = childProcess.spawn('docker', ['ps']);
    console.log(dockerPS);

    return { success, data };
  };

  /**
   * @param {} -
   *
   */
  restart = () => {
    const success = true;
    const data = {};

    return { success, data };
  };

  /**
   * @param {} -
   *
   */
  start = () => {
    const success = true;
    const data = {};
    return { success, data };
  };

  /**
   * @param {} -
   *
   */
  stop = () => {
    const success = true;
    const data = {};
    return { success, data };
  };
}

export default ToolbarInterface;
