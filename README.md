# Bullhorn Extension Samples
Bullhorn offers several ways to customize the recruiter experience with code using custom tabs, custom cards, custom record actions, custom list actions, and more. In this repo are several examples to get you started building custom extensions fast using [Novo Elements](https://github.com/bullhorn/novo-elements).

### Prerequisites
 * [NodeJS](https://nodejs.org/en/) - version 10

#### For Windows Users
 * Because this repo reuses the same shared files for each example project, symlinks are used to avoid duplication. See [this guide](https://www.joshkel.com/2018/01/18/symlinks-in-windows/) for configuring your windows machine to allow unix symlinks.
 * Alternatively, you can copy/paste the files from the shared folder to a sample extension, replacing the symlinks where needed.
 
### Quick Start

```bash
# Clone the repo
git clone https://github.com/bullhorn/extension-samples

# CD into the project
cd extension-samples

# Install all required dependencies
npm install
npm install -g @angular/cli

# Start the app
npm start
```



Now, navigate to [http://localhost:3000/](http://localhost:3000/) in your browser and code!

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

### Testing

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Google Cloud Deployment

### Overview

The purpose of this document is to outline the steps necessary to deploy your application, within Google Cloud.

### Prerequisites

* Google Cloud Account

[https://cloud.google.com/free-trial/](https://cloud.google.com/free-trial/)

* Orchestration of the environment relies on the GCloud SDK.  

Please download and install the latest GCloud SDK from: [https://cloud.google.com/sdk/docs/#install_the_latest_cloud_tools_version_cloudsdk_current_version ](https://cloud.google.com/sdk/docs/#install_the_latest_cloud_tools_version_cloudsdk_current_version)

### Creating your project

From within google cloud go to **Create Project**.

![image alt text](doc_files/image_1.png)

### Connect your GCloud SDK to the cluster

Once you create your project, you need to set up your GCloud SDK with your project info.

`gcloud init`

### Deploy the App

Run `npm deploy` to deploy your app!

### Add to Bullhorn

Adding your app to Bullhorn as a custom card, custom tab, or page is easy. After logging into Bullhorn, from the menu, navigate to **Admin** then **View Layout**. ![image alt text](doc_files/image_2.png)

Inside View Layout, select the entity on which you would like your custom card (tab, page, etc.) to display. Select the **Custom Card** tab, and click **Add New** to create a new custom card. After you have input the information for your custom card, click save. 

![image alt text](doc_files/image_3.png)

Navigate to the entity where you added your custom card to see it live!

![image alt text](doc_files/image_4.png)
