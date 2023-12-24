import React from 'react';
import {AppBar, IconButton, Toolbar, Typography} from "@mui/material";
import {Logout} from "@mui/icons-material";

function MuiAppBar(props) {
  const {authenticated, signOutUser} = props;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Realtime Chat Web App
        </Typography>
        {
          authenticated &&
          <IconButton onClick={signOutUser}>
            <Logout />
          </IconButton>
        }
      </Toolbar>
    </AppBar>
  );
}

export default MuiAppBar;