## Hello List Action

The hello world of custom list actions that shows the data passed from Bullhorn.

![Screenshot](../doc_files/hello-list-action.png)

#### Prerequisites

 * [Host File Hack](../README.md#prerequisites) (One Time Only)

#### Install Dependencies

```npm
npm install
```

#### Run the App

 *  Serve the app at `https://local.bullhornstaffing.com:4201/`:

    ```npm
    npm start
    ```

 * Follow the steps for [Viewing the App Locally](../README.md#viewing-the-app).

 * Follow the steps for [Adding the Extension to Bullhorn](../README.md#adding-to-bullhorn).

   * This is a special case for custom list actions only: The URL configured for the 
     extension will need to be adjusted to hit a redirect to convert POST to GET. 

     Because the custom list action performs a POST request with the selected Entity IDs, 
     we have to read the POST body on a server endpoint and convert the form variables to 
     GET query string parameters for consumption by our Angular App. We need to construct 
     an endpoint that can take a POST request and a URL and construct a GET request to the 
     given URL, converting the body received into query string params.
     
     If you have the name `my-project-name` as your google project, then create a NodeJS
     typescript cloud function, you can use this code here to generate the redirect:
     
     ```typescript
     import { https } from 'firebase-functions';
     import * as url from 'url';
     
     export const redirect = https.onRequest((request, response) => {
       response.redirect(url.format({
         pathname: request.query['url'],
         query: request.body,
       }));
     });
     ```

     Change the URL of the extension to:
     
     ```
     https://us-central1-my-project-name.cloudfunctions.net/redirect?url=https://local.bullhornstaffing.com:4201
     ```
 
 * Open a list in Bullhorn, select one or more records, open the Selected dropdown, and
   select _Your Custom Action_ and view your custom extension in a new Bullhorn tab.
