import { Outlet, useNavigate } from "react-router-dom";
import {
    Box,
} from '@chakra-ui/react';
import axios from "axios";
import Banner from "../components/main/banner";

export default function Root(props) {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    validateToken(token, navigate, user);
    return (
        <Box>
            <Banner loggedIn={true} toast={props.toast}/>
            <Outlet context={[user]}/>
        </Box>
    );
}

function validateToken(token, navFn, username) {
    if (token) {
      return axios.post(import.meta.env.VITE_API_URL + "/validate", {
          username: username,
          token: token,
        })
        .catch(function (error) {
          props.toast({
            title: "Invalid token.",
            description: "Please log in again.",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
          navFn("/login");
        });
    } else {
      props.toast({
        title: "Invalid token.",
        description: "Please log in again.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      navFn("/login");
    }
}