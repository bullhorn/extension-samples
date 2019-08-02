// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,

  /**
   * AppBridge Config: Used for custom actions and menu items where there is a new bowling alley tab.
   *  - url: The url of the bowling alley tab (used for menu items, overwritten in AppBridge.service.ts dynamically for custom actions)
   *  - title: Overwrites the title of the bowling alley tab for a custom action.
   *  - color: Overwrites the color of the bowling alley tab for a custom action.
   */
  appBridgeConfig: {
    url: 'https://local.bullhornstaffing.com:4201',
    title: 'Extension Local',
    color: 'blue',
  },
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
import 'zone.js/dist/zone-error'; // Included with Angular CLI.
