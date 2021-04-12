// vendor
import os from 'os';
import path from 'path';
// package
import { version } from '../../package.json';

const hostDirectory = path.join(os.homedir(), 'gigantum');

// gigantum image name
const imageLabel = 'gigantum/labmanager';
const imageTag = 'd8367893';
const clientVersion = '1.5.1';

export default {
  containerName: `${imageLabel}-${imageTag}`.replace(/\/|:/g, '.'),
  imageName: `${imageLabel}:${imageTag}`,
  imageLabel,
  imageTag,
  clientVersion,
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
  fileSize: 341515353,
  version
};
