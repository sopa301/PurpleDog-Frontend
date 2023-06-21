import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import OwnedProjects from "../../../src/components/projects/ownedProjects";
import {
  ChakraProvider,
  extendTheme as chakraExtendTheme,
} from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";

const chakraTheme = chakraExtendTheme();

test("If the test environment works", () => {
  expect(true).toBeTruthy();
});

test("If it renders properly with an array", () => {
  const projs = [
    { projectName: "p1", projectId: 1 },
    { projectName: "p2", projectId: 2 },
  ];
  const compo = render(
    <BrowserRouter>
      <ChakraProvider theme={chakraTheme} resetCSS>
        <OwnedProjects array={projs} />
      </ChakraProvider>
    </BrowserRouter>
  );
  expect(compo.queryByText("p1")).toBeTruthy();
  expect(compo.queryByText("p2")).toBeTruthy();
  expect(compo.queryByTestId("OwnedItem" + 1)).toBeTruthy();
  expect(compo.queryByTestId("OwnedItem" + 2)).toBeTruthy();
});

test("If it renders properly without an array", ()=> {
  const projs = [];
  const compo = render(
    <BrowserRouter>
      <ChakraProvider theme={chakraTheme} resetCSS>
        <OwnedProjects array={projs} />
      </ChakraProvider>
    </BrowserRouter>
  );
  expect(compo.queryByText("No projects here!")).toBeTruthy();
  expect(compo.queryAllByTestId(/OwnedItem/)).toEqual([]);
})

test("If rerenders an array properly", ()=> {
  const projs = [{ projectName: "p1", projectId: 1 }];
  const compo = render(
    <BrowserRouter>
      <ChakraProvider theme={chakraTheme} resetCSS>
        <OwnedProjects array={projs} />
      </ChakraProvider>
    </BrowserRouter>
  );
  expect(compo.queryByText("p1")).toBeTruthy();
  expect(compo.queryByText("p2")).toBeFalsy();
  expect(compo.queryByTestId("OwnedItem" + 1)).toBeTruthy();
  expect(compo.queryByTestId("OwnedItem" + 2)).toBeFalsy();
  const projs2 = [{ projectName: "p2", projectId: 2 }]
  compo.rerender(
    <BrowserRouter>
      <ChakraProvider theme={chakraTheme} resetCSS>
        <OwnedProjects array={projs2} />
      </ChakraProvider>
    </BrowserRouter>
  );
  expect(compo.queryByText("p1")).toBeFalsy();
  expect(compo.queryByText("p2")).toBeTruthy();
  expect(compo.queryByTestId("OwnedItem" + 1)).toBeFalsy();
  expect(compo.queryByTestId("OwnedItem" + 2)).toBeTruthy();
})
