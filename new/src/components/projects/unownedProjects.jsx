import {
  ListItem,
  List,
  Button,
  Box,
  Flex,
  Spacer,
  Card,
  Container,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
      <ListItem key={proj.proj_id}>
        <Card padding="5px">
          <Flex alignItems="center">
            <Container maxWidth="40ch">{proj.proj_name}</Container>
            <Spacer />
            <Link to={"./" + proj.proj_id}>
              <Button>Open</Button>
            </Link>
          </Flex>
        </Card>
      </ListItem>
    );
  }
  return <Box>{projects ? <List>{projects}</List> : <Loading />}</Box>;
}
