## Hello Record Action

Creates VMS submittals and integrates into Bullhorn as a custom action. 

#### Install dependencies

```npm
`npm install
```

#### Development testing

In order to locally test the custom action from within Bullhorn (running at https://bullhornstaffing.com) we must run a local server with https that matches the domain. Modifying your host file will route traffic from local.bullhornstaffing.com to localhost.

##### Host file hack

Add the following line to your host file:
```
127.0.0.1    localhost    local.bullhornstaffing.com
```

Start the auto-refreshing server that can be tested within Bullhorn as a custom tab at `https://local.bullhornstaffing.com:4201/`:

```npm
npm start
```

In Chrome, when running locally, you must first grant access to the app the first time it is started, since it is running in secure mode. In a new browser tab, navigate to `https://local.bullhornstaffing.com:4201` and when the page "Your connection is not private" is displayed, click the "Advanced" button and then "Proceed to local.bullhornstaffing.com" to allow the browser to open the app. Close that window, then open the custom tab from within Bullhorn.

#### Build and deploy to cloud hosting

```npm
npm run deploy
```
Note: you may need to install the Firebase CLI before deploying the project (https://firebase.google.com/docs/cli/)

#### Integrate into Bullhorn

To integrate the custom action on a Job record, login to www.bullhornstaffing.com as an admin user and go to Admin (Novo) or Tools (S-Release) -> View Layout -> Job Posting -> Custom Menu Actions -> Select "Add New" and fill in the following details:

**Title:** Create VMS Submission

**Location:** In a record, on the menu

**URL:** https://sync-submittals.firebaseapp.com/submittal

**User Types:** (Novo Only) Include all user types that should have access to this tab.

**Enabled:** True

#### Dev Testing

For local dev testing within Bullhorn, add a custom tab with URL: https://local.bullhornstaffing.com:4201/submittal.

In order to dev test locally within a QA Environment, add custom tab with non-secure URL: http://local.bh-bos2.bullhorn.com:4201/submittal and run the app using `npm run start-qa`.
