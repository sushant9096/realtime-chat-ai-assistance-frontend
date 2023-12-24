import React, {useEffect} from 'react';
import {Paper, Stack, Typography} from "@mui/material";

function MessageTile({message, authenticatedUser}) {
  const {content, senderId} = message;
  const [senderName, setSenderName] = React.useState("");

  useEffect(() => {
    if (senderId === authenticatedUser?.userId) {
      setSenderName("You");
    } else {
      setSenderName("Other");
    }
  }, []);

  return (
    <Paper
      variant={"elevation"}
      elevation={0}
      style={{
        alignSelf: senderId === authenticatedUser?.userId ? 'flex-end' : 'flex-start',
        width: '40%',
        padding: 5,
        background: senderId === authenticatedUser?.userId ? '#d7f9d1' : 'rgb(255,255,255)',
        color: '#000000'
      }}
    >
      {/*<div style={{fontSize: 18, color: 'darkgray', fontWeight: 900}}>{senderName}</div>*/}
      <Stack>
        <Typography
          variant={"body1"}
        >
          {content}
        </Typography>
      </Stack>
    </Paper>
  );
}

export default MessageTile;