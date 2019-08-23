// libs
import Docker from './Docker';

class UpdaterInterface {
  constructor(props) {
    this.props = { ...props };
  }

  /**
   * Declare defaults here
   */
  docker = new Docker();

  /**
   * @param {Function} callback
   * handles update gigantum
   * @calls {}
   */
  download = () => {};
}

export default UpdaterInterface;
