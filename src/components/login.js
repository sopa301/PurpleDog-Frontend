import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Heading,
  Grid,
  GridItem,
  Text,
  Link,
  Box,
  Image,
} from "@chakra-ui/react";

import "../App.css";
import { useState } from "react";
import { Field, Form, Formik } from "formik";
import SignUp from "./signUp";
import axios from "axios";

export default function Login(props) {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [signUp, setSignUp] = useState(false);

  function validateUsername(value) {
    let error;
    if (!value) {
      error = "Username is required";
    }
    return error;
  }
  function validatePassword(value) {
    let error;
    if (!value) {
      error = "Password is required";
    }
    return error;
  }
  // const setAuthToken = (token) => {
  //   if (token) {
  //     axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  //   } else delete axios.defaults.headers.common["Authorization"];
  // };
  async function handleLogin(values, actions) {
    await axios
      .post(process.env.REACT_APP_API_URL + "/login", {
        username: values.username,
        password: values.password,
      })
      .then(function (response) {
        props.setLoggedIn(values.username);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", values.username);
        // setAuthToken(response.data.token);
        props.toast({
          title: "Login Success",
          description: "",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      })
      .catch(function (error) {
        actions.setSubmitting(false);
        props.toast({
          title: "Login Failed.",
          description: error.toString(),
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  }

  let out;
  if (!signUp) {
    out = (
      <Box paddingLeft="10px">
        <Grid templateColumns="repeat(5, 1fr)" gap={4}>
          <GridItem colSpan={2}>
            <Heading>Login</Heading>
            <Formik
              initialValues={{ username: "", password: "" }}
              onSubmit={handleLogin}
            >
              {(props) => (
                <Form>
                  <Field name="username" validate={validateUsername}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.username && form.touched.username
                        }
                      >
                        <FormLabel>Username</FormLabel>
                        <Input {...field} placeholder="username" />
                        <FormErrorMessage>
                          {form.errors.username}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="password" validate={validatePassword}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.password && form.touched.password
                        }
                      >
                        <FormLabel>Password</FormLabel>
                        <InputGroup size="md">
                          <Input
                            {...field}
                            placeholder="password"
                            type={show ? "text" : "password"}
                          />
                          <InputRightElement width="4.5rem">
                            <Button h="1.75rem" size="sm" onClick={handleClick}>
                              {show ? "Hide" : "Show"}
                            </Button>
                          </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage>
                          {form.errors.password}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Button
                    mt={4}
                    backgroundColor="#CB6CE6"
                    color="white"
                    isLoading={props.isSubmitting}
                    type="submit"
                  >
                    {" "}
                    Submit{" "}
                  </Button>
                </Form>
              )}
            </Formik>
            <Text>
              Don't have an account?{" "}
              <Link color="#0CC0DF" onClick={() => setSignUp(true)}>
                Sign up now!
              </Link>
            </Text>
          </GridItem>
          <GridItem colStart={4} colEnd={6} alignContent="right">
            <Box>
              <Image src="/loginpageimage.png" />
            </Box>
          </GridItem>
        </Grid>
      </Box>
    );
  } else {
    out = <SignUp setSignUp={setSignUp} toast={props.toast} />;
  }

  return out;
}
