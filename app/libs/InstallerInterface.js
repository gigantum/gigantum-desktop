// @flow
// libs
import Docker from './Docker';
import Gigantum from './Gigantum';

class InstallerInterface {
  /**
   * Declare defaults here
   */
  docker = new Docker();

  gigantum = new Gigantum();

  /**
   * Defaults END
   */

  installDocker = () => {
    const success = true;
    const data = {};

    return { success, data };
  };

  installGigantum = () => {
    const success = true;
    const data = {};

    return { success, data };
  };
}

export default InstallerInterface;
