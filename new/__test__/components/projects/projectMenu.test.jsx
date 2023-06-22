import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider, extendTheme as chakraExtendTheme, } from "@chakra-ui/react";
import ProjectMenu from "../../../src/components/projects/projectMenu";

const chakraTheme = chakraExtendTheme();

test("If it renders properly with given settings", () => {
  const settings = {
    title: "titletext",
    initialValues: { name: "TestName" },
    onSubmit: () => {},
    submitButton: "submittext",
  };
  const compo = render(
    <BrowserRouter>
      <ChakraProvider theme={chakraTheme} resetCSS>
        <ProjectMenu isOpen={true} {...settings}/>
      </ChakraProvider>
    </BrowserRouter>
  );
  expect(compo.queryByText("titletext")).toBeTruthy();
  expect(compo.queryByDisplayValue("TestName")).toBeTruthy();
  expect(compo.queryByText("Project Name")).toBeTruthy();
  expect(compo.queryByText("submittext")).toBeTruthy();
});