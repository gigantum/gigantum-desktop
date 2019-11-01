// vendor
import { execSync } from 'child_process';
import os from 'os';
import path from 'path';
// package
import { version } from '../../package.json';

let nvidiaConfig;

if (os.platform() === 'linux') {
  try {
    const rawNvidiaOutput = execSync(
      'nvidia-smi --query-gpu=driver_version --format=csv,noheader'
    ).toString();
    nvidiaConfig = `NVIDIA_DRIVER_VERSION=${rawNvidiaOutput.split('\n')[0]}`;
  } catch (error) {
    // TODO DC: Do we have a better standard way of reporting status?
    // I think we should avoid bare catches
    console.log('unable to run nvidia-smi - assuming no GPU');
  }
}

const isWindows = os.platform() === 'win32';
const hostDirectory = path.join(os.homedir(), 'gigantum');
const containerDirectory = isWindows
  ? `/${hostDirectory.replace(/\\|:\\/g, '/')}`
  : hostDirectory;
const envHost = isWindows
  ? 'WINDOWS_HOST=1'
  : `LOCAL_USER_ID=${os.userInfo().uid}`;

// gigantum image name
const imageLabel = 'gigantum/labmanager';
const imageTag = process.env.IMAGE_TAG;
const clientVersion = process.env.CLIENT_VERSION;

// env constants
const condaDir = 'CONDA_DIR=/opt/conda';
const shell = 'SHELL=/bin/bash';
const miniCondaVersion = 'MINICONDA_VERSION=4.3.31';
const lc = 'LC_ALL=C.UTF-8';
const lang = 'LANG=C.UTF-8';
const Env = [
  `HOST_WORK_DIR=${containerDirectory}`,
  envHost,
  condaDir,
  shell,
  miniCondaVersion,
  lc,
  lang
];

if (nvidiaConfig) {
  Env.push(nvidiaConfig);
}

export default {
  containerName: `${imageLabel}-${imageTag}`.replace(/\/|:/g, '.'),
  imageName: `${imageLabel}:${imageTag}`,
  imageLabel,
  imageTag,
  clientVersion,
  containerConfig: {
    Image: `${imageLabel}:${imageTag}`,
    ExposedPorts: {
      '10000/tcp': {}
    },
    HostConfig: {
      Init: true,
      Binds: [
        'labmanager_share_vol:/mnt/share:rw',
        '/var/run/docker.sock:/var/run/docker.sock:rw',
        `${containerDirectory}:/mnt/gigantum:${
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
    'failed'
  ],
  fileSize: 371961613,
  version
};
