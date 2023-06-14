import { Outlet, useNavigate } from "react-router-dom";
import { Box, useEditable } from "@chakra-ui/react";
import axios from "axios";
import Banner from "../components/main/banner";
import { useEffect } from "react";

export default function Root(props) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const user_id = localStorage.getItem("user_id");
  useEffect(() => {
    validateToken(token, navigate, user_id, user, props.toast);
  }, []);
  return (
    <Box>
      <Banner loggedIn={true} toast={props.toast} />
      <Outlet context={[user]} />
    </Box>
  );
}

function validateToken(token, navFn, user_id, username, toastFn) {
  if (token && username && user_id) {
    return axios
      .post(import.meta.env.VITE_API_URL + "/validate", {
        user_id: user_id,
        token: token,
      })
      .catch(function (error) {
        toastFn({
          title: "Please log in again.",
          description: getErrorMessage(error),
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        // navFn("/login");
      });
  } else {
    toastFn({
      title: "Please log in again.",
      description: "Missing credentials.",
      status: "error",
      duration: 9000,
      isClosable: true,
    });
    navFn("/login");
  }
}

function getErrorMessage(error) {
  if (!error.response) {
    return "Network error.";
  }
  let status = error.response.status;
  if (status === 401) {
    return "Invalid token.";
  }
  if (status === 404) {
    return "User ID not found.";
  }
  return "Unknown error.";
}
