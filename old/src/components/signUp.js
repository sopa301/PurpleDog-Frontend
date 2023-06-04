import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Heading,
  Box,
} from "@chakra-ui/react";

import "../App.css";
import { useState } from "react";
import { Field, Form, Formik } from "formik";
import axios from "axios";
import PasswordChecklist from "react-password-checklist";

export default function SignUp(props) {
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [validPass, setValidPass] = useState(false);

  function validateUsername(value) {
    let error;
    if (!value) {
      error = "Username is required";
    }
    return error;
  }
  function validatePassword(value) {
    let error;
    setP1(value);
    if (!value) {
      error = "Password is required";
    } else if (!validPass) {
      error = "Please set the password to match the requirements.";
    }
    return error;
  }
  function validatePassword2(value) {
    let error;
    setP2(value);
    if (!value) {
      error = "Please confirm your password";
    } else if (p1 !== p2) {
      error = "Passwords do not match";
    } else if (!validPass) {
      error = "Please follow the password requirements";
    }
    return error;
  }
  async function signUpFunction(user, pass) {
    return await axios
      .post(process.env.REACT_APP_API_URL + "/signup", {
        username: user,
        password: pass,
      })
      .then(function (response) {
        props.toast({
          title: "Signed up successfully!",
          description: "",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        props.setSignUp(false);
        return true;
      })
      .catch(function (error) {
        props.toast({
          title: "Sign up failed.",
          description: error.toString(),
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return false;
      });
  }

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  return (
    <Box paddingX="10px">
      <Heading>Sign Up</Heading>
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values, actions) => {
          signUpFunction(values.username, values.password).then((result) =>
            actions.setSubmitting(result)
          );
        }}
      >
        {(propsInner) => (
          <Form>
            <Field name="username" validate={validateUsername}>
              {({ field, form }) => (
                <FormControl
                  isInvalid={form.errors.username && form.touched.username}
                >
                  <FormLabel>Username</FormLabel>
                  <Input {...field} placeholder="username" />
                  <FormErrorMessage>{form.errors.username}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="password" validate={validatePassword}>
              {({ field, form }) => (
                <FormControl
                  isInvalid={form.errors.password && form.touched.password}
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
                  <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="password2" validate={validatePassword2}>
              {({ field, form }) => (
                <FormControl
                  isInvalid={form.errors.password2 && form.touched.password2}
                >
                  <FormLabel>Confirm Password</FormLabel>
                  <InputGroup size="md">
                    <Input
                      {...field}
                      placeholder="confirm password"
                      type={show ? "text" : "password"}
                    />
                    <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{form.errors.password2}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            {/* <FormControl isInvalid={validPass}>
              <FormErrorMessage>Please set the password to match the requirements.</FormErrorMessage>
            </FormControl> */}
            <PasswordChecklist
              rules={["minLength", "specialChar", "number", "capital"]}
              minLength={8}
              value={p1}
              valueAgain={p2}
              onChange={(isValid) => {
                setValidPass(isValid);
              }}
            />
            <Button
              mt={4}
              colorScheme="teal"
              isLoading={propsInner.isSubmitting}
              type="submit"
            >
              {" "}
              Submit{" "}
            </Button>
            <Button mt={4} onClick={() => props.setSignUp(false)}>
              Back
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
