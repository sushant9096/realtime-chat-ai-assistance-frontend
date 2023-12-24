import React from 'react';
import {Dialog, DialogTitle, Typography} from "@mui/material";

function AppDialog({component, title, open, onClose, description}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogTitle>{title}</DialogTitle>
      {component ? component : <Typography variant={"body1"}>{description}</Typography>}
    </Dialog>
  );
}

export default AppDialog;