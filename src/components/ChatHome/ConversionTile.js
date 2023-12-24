import React from 'react';
import {Stack, Typography} from "@mui/material";

function ConversionTile({name, selected, selectConversation}) {
  return (
    <Stack
      style={{
        background: selected ? 'rgba(0,200,255,0.20)' : 'transparent',
        padding: '2px',
        cursor: 'pointer',
        borderRadius: '5px',
      }}
      onClick={selectConversation}
    >
      <Typography
        fontWeight={"bolder"}
        color={"darkslategray"}
        variant={"subtitle1"}
      >
        {name}
      </Typography>
    </Stack>
  )
}

export default ConversionTile;