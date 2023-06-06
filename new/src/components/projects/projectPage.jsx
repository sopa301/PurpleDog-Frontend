
import '../../App.css';
import TaskList from '../custom/taskList';
import PeopleList from '../custom/peopleList';
import {
  Grid, 
  GridItem,
  Button,
  Heading,
  Box,
  useDisclosure,
} from '@chakra-ui/react';
import { Project, ProjectJSONable } from '../../Objects';
import {useState} from 'react';
import axios from 'axios';
import MoveMenu from '../custom/moveMenu';
import { redirect, useLoaderData, useNavigate, useOutletContext } from 'react-router-dom';
import CButton from '../custom/cButton';


export default function ProjectPage(props) {
  const navigate = useNavigate();
  const {projData, projName} = useLoaderData();
  const [user] = useOutletContext();
  const [peopleArray, setPeopleArray] = useState(projData.people);
  const [taskArray, setTaskArray] = useState(projData.tasks);
  // Move menu state controllers
  const {isOpen, onOpen, onClose} = useDisclosure();
  // Move menu callback variables
  const [taskPack, setTaskPack] = useState();

  function back() {
    navigate("../");
  }
  async function handleBack() {
    saveProj().then(success => success ? back() : "");
  }
  async function saveProj() {
    return await axios.post(import.meta.env.VITE_API_URL + '/saveProject', {
      username: user,
      projectname: projName,
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

  function handleMove(task, taskIndex, setOriginalArray, originalArray) {
    onOpen();
    setTaskPack({
      "task": task, 
      "taskIndex": taskIndex, 
      "setOriginalArray": setOriginalArray, 
      "originalArray": originalArray,
    });
  }

  // useEffect(() => {
  //   localStorage.setItem("proj", JSON.stringify(new Project(peopleArray, taskArray).toJSONable()));
  // }, [peopleArray, taskArray]);

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
      <Button>Run</Button>
      <CButton content="Save" onClick={saveProj}/>
      <CButton content="Back" onClick={handleBack}/>
      <MoveMenu 
        peopleArray={peopleArray}
        taskArray={taskArray}
        modalIsOpen={isOpen}
        modalOnOpen={onOpen}
        modalOnClose={onClose}
        taskPack={taskPack}
        setPeopleArray={setPeopleArray}
        setTaskArray={setTaskArray}
      />
    </Box>
  );
}

export async function loader({params}) {
  const projData = await axios.post(import.meta.env.VITE_API_URL + '/retrieveproject', {
      username: localStorage.getItem("user"),
      projectname: params.projName,
    })
    .then(function (response) {
      if (response.data.projectdata) {
        return ProjectJSONable.fromJSONable(JSON.parse(response.data.projectdata));
      }
      return new Project([], []);
    })
  if (projData) {
    return {projData, projName: params.projName};
  }
  return redirect("../error");
}