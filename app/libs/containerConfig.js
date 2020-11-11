// env constants
import { execSync } from 'child_process';
import os from 'os';
import path from 'path';

// gigantum image name
const imageLabel = 'gigantum/labmanager';
const imageTag = process.env.IMAGE_TAG;

let nvidiaConfig;
const isLinux = os.platform() === 'linux';
const isWindows = os.platform() === 'win32';

if (isLinux || isWindows) {
  try {
    const rawNvidiaOutput = execSync(
      'nvidia-smi --query-gpu=driver_version --format=csv,noheader'
    ).toString();
    const nvidiaVersions = rawNvidiaOutput.split('\n')[0].split('.');
    const formattedNvidiaVersion = `${nvidiaVersions[0].nvidiaVersions[1]}`;
    nvidiaConfig = `NVIDIA_DRIVER_VERSION=${formattedNvidiaVersion}`;
  } catch (error) {
    // TODO DC: Do we have a better standard way of reporting status?
    // I think we should avoid bare catches
    console.log('unable to run nvidia-smi - assuming no GPU');
  }
}

const hostDirectory = path.join(os.homedir(), 'gigantum');

const envHost = isWindows
  ? 'WINDOWS_HOST=1'
  : `LOCAL_USER_ID=${os.userInfo().uid}`;

/**
 * @param {object} dockerode
 * @param {function} dockerode
 * runs container to get the mount path for the client container for windows
 */
const dockerizeMountPath = (dockerode, callback) => {
  /**
   * @param {object} err
   * @param {object} data
   * @param {object} container
   * rewrites working directory path for windows, stops and removes container
   */
  const inspectResponse = (err, data, container) => {
    container.stop({}, () => {
      container.remove();
    });
    const rewrittenWorkDirectory = data.Mounts[0].Source;

    configReturn(rewrittenWorkDirectory, callback);
  };

  /**
   * @param {object} err
   * @param {object} data
   * @param {object} container
   * runs temp container to get mount source
   */
  const runResponse = (err, data, container) => {
    container.inspect((inpesctErr, inpesctData) => {
      inspectResponse(inpesctErr, inpesctData, container);
    });
  };

  dockerode.run(
    `${imageLabel}:${imageTag}`,
    ['-f', '/dev/null'],
    process.stdout,
    {
      Entrypoint: '/usr/bin/tail',
      HostConfig: {
        Binds: [`${hostDirectory}:/mnt/gigantum`]
      }
    },
    {
      Detach: true
    },
    runResponse
  );
};

/**
 * @param {string} containerDirectory
 * @param {function} callback
 * gets config object for gigantum container
 */
const configReturn = (containerDirectory, callback) => {
  const Env = [`HOST_WORK_DIR=${containerDirectory}`, envHost];

  if (nvidiaConfig) {
    Env.push(nvidiaConfig);
  }

  callback({
    Image: `${imageLabel}:${imageTag}`,
    ExposedPorts: {
      '10000/tcp': {}
    },
    HostConfig: {
      Init: true,
      Binds: [
        'labmanager_share_vol:/mnt/share:rw',
        '/var/run/docker.sock:/var/run/docker.sock:rw',
        `${hostDirectory}:/mnt/gigantum:${
          os.platform() === 'darwin' ? 'cached' : 'rw'
        }`
      ],
      PortBindings: {
        '10000/tcp': [
          {
            HostPort: '10000'
          }
        ]
      },
      Volumes: {},
      Tty: false
    },
    Env
  });
};

export default (dockerode, callback) => {
  if (isWindows) {
    dockerizeMountPath(dockerode, callback);
  } else {
    configReturn(hostDirectory, callback);
  }
};
