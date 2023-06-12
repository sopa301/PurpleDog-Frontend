import { Outlet, useNavigate } from "react-router-dom";
import {
    Box, useEditable,
} from '@chakra-ui/react';
import axios from "axios";
import Banner from "../components/main/banner";
import { useEffect } from "react";

export default function Root(props) {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const user_id = localStorage.getItem("user_id");
    useEffect(() => {
      validateToken(token, navigate, user_id, props.toast);
    }, []);
    return (
        <Box>
            <Banner loggedIn={true} toast={props.toast}/>
            <Outlet context={[user]}/>
        </Box>
    );
}

function validateToken(token, navFn, user_id, toastFn) {
    if (token) {
      return axios.post(import.meta.env.VITE_API_URL + "/validate", {
          user_id: user_id,
          token: token,
        })
        .catch(function (error) {
          toastFn({
            title: "Invalid token.",
            description: "Please log in again.",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
          navFn("/login");
        });
    } else {
      toastFn({
        title: "Invalid token.",
        description: "Please log in again.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      navFn("/login");
    }
}