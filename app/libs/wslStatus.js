import childProcess from 'child_process';

export default (wslReadyCallback, wslEnabledCallback, wslDisabledCallback) => {
  const wslCheck = childProcess.spawn('powershell', ['wsl', '-l']);
  /* Runs if WSL command does not respond with error */
  wslCheck.on('close', code => {
    if (code === 0) {
      if (wslReadyCallback) {
        wslReadyCallback();
      }
    }
  });

  /* If WSL response returns data, this determines wether WSL is installed despite exit code being non-0  */
  wslCheck.stderr.on('data', data => {
    const repositoryUninstalled =
      data
        .toString()
        .split('\n')[0]
        .replace(/[^a-zA-Z ]/g, '') ===
      'Windows Subsystem for Linux has no installed distributions';
    if (repositoryUninstalled) {
      if (wslEnabledCallback) {
        wslEnabledCallback();
      }
    } else if (wslDisabledCallback) {
      wslDisabledCallback();
    }
  });
  wslCheck.stdout.on('data', data => {
    const repositoryUninstalled =
      data
        .toString()
        .split('\n')[0]
        .replace(/[^a-zA-Z ]/g, '') ===
      'Windows Subsystem for Linux has no installed distributions';
    if (repositoryUninstalled) {
      if (wslEnabledCallback) {
        wslEnabledCallback();
      }
    }
  });
};
