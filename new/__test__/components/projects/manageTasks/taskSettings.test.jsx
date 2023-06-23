import React, { createContext } from "react";
import { render, fireEvent, cleanup, act } from "@testing-library/react";
import TaskSettings from "../../../../src/components/projects/manageTasks/taskSettings";
import {
  Accordion,
  ChakraProvider,
  extendTheme as chakraExtendTheme,
  createStandaloneToast,
} from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { TaskGroup } from "../../../../src/objects/TaskGroup";
import { Task } from "../../../../src/objects/Task";
import { DateTime, Interval } from "luxon";
import { Person } from "../../../../src/objects/Person";
import { Project } from "../../../../src/objects/Project";

const chakraTheme = chakraExtendTheme();
const { ToastContainer, toast } = createStandaloneToast();
const ToastContext = createContext(toast);

test("If it renders properly", () => {
  const taskGroup = new TaskGroup(
    1,
    "Ohio",
    [
      new Task(
        1,
        Interval.fromDateTimes(DateTime.now(), DateTime.now()),
        1,
        false,
        1,
        1,
        1,
        false
      ),
    ],
    1
  );
  const compo = render(
    <div>
      <ToastContext.Provider value={toast}>
        <BrowserRouter>
          <ChakraProvider theme={chakraTheme} resetCSS>
            <Accordion>
              <TaskSettings
                taskGroup={taskGroup}
                index={0}
                update={() => {}}
                proj={
                  new Project(
                    1,
                    "Project",
                    [new Person(1, "Spiderman Lotus", [], "viewer")],
                    [taskGroup]
                  )
                }
              />
            </Accordion>
          </ChakraProvider>
        </BrowserRouter>
      </ToastContext.Provider>
      <ToastContainer />
    </div>
  );
  expect(compo.queryByText("Ohio")).toBeTruthy();
});
