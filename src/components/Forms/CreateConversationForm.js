import React from 'react';
import {Button, Stack, TextField} from "@mui/material";

function CreateConversationForm(props) {
  const {createConversation} = props;
  const [conversationName, setConversationName] = React.useState('');

  return (
    <Stack
      onSubmit={(e) => {
        e.preventDefault();
        createConversation(conversationName);
      }}
      component={'form'}
      direction={'column'}
      p={2}
      spacing={1}
    >
      <TextField
        required
        error={conversationName === '' && conversationName.length < 1}
        id={"conversation-name"}
        label={"Conversation Name"}
        variant={"outlined"}
        value={conversationName}
        onChange={(e) => setConversationName(e.target.value)}
      />
      <Button
        type={"submit"}
        variant={"contained"}
        color={"primary"}
      >
        Submit
      </Button>
    </Stack>
  );
}

export default CreateConversationForm;