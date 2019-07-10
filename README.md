# Bullhorn Extension Samples
Bullhorn offers several ways to customize the recruiter experience with code using custom tabs, custom cards, custom record actions, custom list actions, and more. In this repo are several examples to get you started building custom extensions fast using [Novo Elements](https://github.com/bullhorn/novo-elements).

### Prerequisites
 * [NodeJS](https://nodejs.org/en/) - version 10

#### For Windows Users
 * Because this repo reuses the same shared files for each example project, symlinks are used to avoid duplication. See [this guide](https://www.joshkel.com/2018/01/18/symlinks-in-windows/) for configuring your windows machine to allow unix symlinks.
 * Alternatively, you can copy/paste the files from the shared folder to a sample extension, replacing the symlinks where needed.
 
### The Samples

TODO: Table with columns: Example (with link to Readme), Type, Description



### Adding to Bullhorn

Each project's `README.md` file has steps for integrating the custom app into Bullhorn. Adding your app to Bullhorn is easy. After logging into Bullhorn, from the menu, navigate to **Admin** then **View Layout**. ![image alt text](doc_files/image_2.png)

Inside View Layout, select the entity on which you would like your custom card (tab, page, etc.) to display. Select the **Custom Card** tab, and click **Add New** to create a new custom card. After you have input the information for your custom card, click save. 

![image alt text](doc_files/image_3.png)

Navigate to the entity where you added your custom card to see it live!

![image alt text](doc_files/image_4.png)




## Google Cloud Deployment

All samples come with convenient scripts ready to deploy to Google Firebase hosting. This makes it very easy to deploy your code with a single command, and to take advantage of Firestore for your cloud database as you build out your app.

### Prerequisites

* Google Cloud Account

    [https://cloud.google.com/free-trial/](https://cloud.google.com/free-trial/)

* Google Cloud SDK.

    [https://cloud.google.com/sdk/docs/#install_the_latest_cloud_tools_version_cloudsdk_current_version ](https://cloud.google.com/sdk/docs/#install_the_latest_cloud_tools_version_cloudsdk_current_version)

### Creating your project

From within google cloud go to **Create Project**.

![image alt text](doc_files/image_1.png)

### Connect your GCloud SDK to the cluster

Once you create your project, you need to set up your GCloud SDK with your project info.

`gcloud init`

