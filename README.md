# My ChatGPT
This is a full-scale chatbot interface similar to ChatGPT, developed using MERN stack and OpenAI API.


## Features

1. #### User Authentication

    - Implemented a sign-up and sign-in system through email integration
    - Used email confirmation for account creation (sending verification emails)
    - Ensured secure user authentication mechanisms
    - Added advanced user authentication to allow users to log in with social media accounts such as Google and/or Microsoft

2. #### Chat Interface

    - Designed a user-friendly interface to interact with the chatbot.
    - This interface is responsive, supports real-time messaging and has light/dark mode

3. #### Conversation Functionality

    - Auto saves conversation in the database so users can view past conversation history
    - Implemented functionality to retrieve and display past conversations to the users

4. #### OpenAI Integration

    - For simplicity, integrated with the OpenAI API to generate chatbot responses (model: gpt-3.5-turbo-instruct)

5. #### Analytics Dashboard

    - Created an admin dashboard to monitor chatbot usage, statistics, and other relevant metrics
    - Visualized real-time data with charts and graphs to provide insight on chatbot performance and user engagement



## Prerequisites

Make sure you have installed all of the following prerequisites on your development machine:

- Node Js & Npm [Download and Install](https://nodejs.org/en)
- MongoDB [Download and Install](https://www.mongodb.com/docs/manual/installation/)
- Git [Download and Install](https://git-scm.com/downloads)

- Get your OpenAI Api key from https://openai.com/api/

## Technology Used

#vite #reactjs #scss #redux-toolkit

#nodejs #expressjs #mongodb #jsonwebtoken 

#javascript #openai #cookies 

## Environment Variables

To run this project, add the following environment variables to your .env file in server directory

`PORT` # Port number

`MONGO_URL` # MongoDB Connection URL

`SITE_URL` # Frontend URL

`JWT_PRIVATE_KEY` # JWT Authentication Key (Self made)

`OPENAI_API_KEY` # OpenAI API Key

`OPENAI_ORGANIZATION` # OpenAI Organization ID

`MAIL_EMAIL` # Email ID from which the mail should be sent

`MAILTRAP_USER` # Mailtrap Integration Username

`MAILTRAP_PASS` # Mailtrap Integration Password

To run this project, add the following environment variables to your .env.local file in client directory

`VITE_CLIENT_ID` # Google login api client id

`VITE_ADMIN_ID` # Admin access user id 

## Run Locally

Clone the project

```bash
  git clone https://github.com/meet1399/My-Chatgpt.git
```

### To Start BackEnd

Go to the server directory

```bash
  cd My-Chatgpt/server
```

Install dependencies

```bash
  npm install
```

Start

```bash
  npm start
```

### To Start FrontEnd

Go to the client directory

```bash
  cd My-Chatgpt/client
```

Install dependencies

```bash
  npm install
```

Start

```bash
  npm run dev
```
##  Deploy to Google Cloud Platform (Google App Engine)

### Prerequisites
Google Cloud SDK: Ensure you have the Google Cloud SDK installed and configured

-  Google Cloud SDK [Download and Install](https://cloud.google.com/sdk/docs/install) 
- Initialize it by running: 
```bash
gcloud init
```

### Steps to deploy the backend server

1. Create an app.yaml File for the Backend:
In your server directory, create a file named app.yaml with the following content:

```yaml
runtime: nodejs18

env: flex

handlers:
- url: /.*
  script: auto

manual_scaling:
  instances: 1

```

2. Deploy the Backend to App Engine: Navigate to the server directory and deploy the backend service:

```bash
cd service
gcloud app deploy
```

### Steps to deploy the frontend (client)

1. Build the Frontend: Navigate to the client directory and build the application:

```bash
cd client
npm run build
```
2. Create an app.yaml File for the Frontend:
In your client directory, create a file named app.yaml with the following content:

```yaml
runtime: nodejs14

instance_class: F2

handlers:
- url: /static
  static_dir: build/static

- url: /(.*\.(js|css|png|jpg|ico|json|txt))
  static_files: build/\1
  upload: build/.*\.(js|css|png|jpg|ico|json|txt)

- url: /.*
  static_files: build/index.html
  upload: build/index.html

```
2. Deploy the Frontend to App Engine: Navigate to the client directory and deploy the frontend service:

```bash
cd client
gcloud app deploy
```



## Live Demo

[Live Demo Link](https://vimeo.com/954207504)