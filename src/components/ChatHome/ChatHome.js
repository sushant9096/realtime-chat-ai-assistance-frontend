import React from 'react';
import {Grid, IconButton, InputAdornment, Paper, Stack, TextField, Tooltip, Typography, useTheme} from "@mui/material";
import {Cancel, ChatSharp, Refresh, Search, Send} from "@mui/icons-material";
import ConversionTile from "./ConversionTile";
import MessageTile from "./MessageTile";
import api from "../../config/api";
import catchAsyncAPI from "../../utils/catchAsyncAPI";
import ChatSearchTile from "./ChatSearchTile";
import CreateConversationForm from "../Forms/CreateConversationForm";

function ChatHome(props) {
  const theme = useTheme();
  const {
    authenticatedUser, socket, setDialogOpen, setDialogTitle, setDialogDescription,
    dialogOpen, toggleDialog,
    setDialogComponent
  } = props;
  const [messages, setMessages] = React.useState([])
  const [conversations, setConversations] = React.useState([])
  const [conversionSearchTxt, setConversionSearchTxt] = React.useState('')
  const [conversionSearchResults, setConversionSearchResults] = React.useState([])
  const [selectedConversation, setSelectedConversation] = React.useState(null)
  const firstAPICall = React.useRef(false);
  const [messageTxt, setMessageTxt] = React.useState('')
  const [selectedConversationTitle, setSelectedConversationTitle] = React.useState('');
  const [selectedConversationEmail, setSelectedConversationEmail] = React.useState('');

  async function createConversation(name = '') {
    const requestConfig = {
      url: '/conversation',
      method: 'post',
      data: {
        participants: [authenticatedUser.userId],
        type: 1,
        name,
      }
    }
    console.log(requestConfig)
    catchAsyncAPI(
      api(requestConfig),
      response => {
        console.log('conversation created:\n', response.data)
        if (response.data) {
          refreshConversations();
          clearSearchResults();
          // clear dialog states
          setDialogTitle('');
          setDialogDescription('');
          setDialogComponent(undefined);
          setDialogOpen(false);
          console.log('dialog closed')
        } else {
          alert('conversation creation failed')
        }
      },
      error => {
        console.log(error)
        if (error?.status === 400) {
          alert('Conversation already exists')
        }
      }
    );
  }

  const updateSearchResults = (results) => {
    // console.log('upSearchResults');
    setConversionSearchResults(prevState => {
      prevState = [...results];
      return prevState;
    })
  }

  const updateConversionsList = (conversations) => {
    /*for (const conversation of conversations) {
      console.log('connecting to conversation [socket]: ', conversation.conversationId)
      socket.emit('join chat', conversation.conversationId)
    }*/
    setConversations(prevState => {
      prevState = conversations.map(conversation => {
        return {
          ...conversation,
        }
      });
      return prevState;
    });
  }

  function clearSearchResults() {
    setConversionSearchResults([])
    setConversionSearchTxt('')
  }

  function refreshConversations() {
    const requestConfig = {
      url: '/conversation',
    }
    catchAsyncAPI(
      api(requestConfig),
      response => {
        // console.log('conversations:\n', response.data)
        if (response.data && Array.isArray(response.data)) {
          setSelectedConversation(null);
          setMessages([]);
          updateConversionsList(response.data)
        }
      },
      error => {
        console.log(error)
      }
    );
  }

  function sendMessage() {
    if (messageTxt) {
      const requestConfig = {
        url: '/message',
        method: 'post',
        data: {
          conversationId: conversations[selectedConversation]?.conversationId,
          senderId: authenticatedUser?.userId,
          content: messageTxt
        }
      }
      catchAsyncAPI(
        api(requestConfig),
        response => {
          // console.log('message sent:\n', response.data)
          if (response.status === 201 && response.data) {
            const message = response.data;
            socket.emit('new message', message)
            setMessageTxt('')
            setMessages([...messages, message]);
          } else {
            alert('message sending failed')
          }
        },
        error => {
          console.log(error)
        }
      );
    }
  }

  function handleSelectConversation(index) {
    setSelectedConversation(index);
    setSelectedConversationTitle(conversations[index]?.title);
    setSelectedConversationEmail(conversations[index]?.email);
  }

  React.useEffect(() => {
    if (!firstAPICall.current) {
      firstAPICall.current = true;
      refreshConversations();
    }
  }, [])

  React.useEffect(() => {
    if (conversionSearchTxt && conversionSearchTxt.length > 2) {
      const requestConfig = {
        url: '/user/search?email=' +
          conversionSearchTxt +
          '&firstName=' +
          conversionSearchTxt +
          '&lastName=' +
          conversionSearchTxt
      }
      catchAsyncAPI(
        api(requestConfig),
        response => {
          if (Array?.isArray(response?.data)) {
            // console.log(response?.data)
            // console.log(authenticatedUser?.userId)
            updateSearchResults(response?.data?.filter(user => user?.userId !== authenticatedUser?.userId))
          }
        },
        error => {
          console.log(error)
        }
      );
    }
  }, [conversionSearchTxt])

  React.useEffect(() => {
    if (selectedConversation !== null) {
      console.log('connecting to conversation [socket]: ', conversations[selectedConversation].conversationId)
      socket.emit('join chat', conversations[selectedConversation].conversationId)
      socket.on('message received', (message) => {
        console.log('message received:\n', message)
        setMessages(prevState => {
          // console.log('prevState:\n', prevState)
          if (!prevState || prevState.length === 0) {
            prevState = [message];
          } else if (!prevState.includes(message)) {
            // console.log('new message')
            prevState = [...prevState, message];
          }
          return prevState;
        })
      });
      const requestConfig = {
        url: '/message?conversationId=' + conversations[selectedConversation]?.conversationId,
      }
      catchAsyncAPI(
        api(requestConfig),
        response => {
          // console.log('messages:\n', response.data)
          if (response.data && Array.isArray(response.data)) {
            setMessages(response.data)
          }
        },
        error => {
          console.log(error)
        }
      );
    }
    return () => {
      if (selectedConversation !== null) {
        console.log('disconnecting from conversation [socket]: ', conversations[selectedConversation]?.conversationId)
        socket.emit('leave chat', conversations[selectedConversation]?.conversationId)
        socket.off('message received');
      }
    }
  }, [selectedConversation])

  function handleCreateConversation() {
    setDialogOpen(true);
    setDialogTitle('Create Conversation')
    setDialogDescription('Enter the email of the user you want to chat with')
    setDialogComponent(
      <CreateConversationForm
        createConversation={createConversation}
      />
    )
  }

  return (
    <Grid
      p={1}
      container
      direction="row"
      spacing={1}
      height={`calc(100% - ${theme.mixins.toolbar.minHeight}px - ${theme.spacing(2)})`}
    >
      <Grid
        item
        xs={12}
        md={3}
        px={1}
        component={Stack}
        direction={"column"}
      >
        <TextField
          style={{
            marginBottom: 5,
          }}
          label={"Chats"}
          variant={"filled"}
          value={conversionSearchTxt}
          onChange={(event) => {
            setConversionSearchTxt(event.target.value)
          }}
          InputProps={{
            endAdornment: <InputAdornment position="end">
              <IconButton
                color={"primary"}>
                <Search/>
              </IconButton>
            </InputAdornment>
          }}
          fullWidth
        />
        <Stack
          direction="row"
          justifyContent={"space-between"}
        >
          <Typography
            variant={'h6'}>
            {
              conversionSearchResults?.length > 0 ? 'Search Results' : 'Conversations'
            }
          </Typography>
          <div
            style={{
              flexGrow: 1,
            }}
          ></div>
          {
            conversionSearchResults?.length > 0 ?
              <IconButton
                onClick={clearSearchResults}
              >
                <Cancel/>
              </IconButton>
              :
              <IconButton
                onClick={refreshConversations}
              >
                <Refresh/>
              </IconButton>
          }
          <Tooltip title={"Create Conversation"}>
            <IconButton
              onClick={handleCreateConversation}
            >
              <ChatSharp/>
            </IconButton>
          </Tooltip>
        </Stack>
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            padding: "5px",
          }}
        >
          <div
            style={{
              position: "relative",
              flex: 1,
            }}
          >
            <div
              className={"scrollbar1"}
              style={{
                overflowY: "scroll",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            >
              {
                conversionSearchResults.length === 0 && conversations?.map((conversation, index) => {
                  return (
                    <ConversionTile
                      selectConversation={() => handleSelectConversation(index, conversation)}
                      selected={selectedConversation === index}
                      key={conversation.conversationId}
                      {...conversation}
                    />
                  )
                })
              }
              {
                conversionSearchResults?.map((user) =>
                  <ChatSearchTile
                    key={user.userId}
                    {...user}
                    createConversation={() => createConversation(user.userId)}
                  />
                )
              }
            </div>

          </div>
        </div>
      </Grid>
      <Grid
        item
        xs={12}
        md={9}
        component={Stack}
        direction={"column"}
        maxHeight={`calc(100% - ${theme.spacing(1)})`}
      >
        <Typography
          style={{
            background: "rgb(247,247,247)",
            padding: '2px',
            marginBottom: '5px'
          }}
          color={"black"}
          variant={"h6"}
        >
          {selectedConversationTitle}
        </Typography>
        <div
          className={"scrollbar1"}
          style={{
            flexGrow: 1,
            background: "rgb(247,247,247)",
            overflowY: 'scroll',
            padding: "10px 5px",
            // border: "1px solid #939393",
            // borderRadius: "5px"
          }}
        >
          <Stack
            spacing={1}
            direction="column"
          >
            {
              messages.map((message) => <MessageTile
                authenticatedUser={authenticatedUser}
                key={message.messageId}
                message={message}
              />)
            }
          </Stack>
        </div>
        {
          selectedConversation !== null &&
          <TextField
            value={messageTxt}
            onChange={(event) => {
              setMessageTxt(event.target.value)
            }}
            style={{
              marginTop: 5,
            }}
            label={"Send Message"}
            variant={"filled"}
            InputProps={{
              endAdornment: <InputAdornment position="end">
                <IconButton
                  onClick={sendMessage}
                  color={"primary"}
                >
                  <Send/>
                </IconButton>
              </InputAdornment>
            }}
            fullWidth
          />
        }
      </Grid>
    </Grid>
  )
}

export default ChatHome;