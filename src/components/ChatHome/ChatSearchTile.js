import React from 'react';
import {Chat} from "@mui/icons-material";
import {Grid, IconButton, Stack, Typography} from "@mui/material";

function ChatSearchTile({ id, firstName, lastName, createConversation, email }) {
  return (
    <Grid
      container
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <Grid
        item>
        <Stack>
          <Typography
            variant={'body1'}>
            {firstName + ' ' + lastName}
          </Typography>
          <Typography
            variant={'caption'}>
            {email}
          </Typography>
        </Stack>
      </Grid>
      <Grid
        item>
      <IconButton
        color={"primary"}
        onClick={createConversation}
      >
        <Chat/>
      </IconButton>
      </Grid>
    </Grid>
  );
}

export default ChatSearchTile;