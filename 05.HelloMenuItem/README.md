## Hello Menu Item

The hello world of custom menu items that shows how to connect and get data from Bullhorn about the current user.

![Screenshot](../doc_files/hello-menu-item.png)

#### Prerequisites

 * [Host File Hack](../README.md#prerequisites) (One Time Only)

#### Install Dependencies

```npm
npm install
```

#### Run the App

 *  Serve the app at `https://local.bullhornstaffing.com:4201/`:
 
    > Ensure that in the file `app/environments/environment.ts`, the appBridgeConfig.url matches exactly
      the URL where the app is served in order to allow the app to register with appBridge.

    ```npm
    npm start
    ```

 * Follow the steps for [Viewing the App Locally](../README.md#viewing-the-app).

 * Custom menu items must be configured as a new menu item in Bullhorn Admin by support. 
   For a dev test custom menu item, the url of the dev test page will be:  
   https://local.bullhornstaffing.com:4201. Menu items are enabled per user type by support.
 
 * Open the main menu in Bullhorn, select your menu item, and view your custom menu item extension.
