import childProcess from 'child_process';
import fixPath from 'fix-path';
import os from 'os';

const isWindows = process.platform === 'win32';

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
    return childProcess.spawn(command, arr, {
      env: {
        PATH: path,
        HOME: os.homedir()
      }
    });
  }
};
