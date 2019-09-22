import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { Config } from '../../config'

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        minWidth: 600
    },
    root2: {
        flexGrow: 1,
        minWidth: 600,
        maxHeight: 300,
        overflowY: "hidden",
        overflowX: "hidden"
    },
    gridItem: {
        textAlign: "left"
    },
    switch: {
        float: "right"
    },
    projectName: {
        overflowWrap: "break-word"
    },
    leaveOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        background: "rgba(255,255, 255, 0.7)",
        zIndex: 10
    },
    dialogContent: {
        position: "relative"
    },
    taskSelect: {
        width: '100%'
    }
}));

export default function ProjectDialog(props) {
    const classes = useStyles();

    const taskOptions = Config.tasks

    const [userProjects, setProject] = React.useState(props.projects);
    const [leave, setLeave] = React.useState(false)

    function handleSave() {
        let newProjectsObj = JSON.parse(JSON.stringify(userProjects))
        if (leave) {
            newProjectsObj.forEach((project, idx) => {
                project["normal"] = project["allocation"]
                project["late"] = 0
                project["description"] = ""
            });
            setProject(newProjectsObj)
        }

        let totalHoursForDay = 0
        newProjectsObj.forEach((p) => {
            totalHoursForDay += (p.normal + p.late)
        })
        if (totalHoursForDay > 20) {
            alert("Total hours can not be more than 20 for a day.")
        } else {
            props.onDialogClose(newProjectsObj, leave)
        }
    }

    function handleClose() {
        props.onDialogClose(false)
    }

    function updateProject(idx, prop, val) {
        let existingObj = userProjects[idx]

        if (prop === "description" && val.length > 150) {
            alert("Description character limit is 150!")
        } else if (prop === "normal" && (val < 0 || val > existingObj.allocation)) {
            alert(`Normal hours can not be more than allocation. Valid range: 0 - ${existingObj.allocation}`)
        } else if (prop === "late" && (val < 0 || val > 12)) {
            alert("Late hours must be a positive number between 0 - 12")
        } else if (prop === "late" && existingObj["normal"] < existingObj["allocation"]) {
            alert("Late hours can not be added without full allocation hours.")
        } else {
            let newProjectsObj = JSON.parse(JSON.stringify(userProjects))
            newProjectsObj[idx][prop] = (prop === "normal" || prop === "late") ? Math.round(val * 10) / 10 : val
            setProject(newProjectsObj)
        }
    }

    function handleLeaveChange(evt) {
        setLeave(evt.target.checked)
    }

    return (
        <div>
            <Dialog open={props.show} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="md">
                <DialogTitle id="form-dialog-title">
                    Project Details
                    <FormControlLabel
                        value={leave}
                        control={<Switch color="primary" onChange={handleLeaveChange} />}
                        label="Leave"
                        labelPlacement="start"
                        className={classes.switch}
                    />
                </DialogTitle>
                <Divider />
                <DialogContent className={classes.dialogContent}>
                    <Grid container className={classes.root}>
                        <Grid item xs={12}>
                            <Grid container justify="center" spacing={2}>

                                <Grid item xs={3} className={classes.gridItem}>
                                    <Typography variant="h6" gutterBottom>
                                        Project
                                    </Typography>
                                </Grid>
                                <Grid item xs={3} className={classes.gridItem}>
                                    <Typography variant="h6" gutterBottom>
                                        Task
                                    </Typography>
                                </Grid>
                                <Grid item xs={2} className={classes.gridItem}>
                                    <Typography variant="h6" gutterBottom>
                                        Description
                                    </Typography>
                                </Grid>
                                <Grid item xs={2} className={classes.gridItem}>
                                    <Typography variant="h6" gutterBottom>
                                        Normal Hrs
                                    </Typography>
                                </Grid>
                                <Grid item xs={2} className={classes.gridItem}>
                                    <Typography variant="h6" gutterBottom>
                                        Late Hrs
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container className={classes.root2}>
                        {
                            userProjects.map((project, idx) => {
                                return (
                                    <Grid item key={`project-${idx}`} xs={12}>
                                        <Grid container justify="center" spacing={2}>

                                            <Grid item xs={3} className={classes.gridItem}>
                                                <Typography variant="body1" gutterBottom className={classes.projectName}>
                                                    {project.project} ({project.allocation})
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={3} className={classes.gridItem}>
                                                <Select
                                                    value={project.task}
                                                    onChange={event => updateProject(idx, "task", event.target.value)}
                                                    inputProps={{
                                                        name: 'task',
                                                        id: 'task',
                                                    }}
                                                    className={classes.taskSelect}
                                                >
                                                    {
                                                        taskOptions.map((val) => {
                                                            return (
                                                                <MenuItem key={val} value={val}>{val}</MenuItem>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                            </Grid>
                                            <Grid item xs={2} className={classes.gridItem}>
                                                <TextField
                                                    autoFocus
                                                    id="description"
                                                    label=""
                                                    type="text"
                                                    margin="normal"
                                                    value={project.description}
                                                    onChange={event => updateProject(idx, "description", event.target.value)}
                                                />
                                            </Grid>
                                            <Grid item xs={2} className={classes.gridItem}>
                                                <TextField
                                                    autoFocus
                                                    id="normalhrs"
                                                    label=""
                                                    type="number"
                                                    margin="normal"
                                                    variant="outlined"
                                                    value={project.normal}
                                                    onChange={event => updateProject(idx, "normal", event.target.value)}
                                                />
                                            </Grid>
                                            <Grid item xs={2} className={classes.gridItem}>
                                                <TextField
                                                    autoFocus
                                                    id="latehrs"
                                                    label=""
                                                    type="number"
                                                    variant="outlined"
                                                    margin="normal"
                                                    value={project.late}
                                                    onChange={event => updateProject(idx, "late", event.target.value)}
                                                />
                                            </Grid>

                                        </Grid>
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
                    {leave && <div className={classes.leaveOverlay}></div>}
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}