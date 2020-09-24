# QuizzApp
==============

### My church is in need of a Survey web app. 
### We will use reactJS + surveyJS along with backend strapi.
### It is about 4 weeks to complete.
________________
Installation

1. Install nodeJS and npm from https://nodejs.org/en/download/
2. Install yarn from https://classic.yarnpkg.com/en/docs/install/#mac-stable
3. Install visual studio code from https://code.visualstudio.com/
4. Install git or github from https://desktop.github.com/
5. Clone this project to your local with git or github
6. Now you can use (prefer yarn)
```
yarn install
```
or
```
npm install
```
7. You are able to start this project with this command
```
yarn start
```
or
```
npm start
```
8. Go to folder src/features/ , you should find the pages there to start your coding.

________________
PROJECT OVERVIEW

Pages
1. Navigation
2. Home page
3. Survey page: Question and Answer
4. Result page
5. Login page
6. Footer
7. Privacy
8. Terms of use

Data
1. Tables design
2. Survey data format
3. Convert data and upload to database

Communications
1. Get content from Strapi
2. Get survey question and answers from Strapi
3. Send result back to Strapi
4. Get results from Strapi
5. Strapi authentication

Reports
1. Show his/her result with chart
2. Show total result
________________________
PROJECT TASKS ASSIGNMENT

1. Design theme ( Bootstrap or material UI )
2. Follow https://github.com/facebook/create-react-app to create react app and check in to github
3. Follow tutorial https://www.youtube.com/watch?v=uRaDTvlwkB0 to create survey page which has one question and multiple options.
4. Design Home page for announcement, and available surveys or quiz
5. Design Result page which should have a chart from test result and overall result
6. Figure out the format for survey and transform to serveyJS format.
7. Define tables in strapi, one table type for contents, one table for serveys and one table for results
8. Study strapi authentication for email login user or anonymous user. How to build authentication flow to frontend.
9. international (i18n) for the website
10. save source to github and deployment
11. Logo design and other image design

_________________________
API List:

Get all quizes:
https://33.1122.ca/quizzes

Get all chaters by a quiz:
https://33.1122.ca/chapters?quiz=5f6a35156254027e53ce24c0

Get all questions by a chapter:
https://33.1122.ca/questions?chapter=5f6b6daa66863b0c0229d23e&_limit=-1

Reference: https://strapi.io/documentation/3.0.0-beta.x/content-api/parameters.html#available-operators

______________
Contributors:
- George Zhang
- Alex Liu
- Jason Yang
