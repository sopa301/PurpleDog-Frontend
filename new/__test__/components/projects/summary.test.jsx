import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import Summary from "../../../src/components/projects/summary";
import {Project} from "../../../src/objects/Project";
import { Person } from "../../../src/objects/Person";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider, extendTheme as chakraExtendTheme, } from "@chakra-ui/react";

const chakraTheme = chakraExtendTheme();

test("If it renders properly with a Project", () => {
  const proj = new Project(1, "TestName", [new Person(1, "Alpha", [], "editor"), new Person(2, "Beta", [], "editor")], []);
  const compo = render(
    <BrowserRouter>
      <ChakraProvider theme={chakraTheme} resetCSS>
        <Summary proj={proj} />
      </ChakraProvider>
    </BrowserRouter>
  );
  expect(compo.queryByText("Unassigned")).toBeTruthy();
  expect(compo.queryByText("Alpha")).toBeTruthy();
  expect(compo.queryByText("Beta")).toBeTruthy();
  expect(compo.queryAllByText("0 minutes")[1]).toBeTruthy();
});