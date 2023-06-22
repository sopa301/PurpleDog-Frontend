import React, { createContext } from "react";
import { render, fireEvent, cleanup, act } from "@testing-library/react";
import {
  ChakraProvider,
  extendTheme as chakraExtendTheme,
  createStandaloneToast,
} from "@chakra-ui/react";
import {
  ThemeProvider as MaterialThemeProvider,
  createTheme as muiCreateTheme,
  THEME_ID,
} from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { BrowserRouter } from "react-router-dom";
import { DateTime, Interval } from "luxon";
import { Project } from "../../../../src/objects/Project";
import TaskMenu from "../../../../src/components/projects/manageTasks/taskMenu";

const materialTheme = muiCreateTheme();
const chakraTheme = chakraExtendTheme();
const { ToastContainer, toast } = createStandaloneToast();
const ToastContext = createContext(toast);

test("If it renders properly", () => {
  const startTime = new DateTime(1000, 1, 1);
  const endTime = new DateTime(2020, 2, 2);
  const compo = render(
    <div>
      <MaterialThemeProvider theme={{ [THEME_ID]: materialTheme }}>
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <ToastContext.Provider value={toast}>
            <BrowserRouter>
              <ChakraProvider theme={chakraTheme} resetCSS>
                <TaskMenu
                  isOpen={true}
                  title="title"
                  proj={new Project(1, "Project", [], [])}
                  initialValues={{
                    name: "name1",
                    pax: 3,
                    priority: 2,
                    start: startTime,
                    end: endTime,
                    assignees: [null, null, null],
                    completed: false,
                  }}
                  onSubmit={() => {}}
                />
              </ChakraProvider>
            </BrowserRouter>
          </ToastContext.Provider>
          <ToastContainer />
        </LocalizationProvider>
      </MaterialThemeProvider>
    </div>
  );
  expect(compo.queryAllByText("title")).toHaveLength(2);
  expect(compo.queryByText("Task Name")).toBeTruthy();
  expect(compo.queryByText("Pax")).toBeTruthy();
  expect(compo.queryByText("Priority")).toBeTruthy();
  expect(compo.queryByText("Low")).toBeTruthy();
  expect(compo.queryByText("Medium")).toBeTruthy();
  expect(compo.queryByText("High")).toBeTruthy();
  expect(compo.queryByText("Interval")).toBeTruthy();
  expect(compo.queryByText("Completed")).toBeTruthy();

  expect(compo.queryByDisplayValue("name1")).toBeTruthy();
  expect(compo.queryByDisplayValue(3)).toBeTruthy();
  expect(
    compo.queryAllByDisplayValue(
      startTime.setLocale("en-gb").toLocaleString() +
        " " +
        startTime.toLocaleString(DateTime.TIME_SIMPLE)
    )
  ).toBeTruthy();
  expect(
    compo.queryAllByDisplayValue(
      endTime.setLocale("en-gb").toLocaleString() +
        " " +
        endTime.toLocaleString(DateTime.TIME_SIMPLE)
    )
  ).toBeTruthy();
  
});
