import '../../App.css';
import {
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react';
import { Person, Project, ProjectJSONable } from '../../Objects';
import {useEffect, useState, useContext} from 'react';
import axios from 'axios';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { ToastContext } from '../../main';
import ManageTasks from './manageTasks/manageTasks';
import Summary from './summary';
import ManagePeople from './managePeople/managePeople';
import { DateTime, Interval } from 'luxon';
import { Availability } from '../../Objects';

export default function ProjectPage(props) {
  const navigate = useNavigate();
  const {proj_id} = useLoaderData();
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
      setProj(new Project(1, "p", [new Person(1, "foo", [new Availability(1, Interval.fromDateTimes(DateTime.now(), DateTime.local(3000, 2, 2)))], "viewer")], []));
    // });
  }, [proj_id]);
  
  return (
    <Tabs defaultIndex={1}>
      <TabList>
          <Link to="../"><Button>Back</Button></Link>
          <Tab isDisabled css={`
              &:disabled {
                cursor: default;
            }
          `}/>
          <Tab>Manage Tasks</Tab>
          <Tab>Manage People</Tab>
          <Tab>Summary</Tab>
      </TabList>
      
      <TabPanels>
        <TabPanel />
        <TabPanel>
          <ManageTasks proj={proj} update={(newTasks) => setProj(new Project(proj.id, proj.name, proj.people, newTasks))}/>
        </TabPanel>
        <TabPanel>
          <ManagePeople proj={proj} update={(newPeople) => setProj(new Project(proj.id, proj.name, newPeople, proj.tasks))}/>
        </TabPanel>
        <TabPanel>
          <Summary proj={proj}/>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export async function loader({params}) {
  return {proj_id: params.proj_id};
}

// const [peopleArray, setPeopleArray] = useState(projData.people);
  // const [taskArray, setTaskArray] = useState(projData.tasks);
  // // Move menu state controllers
  // const {isOpen, onOpen, onClose} = useDisclosure();
  // // Move menu callback variables
  // const [taskPack, setTaskPack] = useState();

  // function back() {
  //   navigate("../");
  // }
  // async function handleBack() {
  //   saveProj().then(success => success ? back() : "");
  // }
  // async function saveProj() {
  //   return await axios.post(import.meta.env.VITE_API_URL + '/saveProject', {
  //     username: user,
  //     projectname: projName,
  //     projectdata: JSON.stringify(new Project(peopleArray, taskArray).toJSONable()),
  //   })
  //   .then(function (response) {
  //     props.toast({
  //       title: "Project saved.",
  //       description: "",
  //       status: "success",
  //       duration: 9000,
  //       isClosable: true,
  //     });
  //     return true;
  //   })
  //   .catch(function (error) {
  //     props.toast({
  //       title: "Unable to save project.",
  //       description: error.toString(),
  //       status: "error",
  //       duration: 9000,
  //       isClosable: true,
  //     });
  //     return false;
  //   });
  // }

  // function handleMove(task, taskIndex, setOriginalArray, originalArray) {
  //   onOpen();
  //   setTaskPack({
  //     "task": task, 
  //     "taskIndex": taskIndex, 
  //     "setOriginalArray": setOriginalArray, 
  //     "originalArray": originalArray,
  //   });
  // }

  // // useEffect(() => {
  // //   localStorage.setItem("proj", JSON.stringify(new Project(peopleArray, taskArray).toJSONable()));
  // // }, [peopleArray, taskArray]);

  // return (
  //   <Box paddingX="10px" >
  //     <Grid templateColumns='repeat(2, 1fr)' gap={1}>
  //       <GridItem>
  //         <Heading>Unassigned Tasks</Heading>
  //         <TaskList 
  //           array={taskArray} 
  //           setArray={setTaskArray}
  //           handleMove={handleMove}
  //         />
  //       </GridItem>
  //       <GridItem>
  //         <PeopleList 
  //           array={peopleArray} 
  //           setArray={setPeopleArray}
  //           handleMove={handleMove}
  //         />
  //       </GridItem>
  //     </Grid>
  //     <br></br>
  //     <Button>Run</Button>
  //     <CButton content="Save" onClick={saveProj}/>
  //     <CButton content="Back" onClick={handleBack}/>
  //     <MoveMenu 
  //       peopleArray={peopleArray}
  //       taskArray={taskArray}
  //       modalIsOpen={isOpen}
  //       modalOnOpen={onOpen}
  //       modalOnClose={onClose}
  //       taskPack={taskPack}
  //       setPeopleArray={setPeopleArray}
  //       setTaskArray={setTaskArray}
  //     />
  //   </Box>
  // );