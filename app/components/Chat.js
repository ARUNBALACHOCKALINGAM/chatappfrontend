import React, { useEffect, useContext, useRef } from "react";
import {
  Button,
  Grid,
  Paper,
  Avatar,
  TextField,
  Typography,
} from "@material-ui/core";
import PeopleIcon from "@material-ui/icons/People";
import { Link } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { flexbox } from "@material-ui/system";
import ChatBubbleOutlineOutlinedIcon from "@material-ui/icons/ChatBubbleOutlineOutlined";
import SendIcon from "@material-ui/icons/Send";
import Box from "@material-ui/core/Box";
import { boxSizing } from "@material-ui/system";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import { useImmer } from "use-immer";
import Axios from "axios";
import io from "socket.io-client";
const socket = io(
  process.env.BACKENDURL || "https://chatappback-end.herokuapp.com/"
);

function Chat() {
  const gridStyle = {
    width: "100%",
    height: "100vh",
    backgroundImage: `url("./4066549.jpg")`,
    position: "absolute",
  };
  const paperStyle = {
    padding: "20px",
    height: "95vh",
    width: 380,
    margin: "5px 10px 5px 10px",
  };
  const buttonstyle = {
    backgroundColor: "red",
    color: "#fff",
    position: "absolute",
    bottom: 100,
    left: 150,
  };
  const chatStyle = {
    padding: "20px",
    height: "95vh",
    width: 900,
    margin: "5px 10px 5px 450px",
    position: "absolute",
    top: "0px",
  };
  const chatstyle = {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "red",
  };
  const userstyle = {
    fontSize: "24px",
    color: "black",
    padding: "0px",
  };
  const avatarStyle = { backgroundColor: "red", padding: "15px", margin: 10 };
  const textStyle = { padding: 20 };
  const buttonStyle = {
    position: "relative",
    bottom: "140px",
    margin: 0,
    backgroundColor: "red",
    color: "#fff",
  };
  const textstyle = { padding: "5px", color: "white" };
  const inputStyle = { width: 800, zindex: 10 };
  const chat = { display: "flex", position: "absolute", bottom: 20 };

  const chatField = useRef(null);
  const chatLog = useRef(null);

  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const [state, setState] = useImmer({
    users: [],
    fieldValue: "",
    chatMessages: [],
  });

  function handleLogout() {
    socket.on("message", function (message) {
      console.log(message);
    });
    appDispatch({ type: "logout" });
    appDispatch({
      type: "flashMessage",
      value: "See you soon!",
    });
  }

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function fetchResults() {
      try {
        const response = await Axios.post("/userData", {});
        setState((draft) => {
          draft.users = response.data;
        });
      } catch (e) {
        console.log("There was a problem or the request was cancelled.");
      }
    }
    fetchResults();
    return () => ourRequest.cancel();
  }, []);

  useEffect(() => {
    socket.current = io(
      process.env.BACKENDURL || "https://chatappback-end.herokuapp.com/"
    );
    socket.on("chatFromServer", (message) => {
      setState((draft) => {
        draft.chatMessages.push(message);
      });
    });
  }, []);

  function handleFieldChange(e) {
    const value = e.target.value;
    setState((draft) => {
      draft.fieldValue = value;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    socket.emit("chatFromBrowser", {
      message: state.fieldValue,
      token: appState.user.token,
    });

    setState((draft) => {
      draft.chatMessages.push({
        message: draft.fieldValue,
        username: appState.user.username,
      });
      draft.fieldValue = "";
    });
  }

  useEffect(() => {
    chatLog.current.scrollTop = chatLog.current.scrollHeight;
  }, [state.chatMessages]);

  return (
    <Grid style={gridStyle}>
      <Paper elevation={10} align="center" style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <PeopleIcon />
          </Avatar>
          <h2 style={textStyle}>Users</h2>
        </Grid>
        {state.users.map((user) => (
          <List
            key={user._id}
            component="nav"
            aria-label="main mailbox folders"
          >
            <ListItem button>
              <ListItemIcon>
                <h2 style={userstyle}>{user.username}</h2>
              </ListItemIcon>
            </ListItem>
          </List>
        ))}

        <Button onClick={handleLogout} style={buttonstyle}>
          Sign Out
        </Button>
      </Paper>
      <Paper elevation={10} style={chatStyle}>
        <Grid style={chatstyle} align="center">
          <Avatar style={avatarStyle}>
            <ChatBubbleOutlineOutlinedIcon />
          </Avatar>
          <h2 style={textstyle}>Chat</h2>
        </Grid>
        <Grid className="chat-wrapper" ref={chatLog}>
          <Box id="chat" className="chat-log">
            {state.chatMessages.map((message, index) => {
              if (message.username == appState.user.username) {
                return (
                  <Box key={index} className="chat-self">
                    <Box className="chat-message">
                      <Box className="chat-message-inner">
                        {message.message}
                      </Box>
                    </Box>
                    <img
                      className="chat-avatar avatar-tiny"
                      src={message.avatar}
                    />
                  </Box>
                );
              }

              return (
                <div key={index} className="chat-other">
                  <div className="chat-message">
                    <div className="chat-message-inner">
                      <Link>
                        <strong>{message.username}: </strong>
                      </Link>
                      {message.message}
                    </div>
                  </div>
                </div>
              );
            })}
          </Box>

          <Grid style={chat}>
            <form onSubmit={handleSubmit}>
              <TextField
                value={state.fieldValue}
                onChange={handleFieldChange}
                style={inputStyle}
                variant="outlined"
                type="text"
                placeholder="enter chat here"
              />
            </form>
            <Avatar style={avatarStyle}>
              <SendIcon />
            </Avatar>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}

export default Chat;
