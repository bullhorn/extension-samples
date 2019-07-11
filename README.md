# Bullhorn Extension Samples
Bullhorn offers several ways to customize the recruiter experience with code using custom tabs, custom cards, custom record actions, custom list actions, and more. In this repo are several examples to get you started building custom extensions fast using [Novo Elements](https://github.com/bullhorn/novo-elements).

### Prerequisites
 * [NodeJS](https://nodejs.org/en/) - version 10

#### For Windows Users
 * Because this repo reuses the same shared files for each example project, symlinks are used to avoid duplication. See [this guide](https://www.joshkel.com/2018/01/18/symlinks-in-windows/) for configuring your windows machine to allow unix symlinks.
 * Alternatively, you can copy/paste the files from the shared folder to a sample extension, replacing the symlinks where needed.
 
### The Samples
| Sample Name        | Description                                                                    | Readme     |
|--------------------|--------------------------------------------------------------------------------|------------|
|1.HelloCard         | The hello world of custom cards that shows the data passed from Bullhorn.      | [View][#1]
|2.HelloTab          | The hello world of custom tabs that shows the data passed from Bullhorn.       | [View][#2]
|3.HelloRecordAction | The hello world of custom record actions that shows how to connect to AppBridge as an action and see the data passed from Bullhorn. | [View][#3]
|4.HelloListAction   | The hello world of custom list actions that shows how to connect to AppBridge as an action and see the data passed from Bullhorn, which can include multiple entities selected from the list. | [View][#4]
|5.HelloMenuItem     | A placeholder for the hello world of custom menu items.                        | [View][#5]
|6.ComparisonCard    | A sample card for Job records that shows the current job compared to other jobs in a scatter plot. | [View][#6]
|7.ForecastCard      | A sample card for Job records that shows the current job compared to other jobs in a line chart forecasting into the future. | [View][#7]
|8.ScoreCard         | A sample card for Job records that shows the current job's score, a contrived score that is calculated by some  scoring criteria as well as an expander and a list view. | [View][#8]
|9.RelatedJobsTab    | A sample tab for Job records that shows all jobs in the same state in a list view with the preview slideout and open window calls to jump to another job. | [View][#9]
|10.CandidateEditTab | A sample tab for Candidate records that shows an edit form for specific fields as well as custom toasts and modal dialogs. | [View][#10]

[#1]:01.HelloCard
[#2]:02.HelloTab
[#3]:03.HelloRecordAction
[#4]:04.HelloListAction
[#5]:05.HelloMenuItem
[#6]:06.ComparisonCard
[#7]:07.ForecastCard
[#8]:08.ScoreCard
[#9]:09.RelatedJobsTab
[#10]:10.CandidateEditTab

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

