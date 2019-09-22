import React, { Component } from 'react';
import Container from '@material-ui/core/Container';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import ProjectDialog from '../project'
import { getUserProjects, submitTimeSheet } from '../../api'
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

const localizer = momentLocalizer(moment)

class Calender extends Component {
    constructor(props) {
        super(props)

        this.state = {
            events: [],
            projectsAssigned: [],
            showProjectDialog: false,
            showProgress: false
        }

        this.startOfMonth = null
        this.endOfMonth = null
        this.dateFormat = 'YYYY-MM-DD hh:mm:ss'

        this.projectDataForMonth = null
        this.dateListForFill = []

        this.allDatesStatusForMonth = {
            normal: [],
            late: [],
            partialFilled: [],
            notFilled: [],
            leave: [],
            holiday: [],
            locked: [],
            noAllocation: [],
            futureDates: []
        }
    }

    componentDidMount() {
        this.onRangeChange()
    }

    selectSlot(slot) {

        // Remove disabled other month dates if selected
        let slotsOfCurrentMonth = slot.slots.filter((timeStr) => {
            return !(moment(timeStr).isBefore(this.startOfMonth) || moment(timeStr).isAfter(this.endOfMonth))
        })

        let datesStrArr = slotsOfCurrentMonth.map((day) => moment(day).format('YYYY-MM-DD'))

        let submittedDates = []
        let noAllocationDates = []
        let holidayDates = []
        let availableDatesForFill = []
        let futureDates = []

        datesStrArr.forEach((dateStr, idx) => {
            if (this.allDatesStatusForMonth.noAllocation.indexOf(dateStr) >= 0) {
                noAllocationDates.push(dateStr)
            } else if (this.allDatesStatusForMonth.locked.indexOf(dateStr) >= 0) {
                submittedDates.push(dateStr)
            } else if (this.allDatesStatusForMonth.holiday.indexOf(dateStr) >= 0) {
                holidayDates.push(dateStr)
            } else if (this.allDatesStatusForMonth.futureDates.indexOf(dateStr) >= 0) {
                futureDates.push(dateStr)
            } else {
                availableDatesForFill.push(dateStr)
            }
        })

        if (submittedDates.length > 0) {
            alert(`Timesheet already submitted for these dates ${submittedDates} Select valid dates.`)
        } else if (noAllocationDates.length > 0) {
            alert(`There is no allocation for these dates ${noAllocationDates} Select valid dates.`)
        } else if (futureDates.length > 0) {
            alert(`Timesheet can not be filled for future dates.`)
        } else if (availableDatesForFill.length > 0) {
            this.getProjectListShowTimesheetPopup(availableDatesForFill)
        }
    }

    getProjectListShowTimesheetPopup(dateList) {
        let commonIdxArr = []
        let commonProjectsNames = this.projectDataForMonth[dateList[0]]["projects"].map((p, idx) => {
            commonIdxArr.push(idx)
            return {
                project: p.project,
                task: p.task,
                description: p.description,
                allocation: p.allocation,
                normal: p.normal,
                late: p.late
            }
        })

        if (dateList.length > 1) {
            commonIdxArr = []
            for (let i = 1; i < dateList.length; ++i) {
                let projectsForDate = this.projectDataForMonth[dateList[i]]["projects"]
                commonProjectsNames.forEach((p, idx) => {
                    let isExist = projectsForDate.filter((c) => c.project === p.project)
                    if (isExist.length > 0) {
                        let o = isExist[0]
                        p.task = p.task || o.task
                        p.description = p.description || o.description
                        p.allocation = Math.min(o.allocation, p.allocation)
                        p.normal = Math.min(o.normal, p.normal)
                        p.late = Math.min(o.late, p.late)
                        commonIdxArr.push(idx)
                    }
                })
            }
        }

        if (commonIdxArr.length > 0) {
            this.dateListForFill = dateList
            this.setState({
                projectsAssigned: commonIdxArr.map((r) => commonProjectsNames[r]),
                showProjectDialog: true
            })
        } else {
            alert("The selected dates have no common allocations. Fill timesheet separately.")
        }
    }

    selectEvent(event) {
        this.selectSlot({
            slots: [
                event.start
            ]
        })
    }

    onDialogClose(projectObj, leave) {
        if (typeof (projectObj) === "object") {
            let newProjectObj = JSON.parse(JSON.stringify(this.projectDataForMonth))
            let nameArr = projectObj.map((p) => p.project)

            this.dateListForFill.forEach((d) => {
                let pRef = newProjectObj[d]
                let newPrjList = pRef.projects.map((p) => {
                    let i = nameArr.indexOf(p.project)
                    if (i >= 0) {
                        return { ...projectObj[i] }
                    } else {
                        return { ...p }
                    }
                })
                pRef.projects = newPrjList
                pRef.filled = true
                pRef.leave = leave ? true : false
            })

            this.projectDataForMonth = newProjectObj
            this.createEvents()
            this.setState({
                showProjectDialog: false
            })
        } else {
            this.setState({
                showProjectDialog: false
            })
        }
    }

    createEvents() {
        this.setDateStatusOfMonth()
        let datesArray = Object.keys(this.projectDataForMonth)
        let eventsList = []
        datesArray.forEach((day) => {
            let projectListForDay = this.projectDataForMonth[day]
            let startTime = moment(day).startOf('day')
            let endTime = moment(day).endOf('day')

            let eventsForDay = []
            if (projectListForDay.holiday === true) {
                eventsForDay.push({
                    title: `Holiday`,
                    start: startTime,
                    end: endTime
                })
            } else if (projectListForDay.filled === true) {
                if (projectListForDay.leave === true) {
                    eventsForDay.push({
                        title: `Leave`,
                        start: startTime,
                        end: endTime
                    })
                } else {
                    eventsForDay = projectListForDay.projects.map((project) => {
                        return {
                            title: `${project.project}`,
                            start: startTime,
                            end: endTime
                        }
                    })
                }
            }
            eventsList.push(...eventsForDay)
        })
        this.setState({
            events: [...eventsList]
        })
    }

    // This method is called on month change to set start and end dates.
    onRangeChange(range) {
        let currRangeStart = range ? moment(range.start) : moment()
        if (range && currRangeStart.get('date') !== 1) {
            currRangeStart = moment(range.start).add(1, 'M')
        }

        this.startOfMonth = moment(currRangeStart).startOf('month')
        this.endOfMonth = moment(currRangeStart).endOf('month')

        this.loadProjectsForRange()
    }

    loadProjectsForRange() {
        this.setState({
            showProgress: true
        })
        getUserProjects(this.startOfMonth.format(this.dateFormat), this.endOfMonth.format(this.dateFormat))
            .then((data) => {
                this.setState({
                    showProgress: false
                })
                this.projectDataForMonth = data
                this.createEvents()
            })
            .catch((err) => {
                this.setState({
                    showProgress: false
                })
                console.log("Get Error - ", err);
                alert(err);
            })
    }

    onSubmit() {
        this.setState({
            showProgress: true
        })
        submitTimeSheet(this.projectDataForMonth).then((data) => {
            this.setState({
                showProgress: false,
                showProjectDialog: false
            })
        }).catch((err) => {
            this.setState({
                showProgress: false
            })
            console.log("Post Error - ", err);
            alert(err)
        })
    }

    customDayPropGetter(day) {
        let key = moment(day).format("YYYY-MM-DD")

        let className = ""

        if (this.allDatesStatusForMonth.leave.indexOf(key) >= 0) {
            className = "leave"
        } else if (this.allDatesStatusForMonth.holiday.indexOf(key) >= 0) {
            className = "holiday"
        } else if (this.allDatesStatusForMonth.locked.indexOf(key) >= 0) {
            className = "locked"
        } else if (this.allDatesStatusForMonth.late.indexOf(key) >= 0) {
            className = "late"
        } else if (this.allDatesStatusForMonth.normal.indexOf(key) >= 0) {
            className = "normal"
        } else if (this.allDatesStatusForMonth.notFilled.indexOf(key) >= 0) {
            className = "notFill"
        } else if (this.allDatesStatusForMonth.partialFilled.indexOf(key) >= 0) {
            className = "partialFill"
        } else {
            className = ""
        }

        if (className) {
            return {
                className: className
            }
        } else {
            return {}
        }
    }

    setDateStatusOfMonth() {
        let start = this.startOfMonth.date()
        let end = this.endOfMonth.date()

        for (let k in this.allDatesStatusForMonth) {
            this.allDatesStatusForMonth[k] = []
        }

        for (let day = start; day <= end; ++day) {

            let key = moment(this.startOfMonth).add((day - 1), 'days').format("YYYY-MM-DD")

            if(moment(key).isAfter(moment().format("YYYY-MM-DD"))) {
                this.allDatesStatusForMonth.futureDates.push(key)
            } else if (this.projectDataForMonth &&
                this.projectDataForMonth[key] &&
                this.projectDataForMonth[key]['projects'] &&
                this.projectDataForMonth[key]['projects'].length > 0
            ) {

                let obj = this.projectDataForMonth[key]

                if (obj.leave === true) {
                    this.allDatesStatusForMonth.leave.push(key)
                } else if (obj.holiday === true) {
                    this.allDatesStatusForMonth.holiday.push(key)
                } else if (obj.locked === true) {
                    this.allDatesStatusForMonth.locked.push(key)
                } else {
                    let prjArr = obj.projects
                    let normal = 0
                    let late = 0
                    prjArr.forEach((p) => {
                        normal += p.normal
                        late += p.late
                    })
                    if (normal === 8) {
                        (late > 0) ?
                            this.allDatesStatusForMonth.late.push(key) :
                            this.allDatesStatusForMonth.normal.push(key)
                    } else if (normal === 0) {
                        this.allDatesStatusForMonth.notFilled.push(key)
                    } else {
                        this.allDatesStatusForMonth.partialFilled.push(key)
                    }
                }

            } else {
                this.allDatesStatusForMonth.noAllocation.push(key)
            }
        }
    }

    render() {
        return (
            <div className="calenderContainer">
                <Calendar
                    popup
                    localizer={localizer}
                    views={['month']}
                    defaultView="month"
                    longPressThreshold={100}
                    events={this.state.events}
                    startAccessor="start"
                    endAccessor="end"
                    showMultiDayTimes={true}
                    selectable={true}
                    onSelectSlot={this.selectSlot.bind(this)}
                    onSelectEvent={this.selectEvent.bind(this)}
                    onRangeChange={this.onRangeChange.bind(this)}
                    dayPropGetter={this.customDayPropGetter.bind(this)}
                />
                {
                    this.state.showProjectDialog &&
                    <ProjectDialog show={this.state.showProjectDialog} projects={this.state.projectsAssigned} onDialogClose={this.onDialogClose.bind(this)} />
                }
                {
                    this.state.showProgress &&
                    <div className="progressLoaderContainer">
                        <CircularProgress className="progressLoader" />
                    </div>
                }
                <Button variant="contained" size="small" color="primary" className="uploadButton" onClick={this.onSubmit.bind(this)}>
                    Submit
                </Button>
            </div>
        )
    }
}

export default Calender