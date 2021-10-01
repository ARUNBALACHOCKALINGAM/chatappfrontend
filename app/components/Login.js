import React, { useEffect, useContext, useState } from "react";
import {
  Button,
  Grid,
  Paper,
  Avatar,
  TextField,
  Typography,
} from "@material-ui/core";
import VpnKeyOutlinedIcon from "@material-ui/icons/VpnKeyOutlined";
import { Link } from "react-router-dom";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import Axios from "axios";

function Login() {
  const gridStyle = {
    width: "100%",
    height: "100vh",
    backgroundImage: `url("./4066549.jpg")`,
    position: "absolute",
  };
  const paperStyle = {
    padding: "20px",
    height: "70vh",
    width: 380,
    margin: "80px auto",
  };
  const avatarStyle = { backgroundColor: "red" };
  const textStyle = { padding: 20 };
  const buttonStyle = {
    marginTop: 40,
    backgroundColor: "red",
    color: "#fff",
  };
  const inputStyle = { marginTop: 20 };

  const appDispatch = useContext(DispatchContext);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const submitcount = 0;

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await Axios.post("/login", {
        username: username,
        password: password,
      });

      console.log(response.data);

      if (response.data) {
        appDispatch({ type: "login", data: response.data });
        appDispatch({
          type: "flashMessage",
          value: "Welcome to Chatapp! start chatting",
        });
      } else {
        appDispatch({
          type: "flashMessage",
          value: "Incorrect Username/password",
        });
      }
    } catch (e) {
      console.log("There was a problem.");
    }
  }

  return (
    <Grid style={gridStyle}>
      <Paper elevation={10} style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <VpnKeyOutlinedIcon />
          </Avatar>
          <h2 style={textStyle}>Sign in</h2>
        </Grid>
        <form onSubmit={handleSubmit}>
          <TextField
            onChange={(e) => setUsername(e.target.value)}
            label="Username"
            placeholder="Username"
            fullWidth
            required
          />
          <TextField
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            label="Password"
            placeholder="Password"
            type="password"
            fullWidth
            required
          />
          <Button
            style={buttonStyle}
            variant="contained"
            color="white"
            type="submit"
            align="center"
            fullWidth
          >
            Login
          </Button>
        </form>
        <Typography style={textStyle}>
          {" "}
          Don't have an account?
          <Link to="/signup" color="secondary" style={textStyle}>
            Sign up
          </Link>
        </Typography>
      </Paper>
    </Grid>
  );
}

export default Login;
