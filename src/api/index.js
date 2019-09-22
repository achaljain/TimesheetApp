// Get data from API and prepare object for APP in following format
// Steps and Assumptions for Data Preparation
// 0. Use proper object format only. Map during GET and POST from API.
// 1. Each day with valid allocation will have a separate object with all details.
// 2. Holidays also have some project allocation. Set holiday to true in those date objects.
// 3. Filled is true on save, timesheet can be refilled to correct mistakes.
// 4. Locked is true on submit to manager, previous month etc. App will not allow to edit on locked dates.
// 5. Missing date object or empty projects array is considered as No Allocation. App will not allow to fill.
// 6. No option to fill down time. Only project allocations are displayed.
// 7. Default 8 hrs filled for leave.
// 8. No timesheet is allowed on holidays. Handle this at API level.

export function getUserProjects(startDate, endDate) {
    return new Promise((resolve, reject) => {
        setTimeout(function() {
            resolve({
                "2019-09-19": {
                    "projects": [
                        {
                            "project": "Amira Learning",
                            "task": "Tech Development",
                            "description": "Home Screen UI",
                            "allocation": 3,
                            "normal": 2,
                            "late": 0
                        },
                        {
                            "project": "Nelson",
                            "task": "Tech Development",
                            "description": "Login Issues",
                            "allocation": 3,
                            "normal": 3,
                            "late": 0
                        },
                        {
                            "project": "Brain Bench",
                            "task": "Tech Development",
                            "description": "Amira UI",
                            "allocation": 2,
                            "normal": 2,
                            "late": 0
                        }
                    ],
                    "filled": true,
                    "locked": true,
                    "leave": false,
                    "holiday": false
                },
                "2019-09-20": {
                    "projects": [
                        {
                            "project": "Amira Learning",
                            "task": "Tech Development",
                            "description": "Home Screen UI",
                            "allocation": 3,
                            "normal": 3,
                            "late": 1
                        },
                        {
                            "project": "Nelson",
                            "task": "Tech Development",
                            "description": "Login Issues",
                            "allocation": 3,
                            "normal": 0,
                            "late": 0
                        },
                        {
                            "project": "Brain Bench",
                            "task": "Tech Development",
                            "description": "Amira UI",
                            "allocation": 2,
                            "normal": 0,
                            "late": 0
                        }
                    ],
                    "filled": true,
                    "locked": false,
                    "leave": false,
                    "holiday": false
                },
                "2019-09-21": {
                    "projects": [
                        {
                            "project": "Amira Learning",
                            "task": "Tech Development",
                            "description": "Home Screen UI",
                            "allocation": 4,
                            "normal": 0,
                            "late": 0
                        }
                    ],
                    "filled": true,
                    "locked": false,
                    "leave": true,
                    "holiday": false
                },
                "2019-09-22": {
                    "projects": [
                        {
                            "project": "Amira Learning",
                            "task": "Tech Development",
                            "description": "Home Screen UI",
                            "allocation": 8,
                            "normal": 0,
                            "late": 0
                        }
                    ],
                    "filled": false,
                    "locked": false,
                    "leave": false,
                    "holiday": true
                },
                "2019-09-23": {
                    "projects": [
                        {
                            "project": "Amira Learning",
                            "task": "Tech Development",
                            "description": "Home Screen UI",
                            "allocation": 4,
                            "normal": 0,
                            "late": 0
                        }
                    ],
                    "filled": false,
                    "locked": false,
                    "leave": false,
                    "holiday": false
                },
                "2019-09-24": {
                    "projects": [
                        {
                            "project": "Amira Learning",
                            "task": "Tech Development",
                            "description": "Home Screen UI",
                            "allocation": 4,
                            "normal": 0,
                            "late": 0
                        }
                    ],
                    "filled": false,
                    "locked": false,
                    "leave": false,
                    "holiday": false
                }
            })
        }, 300)
    })
}

export function submitTimeSheet(timesheetObj) {
    console.log("submit---- ", timesheetObj)
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true)
        }, 3000);   
    })
}