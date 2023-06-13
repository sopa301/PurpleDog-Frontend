import "../../App.css";
import {
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { ToastContext } from "../../main";
import ManageTasks from "./manageTasks/manageTasks";
import Summary from "./summary";
import ManagePeople from "./managePeople/managePeople";
import { DateTime, Interval } from "luxon";
import { Project } from "../../objects/project";
import { Person } from "../../objects/person";
import { Availability } from "../../objects/availability";
import { TaskGroup } from "../../objects/taskGroup";
import { Task } from "../../objects/task";

export default function ProjectPage(props) {
  const navigate = useNavigate();
  const { proj_id } = useLoaderData();
  const [proj, setProj] = useState();
  const toast = useContext(ToastContext);
  useEffect(() => {
    // axios.post(import.meta.env.VITE_API_URL + '/project', {
    //   user_id: localStorage.getItem("user_id"),
    //   proj_id: proj_id,
    // })
    // .then(function (response) {
    //   if (response.data.project) {
    //     setProj(ProjectJSONable.fromJSONable(JSON.parse(response.data.project)));
    //   } else {
    //     toast({
    //       title: "Unable to load project.",
    //       description: "Unable to read data from server.",
    //       status: "error",
    //       duration: 9000,
    //       isClosable: true,
    //     });
    //   }
    // }).catch(function (error) {
    //   toast({
    //     title: "Unable to load project.",
    //     description: error.toString(),
    //     status: "error",
    //     duration: 9000,
    //     isClosable: true,
    //   });
    setProj(
      new Project(
        1,
        "p",
        [
          new Person(
            99,
            "foo",
            [
              new Availability(
                1,
                Interval.fromDateTimes(
                  DateTime.now(),
                  DateTime.local(3000, 2, 2)
                )
              ),
            ],
            "viewer"
          ),
        ],
        [
          new TaskGroup(
            1,
            "tg1",
            [
              new Task(
                1,
                Interval.fromDateTimes(
                  DateTime.now(),
                  DateTime.local(3000, 2, 2)
                ),
                99,
                false,
                1,
                0,
                1,
                false
              ),
            ],
            1,
            0
          ),
        ]
      )
    );
    // });
  }, [proj_id]);

  return (
    <Tabs defaultIndex={1}>
      <TabList>
        <Link to="../">
          <Button>Back</Button>
        </Link>
        <Tab
          isDisabled
          css={`
            &:disabled {
              cursor: default;
            }
          `}
        />
        <Tab>Summary</Tab>
        <Tab>Manage Tasks</Tab>
        <Tab>Manage People</Tab>
      </TabList>

      <TabPanels>
        <TabPanel />
        <TabPanel>
          <Summary proj={proj} />
        </TabPanel>
        <TabPanel>
          <ManageTasks
            proj={proj}
            update={(newTasks) =>
              setProj(new Project(proj.id, proj.name, proj.people, newTasks))
            }
          />
        </TabPanel>
        <TabPanel>
          <ManagePeople
            proj={proj}
            update={(newPeople) =>
              setProj(
                new Project(proj.id, proj.name, newPeople, proj.taskGroups)
              )
            }
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export async function loader({ params }) {
  return { proj_id: params.proj_id };
}
