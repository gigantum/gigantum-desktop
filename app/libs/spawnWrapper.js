import childProcess from 'child_process';
import os from 'os';
import fixPath from 'fix-path';

fixPath();

console.log(process.env.PATH);

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
        HOME: os.homedir(),
        PATH: process.env.PATH
      }
    });
  }
};
