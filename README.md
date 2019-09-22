# Timesheet App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## App Intro

This application uses single calender component. User can click on any individual date or use drag to select a range of dates.

On selection of dates, a popup will appear with common project list for selected dates. If there are different allocations on selected dates, this will only partially fill the timesheet, User has to complete each date individually.

Use Next, Back, Today buttons in top left corner for navigation.

After filling timesheet for all the required days, click submit button. Only this will upload the timesheet to server for further actions. There is no save state in navigation. Make sure to submit before navigating between months otherwise new data will be lost for current page.

## States and color codes

There are various states for a day which will be easily visible through color codes listed below:

- Red: Locked - Timesheet submitted for approval. Non editable
- Blue: Not filled - Timesheet not filled for the day
- Orange: Partial Filled - Timesheet partially filled for the day
- Green: Fully Filled / Leave - Timesheet fully filled for the day, Leave (8 Hrs)
- Yellow: Late Hours - Timesheet fully filled (8 Hrs) + Late Hrs added (Max. Limit 12)
- Pink: Holiday - Weekends, Company Holidays

Total Hrs for a day can not be more than 20 (N: 8, L: 12)

## Assumptions and workflow
- Each day with valid allocation will have a separate object with all details.
- Date 'YYYY-MM-DD' will be key, value will be project allocations and other flags explained below.
- Holidays also have some project allocation. Set holiday to true in those date objects.
- No timesheet fill is allowed on holidays but object must be created for APP functionality.
- Property 'holiday' is true for company holidays, weekends etc.
- Property 'filled' is true on save, timesheet can be refilled to correct mistakes.
- Property 'leave' is true on leave days, timesheet can be auto-filled as per allocations.
- Property 'locked' is true on submit to manager, previous month and other disabled dates. 
- App will not allow to edit on locked dates and holidays.
- Missing date object or empty projects array is considered as No Allocation. App will not allow to fill.
- No option to fill down time. Only project allocations are displayed.
- Default 8 hrs filled for leave. 

## Pending Work
- Google login
- Get, Post API requests (Handled through single file src/api/index.js)
- Map API object to proper format used by APP and vice-versa during GET and POST
- Validations (Mostly implenmented, verify, test and add more)
- Other enhancements as per wish :relieved:

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!