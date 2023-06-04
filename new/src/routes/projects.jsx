import { useState } from "react";
import {
    Box,
    Heading,
} from "@chakra-ui/react";
import ProjectList from '../components/projects/projectList';
import { useOutletContext } from "react-router-dom";

export default function Projects(props) {
    const [user] = useOutletContext();
    
    return <Box paddingX="10px">
    <Heading>Projects</Heading>
    <br />
    <ProjectList 
      toast={props.toast}
      user={user}/>
  </Box>;
}