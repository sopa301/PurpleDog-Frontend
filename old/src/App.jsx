import { useState } from "react";
import Home from "../../new/src/components/home";
import Login from "../../new/src/components/login/loginForm";
import axios from "axios";
import { Box } from "@chakra-ui/react";
import Banner from "../../new/src/components/banner";

export default function App(props) {
  const token = localStorage.getItem("token");
  // String containing username if logged in, null otherwise
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("user"));
  const [projectArray, setProjectArray] = useState([]);

  function validateToken(token) {
    if (token) {
      return axios
        .post(process.env.REACT_APP_API_URL + "/validate", {
          username: loggedIn,
          token: token,
        })
        .catch(function (error) {
          props.toast({
            title: "Invalid token.",
            description: "Please log in again.",
            status: "error",
            duration: 1000,
            isClosable: true,
          });
          logout();
        });
    } else if (localStorage.getItem("user")) {
      props.toast({
        title: "Invalid token.",
        description: "Please log in again.",
        status: "error",
        duration: 1000,
        isClosable: true,
      });
      logout();
    }
  }
  function logout() {
    localStorage.removeItem("projtitle");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("projects");
    localStorage.removeItem("proj");
    setLoggedIn();
    setProjectArray([]);
  }

  validateToken(token);
  var out;
  if (loggedIn) {
    out = (
        <Home
          projectArray={projectArray}
          setProjectArray={setProjectArray}
          user={loggedIn}
          toast={props.toast}
        />
    );
  } else {
    out = (
        <Login
        setLoggedIn={setLoggedIn}
        setProjectArray={setProjectArray}
        toast={props.toast}
        />
    );
  }
  return (
    <Box>
        <Banner loggedIn={loggedIn} logout={logout} toast={props.toast} />
        {out}
      </Box>
  );
}