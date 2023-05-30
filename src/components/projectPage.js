
import '../App.css';
import TaskList from './tasks/taskList';
import PeopleList from './people/peopleList';
import {
  Grid, 
  GridItem,
  Button,
  Heading,
  Box,
  useDisclosure,
} from '@chakra-ui/react';
import { Project, ProjectJSONable } from '../Objects';
import {useEffect, useState} from 'react';
import axios from 'axios';
import MoveMenu from './tasks/moveMenu';

export default function ProjectPage(props) {
  const projJSON = localStorage.getItem("proj");

  function getData() {
    if (projJSON) {
      return ProjectJSONable.fromJSONable(JSON.parse(projJSON));
    } else {
      props.toast({
        title: "Loading project from database...",
        description: "",
        status: "info",
        duration: 9000,
        isClosable: true,
    });
      axios.post(process.env.REACT_APP_API_URL + '/retrieveproject', {
        username: props.user,
        projectname: props.project,
      })
      .then(function (response) {
        if (response.data.projectdata) {
          try {
            const data = ProjectJSONable.fromJSONable(JSON.parse(response.data.projectdata));
            localStorage.setItem("proj", response.data.projectdata);
            setPeopleArray(data.people);
            setTaskArray(data.tasks);
            props.toast({
              title: "Project loaded.",
              description: "",
              status: "success",
              duration: 9000,
              isClosable: true,
            });
          } catch {
            props.toast({
              title: "Unable to load project, exiting...",
              description: "",
              status: "error",
              duration: 9000,
              isClosable: true,
            });
            back();
            return new Project([], []);
          }
        }
      })
      .catch(function (error) {
        props.toast({
          title: "Unable to load project.",
          description: error.toString(),
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
      return new Project([], []);
    }
  }
  function back() {
    localStorage.removeItem("projtitle");
    localStorage.removeItem("proj");
    props.setProject();
  }
  function handleBack() {
    saveProj().then(success => success ? back() : "");
  }
  async function saveProj() {
    return await axios.post(process.env.REACT_APP_API_URL + '/saveProject', {
      username: props.user,
      projectname: props.project,
      projectdata: JSON.stringify(new Project(peopleArray, taskArray).toJSONable()),
    })
    .then(function (response) {
      props.toast({
        title: "Project saved.",
        description: "",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      return true;
    })
    .catch(function (error) {
      props.toast({
        title: "Unable to save project.",
        description: error.toString(),
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return false;
    });
  }

  let data = getData() ;
  const [peopleArray, setPeopleArray] = useState(data.people);
  const [taskArray, setTaskArray] = useState(data.tasks);
  // Move menu state controllers
  const moveDisclosure = useDisclosure();
  const isOpenMove = moveDisclosure.isOpen;
  const onOpenMove = moveDisclosure.onOpen;
  const onCloseMove = moveDisclosure.onClose;
  const [taskPack, setTaskPack] = useState();

  function handleMove(task, taskIndex, setOriginalArray, originalArray) {
    onOpenMove();
    setTaskPack({
      "task": task, 
      "taskIndex": taskIndex, 
      "setOriginalArray": setOriginalArray, 
      "originalArray": originalArray,
    });
  }

  useEffect(() => {
    localStorage.setItem("proj", JSON.stringify(new Project(peopleArray, taskArray).toJSONable()));
  }, [peopleArray, taskArray]);

  return (
    <Box paddingX="10px" >
      <Grid templateColumns='repeat(2, 1fr)' gap={1}>
        <GridItem>
          <Heading>Unassigned Tasks</Heading>
          <TaskList 
            array={taskArray} 
            setArray={setTaskArray}
            handleMove={handleMove}
          />
        </GridItem>
        <GridItem>
          <PeopleList 
            array={peopleArray} 
            setArray={setPeopleArray}
            handleMove={handleMove}
          />
        </GridItem>
      </Grid>
      <br></br>
      <Button onClick={() => {}}>Run</Button>
      <Button onClick={saveProj}>Save</Button>
      <Button onClick={handleBack}>Back</Button>
      <MoveMenu 
        peopleArray={peopleArray}
        taskArray={taskArray}
        modalIsOpen={isOpenMove}
        modalOnOpen={onOpenMove}
        modalOnClose={onCloseMove}
        taskPack={taskPack}
        setPeopleArray={setPeopleArray}
        setTaskArray={setTaskArray}
      />
    </Box>
  );
}
