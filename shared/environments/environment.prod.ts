export const environment = {
  production: true,

  /**
   * AppBridge Config: Used for custom actions and menu items where there is a new bowling alley tab.
   *  - url: The url of the bowling alley tab (overwritten in AppBridge.service.ts dynamically)
   *  - title: Overwrites the title of the bowling alley tab for a custom action.
   *  - color: Overwrites the color of the bowling alley tab for a custom action.
   */
  appBridgeConfig: {
    url: 'https://bullhorn-extension.firebaseapp.com',
    title: 'Extension',
    color: 'neutral',
  },
};
