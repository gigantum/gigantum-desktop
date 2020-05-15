// vendor
import os from 'os';
import path from 'path';
// package
import { version } from '../../package.json';

const hostDirectory = path.join(os.homedir(), 'gigantum');

// gigantum image name
const imageLabel = 'gigantum/labmanager';
const imageTag = process.env.IMAGE_TAG;
const clientVersion = process.env.CLIENT_VERSION;

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
  fileSize: 418487115,
  version
};
