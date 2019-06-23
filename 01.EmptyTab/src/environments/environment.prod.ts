export const environment = {
  production: true,

  /**
   * AppBridge Config:
   *  - url: The url where the custom tab is located (overwritten dynamically for custom actions)
   *  - title: Overwrites the title of the bowling alley tab for a custom action.
   *  - color: Overwrites the color of the bowling alley tab for a custom action.
   */
  appBridgeConfig: {
    url: 'https://bullhorn-extension.firebaseapp.com',
    title: 'Extension',
    color: 'neutral',
  },
};
