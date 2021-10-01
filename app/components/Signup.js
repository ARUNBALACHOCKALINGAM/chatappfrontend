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
  const buttonStyle = { marginTop: 40, backgroundColor: "red", color: "#fff" };
  const inputStyle = { marginTop: 20 };

  const appDispatch = useContext(DispatchContext);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      console.log(username);
      const ourRequest = Axios.CancelToken.source();
      const response = await Axios.post(
        "/register",
        { username: username, password: password },
        { cancelToken: ourRequest.token }
      );

      if (response.data) {
        appDispatch({ type: "login", data: response.data });
        appDispatch({
          type: "flashMessage",
          value: "Succesfully registered as user",
        });
      }

      return () => ourRequest.cancel();
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
          <h2 style={textStyle}> Sign Up </h2>
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
            Register
          </Button>
        </form>

        <Typography style={textStyle}>
          {" "}
          Do you have an account?
          <Link to="/" color="secondary" style={textStyle}>
            Sign in
          </Link>
        </Typography>
      </Paper>
    </Grid>
  );
}

export default Login;
