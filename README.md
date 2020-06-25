# Gigantum Desktop

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fgigantum%2Fgigantum-desktop.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fgigantum%2Fgigantum-desktop?ref=badge_shield)

A desktop application created using Electron to install and operate the
[Gigantum](http://www.gigantum.com) client.

## Introduction

This application is provided as a method to install and run the Gigantum
Client, locally on your computer. It provides a simple interface to install,
update, start and stop the client. If you are looking to use the desktop
application, it is highly recommended that you download the existing latest
build for your operating system [here](http://www.gigantum.com/download).

For more information regarding the application, view our documentation
[here](https://docs.gigantum.com/docs/what-is-gigantum).

## Getting Started

### Pre-requisites

This project requires [Node.js](https://nodejs.org/en/)

#### Quick-start

```
git clone https://github.com/gigantum/gigantum-desktop.git
cd gigantum-desktop
npm install
npm start
```

### NPM scripts

`npm start`

> Starts the electron process on `src/main.js` and begins running the desktop application

`npm run build-mac`

> Starts the electron-builder process and creates a build for Mac OSX, generating a .dmg and .zip.

`npm run build-win`

> Starts the electron-builder process and creates a build for Windows, generating an .exe nsis installer.

`npm run build-lin`

> Starts the electron-builder process and creates a build for Linux, generating an .AppImage and .snap.

`npm run build-all`

> Starts the electron-builder process for all of the above operating systems.

## Contributing

Gigantum uses the [Developer Certificate of Origin](https://developercertificate.org/).
This is lightweight approach that doesn't require submission and review of a
separate contributor agreement. Code is signed directly by the developer using
facilities built into git.

Please see [`docs/contributing.md` in the gtm
repository](https://github.com/gigantum/gtm/tree/integration/docs/contributing.md).

## Credits

TODO

## Environment setup for build and deploying

### Environment

Request access to Gigantum's Apple developer accounts to get Developer Id App and Developer Id Installer certs. Certs will need to be copied from gigantum-desktop drive. // TODO add to drive

#### Github Token

1. Go to https://github.com/settings/tokens > personal access tokens > Generate new token
2. Give token permissions `repo` and `user`

Download `Gigantum.p12` from google drive folder and drop into the `secrets` directory. If you don't have a `secrets` directory create one at project root.

Create a `config.json` in your secrets directory.

```
{
  "github_token": "your_github_token",
  "cert_keyphrase": "cert_keyphrase_goes_here",
  "cert_directory": "secrets/Gigantum.p12", // don't need to set
  "apple_email": "your_apple_account_email_address",
  "apple_pass": "your_apple_account_password"
}
```

Run the following commands

```
  sudo xcode-select --install

  sudo xcode-select --reset

  brew install jq

```

### Deploying a Build

1. Update version in `package.json`

2. Update `IMAGE_TAG` and `CLIENT_VERSION` in `config/webpack.base.js`

3. Get size using `yarn image-size` and update the size in `app/libs/config.js`

4. Update `gigantum.releaseNotes.md` with latest notes.
   Add size after image tag.

   ```
   Image Tag: IMAGE_TAG (SIZE)
   ```

5. Run the `yarn deploy-all` and go to https://github.com/gigantum/gigantum-desktop/releases

6. Click edit on the draft release and add the release `README.md` for releases change logs.

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fgigantum%2Fgigantum-desktop.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fgigantum%2Fgigantum-desktop?ref=badge_large)
