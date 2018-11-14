import path from 'path';
import os from 'os';
import { version } from '../package.json';

const isWindows = os.platform() === 'win32';
const hostDirectory = path.join(os.homedir(), 'gigantum');
const containerDirectory = isWindows ? `/${hostDirectory.replace(/\\|:\\/g, '/')}` : hostDirectory;
const envHost = isWindows ? 'WINDOWS_HOST=1' : `LOCAL_USER_ID=${os.userInfo().uid}`;

// gigantum image name
const imageLabel = 'gigantum/labmanager';
const imageTag = '0a74d140';
const clientVersion = '0.10.2';

//env constants
const condaDir = "CONDA_DIR=/opt/conda";
const shell = "SHELL=/bin/bash";
const miniCondaVersion = "MINICONDA_VERSION=4.3.31";
const lc = "LC_ALL=C.UTF-8";
const lang = "LANG=C.UTF-8";

export default {
  containerName: `${imageLabel}-${imageTag}`.replace(/\/|:/g, '.'),
  imageName: `${imageLabel}:${imageTag}`,
  imageLabel,
  imageTag,
  clientVersion,
  containerConfig: {
    Image: `${imageLabel}:${imageTag}`,
    ExposedPorts: {
      '10000/tcp': {},
    },
    HostConfig: {
      Init: true,
      Binds: [
        'labmanager_share_vol:/mnt/share:rw',
        '/var/run/docker.sock:/var/run/docker.sock:rw',
        `${containerDirectory}:/mnt/gigantum:${os.platform() === 'darwin' ? 'cached': 'rw'}`,
      ],
      PortBindings: {
        '10000/tcp': [{
          HostPort: '10000',
        }],
      },
      Volumes: {},
      Tty: false,
    },
    Env: [`HOST_WORK_DIR=${containerDirectory}`, envHost, condaDir, shell, miniCondaVersion, lc, lang],
  },
  hostDirectory,
  defaultUrl: 'http://localhost:10000/',
  docUrl: 'https://docs.gigantum.com/',
  windows: [
    'docker',
    'closing',
    'portInUse',
    'install',
    'restarting',
    'update',
    'updateInfo',
    'about',
    'acknowledgements',
    'updateReady',
    'releaseNotes',
    'failed',
  ],
  fileSize: 292757703,
  version,
};
