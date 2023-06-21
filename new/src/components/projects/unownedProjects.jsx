import {
  List,
  Box,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Loading from "../custom/loading";

export default function UnownedProjects(props) {
  const [projects, setProjects] = useState();

  const arrayEffect = props.array;
  useEffect(() => {
    if (arrayEffect) {
      setProjects(arrayEffect.map(mapProjects));
    }
  }, [arrayEffect]);

  function mapProjects(proj) {
    return (
      <UnownedItem
        key={proj.projectId}
        projectName={proj.projectName}
        projectId={proj.projectId}
      />
    );
  }
  return (
    <Box>
      {projects ? (
        <Box paddingY="10px">
          {projects.length > 0 ? (
            <List>{projects}</List>
          ) : (
            <Text>No projects here!</Text>
          )}
        </Box>
      ) : (
        <Loading />
      )}
    </Box>
  );
}
