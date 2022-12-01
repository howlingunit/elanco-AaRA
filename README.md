# Elanco application and resource analyser

## Intro

This web application is a backend webpage that can analyse the consumption of applications and cloud resources. It has a simple web interface and relies on the given API https://engineering-task.elancoapps.com/api documentation for this can be found at https://engineering-task.elancoapps.com/docs.

This application uses frontend technologies but does come with a simple express web server.

This web app is running at https://elanco.tyway.net

## setup

### Docker

1. Ensure you have the latest version of docker installed.
2. Build the image with `docker build -t <name> .`
3. Run the image with `docker run -p <local-port>:8080 <name>`
4. The application should now be running on your specified port.

### node

1. Ensure you have the latest version of both node and npm.
2. Install dependencies with `npm install`
3. Run with `npm start`
4. The application should now be running on port 8080

## todo

* Data trends with chart js
* Toggle buttons
* Add a raw section where the program analyses all the data
* Refactor index.js
* Better styling (especially with the title)

## done

* Write README
* Lint JS with es-lint
* Display instances data
* Basic styling to make the app usable
* Display instance data
* List options
* Basic web server and page
