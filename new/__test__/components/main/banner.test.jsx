import React from "react";
import { render, fireEvent, cleanup, getByText } from "@testing-library/react";
import {
  ChakraProvider,
  extendTheme as chakraExtendTheme,
} from "@chakra-ui/react";
import { BrowserRouter, } from "react-router-dom";
import Banner from "../../../src/components/main/banner";

const chakraTheme = chakraExtendTheme();

test("If it renders properly when logged in", () => {
  const compo = render(
    <BrowserRouter>
      <ChakraProvider theme={chakraTheme} resetCSS>
        <Banner loggedIn={true}/>
      </ChakraProvider>
    </BrowserRouter>
  );
  expect(compo.queryByText('The Purple Dog Project')).toBeTruthy();
  expect(compo.queryByText('Logout')).toBeTruthy();
});

test("If it renders properly when not logged in", () => {
  const compo = render(
    <BrowserRouter>
      <ChakraProvider theme={chakraTheme} resetCSS>
        <Banner loggedIn={false}/>
      </ChakraProvider>
    </BrowserRouter>
  );
  expect(compo.queryByText('The Purple Dog Project')).toBeTruthy();
  expect(compo.queryByText('Logout')).toBeFalsy();
});