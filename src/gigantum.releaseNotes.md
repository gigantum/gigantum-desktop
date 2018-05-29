## 2018-05-25

### Gigantum Client (0.8.1)

Image Tag: 4388c439 (212025636)

Image ID: 6d3b8809246e

* Added
  - Rollback capability for the primary workspace branch from within the Activity Feed
  - Activity record generation when a LabBook container is stopped
  - Activity record generation when a Jupyter notebook is saved
  - Activity record generation when files are swept up and committed during certain internal operations (e.g. pre-publish, switch branch, etc.)
  - "Action" modifiers on Activity records to better sort activity and improve UI/UX

* Improved
  - Activity feed UI
  - Activity feed now properly hides minor detail records
  - Activity feed now bundles 3+ minor activity records together to reduce clutter
  - Updated application containers to Ubuntu 18.04
  - Updated LabBook containers to Ubuntu 18.04
  - Custom Docker instructions now execute after all packages are installed
  - Added placeholder for LabBooks while loading

* Fixed
  - Minor bugs and UI clean up
  - Description is now properly set when creating a new branch
  - Selecting "Switch Branch" from the action menu scrolls to the top
  - LabBook tab menu doesn't flip out when you mouse over the wrong spot

* Known Issues
  - "Latest Version" lookup for packages has been temporarily removed from the "Environment" tab
  - Adding Conda packages is very slow


### Gigantum Desktop App (0.2.0)

* New
  - Updated Gigantum Client container to latest release 0.8.1

* Fixed
  - Minor UI bugs
  - Issues related to updates when disconnected from the internet


## 2018-05-16

### Gigantum Client (0.8.0)

Image Tag: 9de7af05 (459914384)

Image ID: 63f300779787

* Added
  - Readme to the Overview section
  - Ability to add a custom Docker snippet to a LabBook container build
  - New "Cloud" view to the LabBook listing screen, including the ability to import and delete LabBooks stored in the Gigantum Cloud
  - Collaborator usernames auto-complete while typing
  - Automatic `git gc` operations to reduce git repository size

* Improved
  - Package validation and version lookup now occurs in target LabBook container. Future additions will improve package lookup speed.
  - Improved import/publish/sync speed when there are lots of files in input and output sections of a LabBook
  - Activity feed now only loads data if being actively viewed, reducing load on the client and browser when working for a long time in Jupyter
  - Disconnect screen shows different instructions for Mac, Windows, and Linux
  - Share URLs updated to route through gigantum.com

* Fixed
  - Force merge dialog boxes now actually force merge
  - Favorite cards no longer stack incorrectly when resizing a page
  - 12pm is no longer displayed as 12am in the activity feed
  - Lots of minor bugs and UI clean up

* Known Issue
  - "Latest Version" lookup for packages has been temporarily removed from the "Environment" tab
  - Adding Conda packages is very slow


### Gigantum Desktop App (0.1.0)

* New
  - Initial Release 🎉
