import { useState } from 'react';
import '../App.css';
import { Box, Heading } from '@chakra-ui/react';
import ProjectPage from './projectPage';
import ProjectList from './projectList';

export default function Home(props) {
  const [project, setProject] = useState(localStorage.getItem("projtitle"));

  let out;
  if (project) {
    localStorage.setItem("projtitle", project);
    out = <ProjectPage 
      project={project} 
      setProject={setProject} 
      user={props.user}
      toast={props.toast}
    />;
  } else {
    out = <Box paddingX="10px">
      <Heading >Hello, {props.user}.</Heading>
      <ProjectList 
        toast={props.toast}
        setProjectArray={props.setProjectArray} 
        projectArray={props.projectArray} 
        user={props.user}
        setProject={setProject}
        project={project}/>
    </Box>; 
  }
  return out;
}