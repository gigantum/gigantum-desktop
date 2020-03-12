## 2020-01-23

### Gigantum Client (1.2.1)

Image Tag: fa7d5e79

Image ID: ec37c98986

**Note: Due to changes made in preparation of web browser updates coming in February 2020, you must be running v1.1.0 or later!**

* Changed
  * Base image configuration is updated in the background instead of at Client start, reducing startup time (#1190)
  * Updated demo project Base to the latest revision

* Fixed
  * Fixed intermittent issue when inserting sensitive files into a running Project container (#1219)
  * Fixed crashing upload workers when a very large number of files are uploaded (#1209)
  * Fixed issues with file browser getting stuck in locked state when an invalid upload is attempted (#1225)
  * Build status modal now closes on completion properly in both local and Hub deployments (#1207)
​

## 2020-01-14

### Gigantum Client (1.2.0)

Image Tag: 2e28613d (386059543)

Image ID: 0ec7bf07d7

* New
  * Completed changes needed for running the Client directly in Gigantum Hub

* Changed
  * Updated container build messaging to include escape characters, better handling output from some tools such as conda. Note, Docker pull output is still merged and will be fixed in a future release.

* Fixed
  * Completed large refactor to reduce errors induced by redux managing project and dataset namespace (#1152)
  * Fixed bug when dragging and dropping nested folders in the file browser widget (#1179)
  * Fixed issue that occasionally prevented the collaborator modal from opening (#1189)
  * Fixed issue with package manager cancel button (#1188)
  * Various minor UI/UX and CSS fixes


## 2019-12-18

### Gigantum Client (1.1.0)

Image Tag: 889a4463 (384834751)

Image ID: 83a9e7ed8e

* New
  * Added support for user defined CA certificates. Place your `.crt` files in the `~/gigantum/certificates` directory and the Client and Projects will be automatically configured.
  * Added preparations for updating authentication to use only 1st party cookies

* Changed
  * Completed refactor that enables launching the Client in Gigantum Hub
  * Updated logos and colors
  * Updated to Node 11 when building the UI

* Fixed
  * Fixed issue with creating folders in the untracked folder (#1126)
  * Fixed issue with deleting datasets in Gigantum Hub (#1157)
  * Fixed issue with the collaborator modal not appearing in some cases (#1157)
  * Various minor UI/UX and CSS fixes

## 2019-10-06

### Gigantum Client (1.0.1)

Image Tag: f9bf31ee (379141415)

Image ID: 921a12e462

**This is a required update for all users! You must update to enable syncing with the new gigantum.com**

- New

  - Added support for new Gigantum Hub API (#1100,#1066).
  - Added button to trigger a no-cache rebuild of a Docker image on the build modal, if a build fails. This is useful for forcing apt package repositories to update during the build process.

- Changed

  - Improved login experience that uses gigantum.com (#1091).
  - Minor cleanup to make secret file directories owned by giguser (#1076)

- Fixed
  - Update pillow to 6.2.0 for CVE-2019-16865 (#1094)
  - Fixed issue when importing via a link provided by Gigantum Hub
  - Fixed issues related to deleting files in the untracked folder
  - Updated color palette, logo, UI polish and CSS bug fixes

## 2019-10-05

### Gigantum Client (1.0.0)

Image Tag: 642c8200 (379141407)

Image ID: bc87293744

**This is a required update for all users! You must update to enable syncing with the new gigantum.com**

- New

  - Added support for new Gigantum Hub API (#1100,#1066).
  - Added button to trigger a no-cache rebuild of a Docker image on the build modal, if a build fails. This is useful for forcing apt package repositories to update during the build process.

- Changed

  - Improved login experience that uses gigantum.com (#1091).
  - Minor cleanup to make secret file directories owned by giguser (#1076)

- Fixed
  - Update pillow to 6.2.0 for CVE-2019-16865 (#1094)
  - Fixed issues related to deleting files in the untracked folder
  - Updated color palette, logo, UI polish and CSS bug fixes

## 2019-07-20

### Gigantum Client (0.13.1)

Image Tag: c21042b3 (371961613)

Image ID: a5a44a8e5c

**Note: 0.13.0 (released on 2019-07-12) contained a bug that resulted in corruption of large files in some scenarios during upload. If you uploaded any files with this version over 16MB you should re-upload them or verify content. There is a chance those files are corrupt. This release fixes this issue and uploads of any supported file size are now reliable.**

- Changed

  - Added CUDA 10.1 driver support
  - Client now remembers which development tool has been selected between sessions
  - Added an "advanced configuration" accordion to the environment tab to reduce clutter for casual users

- Fixed
  - Fixed critical bug that resulted in corruption of large files in some scenarios during upload.
  - Fixed issue that resulted in a page refresh being required to view new files in a Dataset after syncing
  - Fixed save hook in Jupyter/Jupyterlab when using Python <3.5 (thanks @jjwatts!)
  - Fixed worker configuration
  - Fixed issue with computing Dataset file push batches when the manifest has been edited before the push occurs
  - Fixed UI coloring during rollback interaction
  - UI polish and CSS bug fixes

## 2019-07-12

### Gigantum Client (0.13.0)

Image Tag: b1472a55 (371935285)

Image ID: dc1b357ef7

- Changed
  - Enhanced and streamlined look-and-feel.
  - Much more simplified package installation process.
  - Ability to change and update a project's base.
  - Support for sensitive files (such as credentials or keys).
  - Better support for multi-user Gigantum client (Load balancing of workers).
  - Can now drag-and-drop a requirements.txt file to quickly create an environment.
  - Many optimizations to Datasets.
  - Dramatic enhancement to file browser.

* Fixed
  - GPU support on certain platforms and base-images.
  - Better support for publish/syncing on Projects with linked Datasets.
  - Removed option for "Untracked" Projects.

## 2019-05-29

### Gigantum Client (0.12.0)

Image Tag: 8697d47a (360444151)

Image ID: f2e5a0af19

- Changed

  - Support for R-Studio!
  - Many small UI improvements and fixes.
  - Less-aggressive filename renaming.

- Fixed
  - Low disk warning appears properly when less than 3GB of Docker space remain.
  - Inscrutable error message fixed to something clear when credentials have expired.

## 2019-05-09

### Gigantum Client (0.11.3)

Image Tag: 7458af46 (368515323)

Image ID: 5bdb5f1f2b

- Changed

  - Improved UI look-and-feel and user experience.

- Fixed
  - Clarified error message when attempting to publish or sync with stale credentials.
  - Updated Guide messaging for datasets.
  - Datasets with no readme now indicate as such, rather than being blank
  - Fixed text overflow when project names are very long.
  - No longer have to refresh cloud page; updates are automatic.
  - Many other miscellaneous styling updates.

## 2019-04-29

### Gigantum Client (0.11.2)

Image Tag: 906701a4 (368514377)

Image ID: 8c5385e0ff

- New

  - Ability to cancel a container build.
  - New query for system use such as memory and disk use

- Changed

  - Improved UI look-and-feel.

- Fixed
  - Fixed problem relating to dataset linking when doing branch reset or switch.
  - Fixed problem when publishing private projects and datasets together with different collaborators.
  - Improved management of remote branches.
  - Fixed issue of endless paging through files in dataset.

## 2019-03-15

### Gigantum Client (0.11.1)

Image Tag: ced4b103 (362604578)

Image ID: d2c9d0d0fc

- New

  - Not much! This release is all about usability enhancements!

- Changed

  - Better clean up when Linking Datasets.
  - Importing large projects from remote is more clear.
  - Better-performing package version lookups.

- Fixed

  - Linking Datasets on Windows machines.
  - Fixed an endless-scrolling problem when viewing activity feed.
  - Fixed many CSS and styling glitches.

- Known Issues
  - Certain adblockers may interfere with proper functioning of app.
  - Do not switch to master branch before migration (causes project to become unusable).
  - Publishing datasets from Project page can cause issues (suggested to publish dataset first).

### Gigantum Desktop App (0.5.10)

- New
  - Updated Gigantum Client container to latest release 0.11.1

## 2019-03-05

### Gigantum Client (0.11.0)

Image Tag: 01704121 (362604578)

Image ID: 95ae3430e3

- New

  - Initial support for Gigantum-managed Datasets (!)
  - New pull-only sync option to allow public users to roll in upstream changes.
  - New permissions model for collaborators, including read-only, read/write, and admin.
  - New reset-to-remote functionality to reset current branch to discard all local changes.
  - New branch menu on project main page with more options.
  - New counter widget showing how many commits current branch is ahead/behind remote.
  - New default demo project loaded on first launch.
  - Ability for project owner to migrate project to new schema.
  - Backwards compatibility for old Gigantum projects

- Changed

  - Master branch is now project default branch.
  - Updated Project data model to schema version 2.
  - Arbitrary branches may now be shared among collaborators.
  - Better options to select mine/theirs changes when conflicts occur.
  - Better support for GPUs.
  - Option to show/hide/ignore certain activity records.

- Fixed

  - Application styling and usability.
  - Faster load times for Project and Project-listing pages.
  - Anonymous users of public projects can receive upstream updates.
  - Fixed race-condition issue when caching user identity.

- Known Issues
  - Certain adblockers may interfere with proper functioning of app.
  - Do not switch to master branch before migration (causes project to become unusable).
  - Publishing datasets from Project page can cause issues (suggested to publish dataset first).

### Gigantum Desktop App (0.5.9)

- New
  - Updated Gigantum Client container to latest release 0.11.0
  - GPU environment variable used while initializing docker image
  - Changed how network connection is checked

## 2019-01-17

### Gigantum Client (0.10.4)

Image Tag: c10b08eb (293060979)

Image ID: f44d6c555d3c

- Fixed

  - Fixed bug when logging into a Client instance for the first time. This prevented certain actions until the page was refreshed and also occasionally resulted in blocking the ability to publish and sync.

- Known Issues
  - Container builds with conda packages are not yet optimized and can be slow
  - Maximum size of an individual file upload is currently limited to 1.8GB

### Gigantum Desktop App (0.5.8)

- New
  - Updated Gigantum Client container to latest release 0.10.4

## 2019-01-03

### Gigantum Client (0.10.3)

Image Tag: 99b76958 (293018113)

Image ID: ba5793a22286

- New
  - Drastically new and improved file browser

* Fixed
  - Gigantum client now works when browser uses an adblocker.
  - Corrupted projects no longer cause client to crash.
  - Occasional UI glitch when querying for publish/sync status fixed.
  - No more double-login problems.
  - Backend code consolidations.

- Known Issues
  - Container builds with conda packages are not yet optimized and can be slow
  - Maximum size of an individual file upload is currently limited to 1.8GB

### Gigantum Desktop App (0.5.7)

- Fixed

  - On start/stop, only Gigantum-managed containers are cleaned up.

- New
  - Updated Gigantum Client container to latest release 0.10.3

## 2018-11-12

### Gigantum Client (0.10.2)

Image Tag: 0a74d140 (292757703)

Image ID: 018e65728a34

- Fixed

  - Fixed issue where some Projects would fail to sync and merge conflicts would not be automatically resolved.
  - Container status widget now properly indicates publish and sync operations are in progress.

- Known Issues
  - Container builds with conda packages are not yet optimized and can be slow
  - Maximum size of an individual file upload is currently limited to 1.8GB

### Gigantum Desktop App (0.5.6)

- New
  - Updated Gigantum Client container to latest release 0.10.2

## 2018-10-26

### Gigantum Client (0.10.1)

Image Tag: 0315279c (292684424)

Image ID: 569087af61ed

- New \* Added ability to launch multiple development environments (currently JupyterLab and Classic Notebook) (#57)

- Improved

  - On build error, error message and build output message are now properly linked as one message (#5)
  - On JupyterLab start, the user is automatically placed in the `/code` directory (#20)
  - Import, publish, and sync now run as background jobs, supporting larger projects (#103)
  - Improved zip handling for import/export (#99)
  - Reduced excessive printing to build message during conda installs (#100)
  - Added `--no-install-recommends` to apt packkages on install (#100)
  - Updated cloud project listing tab to include more useful information and interactions (#74)
  - Minor UI cleanup and improvements

- Fixed

  - Resolved issue for some users who would see a proxy error on JupyterLab start under certain circumstances (#102)
  - Updated Auth0.js to resolve new vulnerability (#67)
  - Fixed wrapping issues with long usernames, branch names, and descriptions

- Known Issues
  - Container builds with conda packages are not yet optimized and can be slow
  - Maximum size of an individual file upload is currently limited to 1.8GB

### Gigantum Desktop App (0.5.5)

- New

  - Updated Gigantum Client container to latest release 0.10.1

- Fixed
  - Quiting the app from the dock/taskbar now properly calls all cleanup methods

## 2018-09-06

### Gigantum Client (0.10.0)

Image Tag: 36e27262 (243665950)

Image ID: ace6c07d0b0b

- New \* Added ability to publish both public and private projects

- Improved

  - Import projects now show build progress
  - Base images updated to latest package versions
  - Added additional error handling during environment component checkout

- Fixed

  - Membership is now properly enforced when listing cloud projects
  - Fixed bug with using Gigantum Client offline when starting cold without an internet connection
  - Added retry on remote project creation during publish
  - Fixed issues related to latest package version lookups
  - Sync and publish are now properly locked during export
  - Readme editing is now properly locked during sync and publish

- Known Issues
  - Container builds with conda packages are not yet optimized and can be slow
  - Maximum size of an individual file upload is currently limited to 1.8GB

### Gigantum Desktop App (0.5.4)

- New

  - Updated Gigantum Client container to latest release 0.10.0

- Fixed
  - Fixed issue with container naming convention
  - Fixed issue with docker being reported as not running when the Gigantum Client container fails to start

## 2018-08-10

### Gigantum Client (0.9.4)

Image Tag: 75efef53 (244853862)

Image ID: ba10850e1beb

- New
  _ Added notification tray that provides a better display of messages along with the ability to see previous messages
  _ Added the ability to view build output from Docker in the notification tray
  _ Added additional hashing of the environment configuration to avoid unnecessary container re-builds on things like sync and checkout
  _ Added link to feedback form accessible from help menu

- Improved

  - Improved utiliziation of the Docker build cache by adjusting the order of some build instructions added to containers by the Gigantum Client
  - Authentication token refresh now happens automatically in the background, reducing the number of times a user needs to log in to access cloud resources
  - Improved API down page text and help documentation

- Fixed

  - Fixed bug in Project sorting that resulted in wrong sort order
  - Fixed bug that prevented the correct environment configuration from being displayed in the UI after switching branches
  - Starting a container while editing the environment is now properly blocked during package validation
  - Fixed bug that was causing any uploaded zip file to trigger an import

- Known Issues
  - Container builds with conda packages are not yet optimized and can be slow
  - Maximum size of an individual file upload is currently limited to 1.8GB

### Gigantum Desktop App (0.5.3)

- New

  - Updated Gigantum Client container to latest release 0.9.4

- Improved
  - Clarified version information in About window

## 2018-07-27

### Gigantum Client (0.9.3)

Image Tag: 8bcd4c2f (245020714)

Image ID: ae1d455bb34e

- Improved

  - Auto-commit skipped on Jupyter Save Hook when any kernels related to the Project are still busy. This eliminates excessive versioning during long-running cells that write data to disk.
  - Added styling to Dockerfile snippet rendering

- Fixed

  - Fixed latest version lookups for package managers to complete more efficiently and not block builds. This was particularly an issue when using conda.
  - Fix bug that resulted in Activity Records being set to "Project" type instead of a more specific type (e.g. Code, Input Data)
  - When deleting a remote Project, it is removed from the list without needing a refresh

- Known Issues
  - Maximum size of an individual file upload is currently limited to 1.8GB

### Gigantum Desktop App (0.5.2)

- New
  - Updated Gigantum Client container to latest release 0.9.3

## 2018-07-20

### Gigantum Client (0.9.2)

Image Tag: 9ad016cd (244522922)

Image ID: 3f7dd645acac

- Added

* Improved

  - Updated Base selection UI and detail view

* Fixed

  - Fixed bug that was silently blocking container build when installing conda packages due to a race condition with latest version lookups
  - Fixed bug that sometimes made drag-and-drop to import a project fail to start uploading, requiring multiple attempts to drag-and-drop
  - Fixed bug that caused the add package widget to get stuck in an unusable state if you added a single package twice in a row

* Known Issues
  - Maximum size of an individual file upload is currently limited to 1.8GB

### Gigantum Desktop App (0.5.1)

- New
  - Updated Gigantum Client container to latest release 0.9.2

# 2018-07-16

### Gigantum Client (0.9.1)

Image Tag: 6f19937d (246462735)

Image ID: 486bb97862d2

- Added

  - Help interface, providing quick access to docs, help, and guide
  - Added real-time metadata to background jobs (improved UI in next release)
  - LabBooks have been renamed to Projects
  - Added latest version lookup and interface to update packages

- Improved

  - During file uploads, directories are automatically created without additional API calls, boosting upload performance
  - .lbk files are now .zip to make it more clear they are simply archives
  - User identity retrieval and local caching for offline use now done with JWTs

- Fixed

  - File based import/export uses improved archive method to fix issues seen when moving between windows and mac/linux
  - Fixed issue that limited the cloud view from listing more than 20 projects
  - Fixed bug that caused slow responses and high CPU when listing lots of files in the file brower widgets
  - Fixed issues related to container build status UI
  - Fixed additional minor bugs and UI clean up

- Known Issues
  - Maximum size of an individual file upload is currently limited to 1.8GB

### Gigantum Desktop App (0.5.0)

- New

  - Updated Gigantum Client container to latest release 0.9.1
  - Added crash reporting

- Fixed
  - Gigantum Desktop no longer blocks restart on macOS
  - Bind mount mode is set to cached only on macOS

## 2018-06-27

### Gigantum Client (0.9.0)

Image Tag: df4dbd9a (268290698)

Image ID: 4a55a8dcedc8

- Added

  - All traffic now runs behind an HTTP proxy, allowing the application and all jupyter servers to run on a single port

- Improved

  - Package manager add and remove operations are now batched into a single Activity Record
  - Package manager version lookups are now batched
  - Improved the LabBook listing filter and search UI

- Fixed

  - Fixed a session caching bug, which caused an error on load if token has expired
  - Added a temporary patch for running JupyterLab in python2
  - Fixed bug so containers are re-built on rollback
  - Minor bugs and UI clean up

- Known Issues
  - "Latest Version" lookup for packages has been temporarily removed from the "Environment" tab
  - Maximum size of an individual file upload is currently limited to 1.8GB

### Gigantum Desktop App (0.4.0)

- New

  - Updated Gigantum Client container to latest release 0.9.0

- Fixed
  - Gigantum Desktop no longer blocks a restart on macOS

## 2018-06-12

### Gigantum Client (0.8.2)

Image Tag: 779847b0 (209566418)

Image ID: 7582a9bfc1f5

- Added

  - Initial support for R in JupyterLab

- Improved

  - Updated file uploads to "batch" into a single activity record
  - Updated date widget to stick to the top of the activity feed
  - Updated Activity bundling interface
  - Updated LabBook submenu to be visible when scrolling through activity feed
  - Updated LabBook listing page to load progressively
  - Reorganized filters and added search to LabBook listing page

- Fixed

  - Minor bugs and UI clean up
  - When deleting a Cloud LabBook that still exists locally, the git configuration is now updated so you can re-publish without error
  - An error during publish no longer breaks future LabBook syncs

- Known Issues
  - "Latest Version" lookup for packages has been temporarily removed from the "Environment" tab
  - Adding Conda packages is very slow

### Gigantum Desktop App (0.3.0)

- New
  - Updated Gigantum Client container to latest release 0.8.2

## 2018-05-25

### Gigantum Client (0.8.1)

Image Tag: 4388c439 (212025636)

Image ID: 6d3b8809246e

- Added

  - Rollback capability for the primary workspace branch from within the Activity Feed
  - Activity record generation when a LabBook container is stopped
  - Activity record generation when a Jupyter notebook is saved
  - Activity record generation when files are swept up and committed during certain internal operations (e.g. pre-publish, switch branch, etc.)
  - "Action" modifiers on Activity records to better sort activity and improve UI/UX

- Improved

  - Activity feed UI
  - Activity feed now properly hides minor detail records
  - Activity feed now bundles 3+ minor activity records together to reduce clutter
  - Updated application containers to Ubuntu 18.04
  - Updated LabBook containers to Ubuntu 18.04
  - Custom Docker instructions now execute after all packages are installed
  - Added placeholder for LabBooks while loading

- Fixed

  - Minor bugs and UI clean up
  - Description is now properly set when creating a new branch
  - Selecting "Switch Branch" from the action menu scrolls to the top
  - LabBook tab menu doesn't flip out when you mouse over the wrong spot

- Known Issues
  - "Latest Version" lookup for packages has been temporarily removed from the "Environment" tab
  - Adding Conda packages is very slow

### Gigantum Desktop App (0.2.0)

- New

  - Updated Gigantum Client container to latest release 0.8.1

- Fixed
  - Minor UI bugs
  - Issues related to updates when disconnected from the internet

## 2018-05-16

### Gigantum Client (0.8.0)

Image Tag: 9de7af05 (459914384)

Image ID: 63f300779787

- Added

  - Readme to the Overview section
  - Ability to add a custom Docker snippet to a LabBook container build
  - New "Cloud" view to the LabBook listing screen, including the ability to import and delete LabBooks stored in the Gigantum Cloud
  - Collaborator usernames auto-complete while typing
  - Automatic `git gc` operations to reduce git repository size

- Improved

  - Package validation and version lookup now occurs in target LabBook container. Future additions will improve package lookup speed.
  - Improved import/publish/sync speed when there are lots of files in input and output sections of a LabBook
  - Activity feed now only loads data if being actively viewed, reducing load on the client and browser when working for a long time in Jupyter
  - Disconnect screen shows different instructions for Mac, Windows, and Linux
  - Share URLs updated to route through gigantum.com

- Fixed

  - Force merge dialog boxes now actually force merge
  - Favorite cards no longer stack incorrectly when resizing a page
  - 12pm is no longer displayed as 12am in the activity feed
  - Lots of minor bugs and UI clean up

- Known Issue
  - "Latest Version" lookup for packages has been temporarily removed from the "Environment" tab
  - Adding Conda packages is very slow

### Gigantum Desktop App (0.1.0)

- New
  - Initial Release 🎉
