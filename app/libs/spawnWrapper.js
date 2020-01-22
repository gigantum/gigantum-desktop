import childProcess from 'child_process';
import fixPath from 'fix-path';

const isWindows = process.platform === 'win32';

export default {
  getSpawn: (command, arr) => {
    fixPath();
    let path = process.env.PATH;
    if (isWindows && process.env.PATH.indexOf('Docker') === -1) {
      path = `C:\\ProgramData\\DockerDesktop\\version-bin;C:\\Program Files\\Docker\\Docker\\Resources\\bin;${process.env.PATH}`;
    }
    return childProcess.spawn(command, arr, {
      env: {
        PATH: path
      }
    });
  }
};
