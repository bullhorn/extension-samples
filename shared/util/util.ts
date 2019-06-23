export class Util {
  /**
   * Sets the top level html class based on the type of extension being used. This allows
   * for dynamic styling to match bullhorn styling in the top level styles.scss stylesheet.
   */
  static setHtmlExtensionClass(extensionType: 'custom-card' | 'custom-tab' | 'custom-action') {
    document.documentElement.className = extensionType;
  }
}
