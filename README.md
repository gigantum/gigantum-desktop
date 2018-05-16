Gigantum Electron UI
====================

For now, first ensure you have yarn installed (if you're already in npm land,
you can `npm install -g yarn`, but yarn can also be installed directly by
various package managers), and then simply run `yarn` - this will install all
dependencies.

After packages are configured, `yarn start` is the way to go for development. If
you want to explore building the exe, you can use `yarn package` or `yarn make`
(FYI - make actually packages the results of package). `yarn flow` will run the
type-checker.

You can quit from the terminal by mashing ctrl-C, or by using the context menu
in the system tray. Also, I have not debugged the logic around checking the
socket on OS X.

Once you have the app running via `yarn start`, the package is currently
configured to expose a connection on the standard port for node inspection
(5858). You can connect via the chrome://inspect page in Chrome. For scant
information about this, you can check the docs for [debugging the main Electron
process](https://electronjs.org/docs/tutorial/debugging-main-process).

As of yet, Dav hasn't figured out how to use the Chrome inspector to provide
any useful information - there don't appear to be any variables in the current
scope, nor in the `global` object.

Currently updates are detected via github releases in the [electron-releases](https://github.com/gigantum/electron-releases) repo. If the version in your package.json is before the version of the latest release, it will trigger the autoupdating functionality.