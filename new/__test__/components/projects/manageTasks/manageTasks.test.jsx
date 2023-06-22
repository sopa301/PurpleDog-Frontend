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
import ManageTasks from "../../../../src/components/projects/manageTasks/manageTasks";
import { Person } from "../../../../src/objects/Person";
import { TaskGroup } from "../../../../src/objects/TaskGroup";
import { Task } from "../../../../src/objects/Task";

const materialTheme = muiCreateTheme();
const chakraTheme = chakraExtendTheme();
const { ToastContainer, toast } = createStandaloneToast();
const ToastContext = createContext(toast);

test("If it renders properly", () => {
  const compo = render(
    <div>
      <MaterialThemeProvider theme={{ [THEME_ID]: materialTheme }}>
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <ToastContext.Provider value={toast}>
            <BrowserRouter>
              <ChakraProvider theme={chakraTheme} resetCSS>
                <ManageTasks
                  proj={
                    new Project(
                      1,
                      "Project",
                      [new Person(1, "Spiderman Lotus", [], "viewer")],
                      [
                        new TaskGroup(
                          1,
                          "Ohio",
                          [
                            new Task(
                              1,
                              Interval.fromDateTimes(
                                DateTime.now(),
                                DateTime.now()
                              ),
                              1,
                              false,
                              1,
                              1,
                              1,
                              false
                            ),
                          ],
                          1
                        ),
                      ]
                    )
                  }
                />
              </ChakraProvider>
            </BrowserRouter>
          </ToastContext.Provider>
          <ToastContainer />
        </LocalizationProvider>
      </MaterialThemeProvider>
    </div>
  );
  expect(compo.queryAllByText("Add Task")).toBeTruthy();
  expect(compo.queryAllByText("Auto-Assign")).toBeTruthy();
  expect(compo.queryByText("Ohio")).toBeTruthy();
});
