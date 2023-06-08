import {
    Box,
    Heading,
    Grid,
    GridItem,
    Text,
} from "@chakra-ui/react";
import { useEffect, useState } from 'react';
import UnownedProjects from '../components/projects/unownedProjects';
import OwnedProjects from '../components/projects/ownedProjects';
import axios from "axios";

export default function Projects(props) {
  const testArray = [{proj_id:1, proj_name:"kekw in soooth i kno3ue3892ye9y23r8w omgggggggggggggggggggggggosadddfhaiushiuahdiu"},
  {proj_id:2, proj_name: "lul"}];

  const [ownArray, setOwnArray] = useState();
  const [otherArray, setOtherArray] = useState();

  const toastEffect = props.toast;
  useEffect(() => {
    getData();
  }, []);

  function getData() {
    axios.post(import.meta.env.VITE_API_URL + '/getprojects', {
      user_id: localStorage.getItem("user_id"),
    })
    .then(function (response) {
      setOwnArray(response.data.owned);
      setOtherArray(response.data.unowned);
    })
    .catch(function (error) {
      toastEffect({
        title: "Unable to retrieve data.",
        description: error.toString(),
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setOwnArray(testArray);
      setOtherArray(testArray);
      // setOwnArray();
      // setOtherArray();
    });
  }
  return <Box paddingX="10px">
    <Heading>Projects</Heading>
    <br />
    <Box>
      <Grid templateColumns='repeat(2, 1fr)' gap={1}>
        <GridItem paddingX="10px">
          <Text>My Projects:</Text>
          <OwnedProjects array={ownArray} setArray={setOwnArray} toast={props.toast}/>
        </GridItem>
        <GridItem paddingX="10px">
          <Text>Projects I'm in:</Text>
          <UnownedProjects array={otherArray} setArray={setOtherArray} toast={props.toast}/>
        </GridItem>
      </Grid>
    </Box>
  </Box>;
}