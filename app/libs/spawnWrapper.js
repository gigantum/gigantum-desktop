import childProcess from 'child_process';
import os from 'os';
import fixPath from 'fix-path';

const isWindows = process.platform === 'win32';
const isMac = process.platform === 'darwin';

if (isMac) {
  fixPath();
}

export default {
  getSpawn: (command, arr) => {
    if (
      isWindows &&
      process.env.PATH &&
      process.env.PATH.indexOf('Docker') === -1
    ) {
      return childProcess.spawn(command, arr, {
        env: {
          PATH: `C:\\ProgramData\\DockerDesktop\\version-bin;C:\\Program Files\\Docker\\Docker\\Resources\\bin;${process.env.PATH}`
        }
      });
    }
    if (isMac) {
      return childProcess.spawn(command, arr, {
        env: {
          HOME: os.homedir(),
          PATH: process.env.PATH
        }
      });
    }
    try {
      return childProcess.spawn(command, arr, {
        env: {
          HOME: os.homedir()
        }
      });
    } catch (error) {
      return false;
    }
  }
};
