import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Avatar from '@material-ui/core/Avatar';
import LogOut from '@material-ui/icons/PowerSettingsNew';
import logo from './magiclogo.png'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    textAlign: "center"
  },
  bigAvatar: {
      height: 50,
      width: 100
  },
  img: {
    objectFit: "contain"
  }
}));

function logoutClick() {

}

export default function Appbar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Avatar alt="Magic EdTech" src={logo} classes={{
            root: classes.bigAvatar,
            img: classes.img
          }} />
          <Typography variant="h6" className={classes.title}>
            Timesheet
          </Typography>
          <div className={classes.appbarButtons}>
            <IconButton aria-label="Log out" color="inherit" title="Log Out" onClick={logoutClick}>
              <LogOut />
            </IconButton>
          </div>
         
        </Toolbar>
      </AppBar>
    </div>
  );
}