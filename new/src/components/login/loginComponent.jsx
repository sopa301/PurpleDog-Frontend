import {
    Heading,
    Text,
    Box,
  } from "@chakra-ui/react";
import LoginForm from "./loginForm";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { ToastContext } from "../../main";

export default function LoginComponent(props) {
    const toast = useContext(ToastContext);
    return (
        <Box>
            <Heading>Login</Heading>
            <br />
            <LoginForm toast={toast}/>
            <Text>
                Don't have an account?{" "} 
                <Link to={"./signup"} style={{color:"#0CC0DF"}}>
                    Sign up now!
                </Link>
            </Text>
        </Box>
    );
}