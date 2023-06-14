import {
  ListItem,
  List,
  Button,
  Box,
  useDisclosure,
  Text,
  Spacer,
  Flex,
  Card,
  Container,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CButton from "../custom/cButton";
import ProjectMenu from "./projectMenu";
import Loading from "../custom/loading";

export default function OwnedProjects(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const editProjFn = (name) => {
    return {
      title: "Edit Project",
      initialValues: { name: name },
      onSubmit: editProject,
      submitButton: "Change name",
    };
  };
  const addProj = {
    title: "Add Project",
    initialValues: { name: "" },
    onSubmit: createProject,
    submitButton: "Add Project",
  };
  const [modalSettings, setModalSettings] = useState(addProj);
  const activeId = useRef();
  const [projects, setProjects] = useState();

  const arrayEffect = props.array;
  useEffect(() => {
    if (arrayEffect) {
      setProjects(arrayEffect.map(mapProjects));
    }
  }, [arrayEffect]);

  function mapProjects(proj, index) {
    async function deleteProject() {
      await axios
        .delete(import.meta.env.VITE_API_URL + "/project", {
          user_id: localStorage.getItem("user_id"),
          proj_id: proj.proj_id,
        })
        .then(function (response) {
          props.toast({
            title: proj.proj_name + " deleted.",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          props.setArray((x) => [
            ...x.slice(0, index),
            ...x.slice(index + 1, x.length),
          ]);
        })
        .catch(function (error) {
          props.toast({
            title: "Unable to delete project.",
            description: getErrorMessageDP(error),
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        });
    }
    async function handleEdit() {
      activeId.current = proj.proj_id;
      setModalSettings(editProjFn(proj.proj_name));
      onOpen();
    }
    return (
      <ListItem key={proj.proj_id}>
        <Card padding="5px">
          <Flex alignItems="center">
            <Container maxWidth="40ch">{proj.proj_name}</Container>
            <Spacer />
            <Box>
              <Link to={"./" + proj.proj_id}>
                <Button>Open</Button>
              </Link>
              <CButton content="Edit Name" onClick={handleEdit} />
              <CButton content="Delete" onClick={deleteProject} />
            </Box>
          </Flex>
        </Card>
      </ListItem>
    );
  }
  async function createProject(values, actions) {
    await axios
      .put(import.meta.env.VITE_API_URL + "/project", {
        user_id: localStorage.getItem("user_id"),
        proj_name: values.name,
      })
      .then(function (response) {
        props.toast({
          title: values.name + " created.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        onClose();
        props.setArray((x) => [
          ...x,
          { proj_name: values.name, proj_id: response.data.proj_id },
        ]);
      })
      .catch(function (error) {
        props.toast({
          title: "Unable to create project.",
          description: error.toString(),
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        actions.setSubmitting(false);
      });
  }
  async function editProject(values, actions) {
    const oldName = props.array.filter((x) => x.proj_id === activeId.current)[0]
      .proj_name;
    await axios
      .patch(import.meta.env.VITE_API_URL + "/project", {
        proj_id: activeId.current,
        proj_name: values.name,
      })
      .then(function (response) {
        props.toast({
          title: "Changed name of " + oldName + " to " + values.name,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        onClose();
        const index = props.array.indexOf(
          projectArray.filter((x) => x.proj_id === activeId.current)
        );
        props.setArray((x) => [
          ...x.slice(0, index),
          { proj_name: values.name, proj_id: activeId.current },
          ...x.slice(index + 1, x.length),
        ]);
      })
      .catch(function (error) {
        props.toast({
          title: "Unable to change project name.",
          description: getErrorMessageEP(error),
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        actions.setSubmitting(false);
      });
  }

  return (
    <Box>
      {projects ? (
        <Box>
          {projects.length > 0 ? (
            <List>{projects}</List>
          ) : (
            <Text>No projects here!</Text>
          )}
          <Button
            onClick={() => {
              setModalSettings(addProj);
              onOpen();
            }}
          >
            Add Project
          </Button>
        </Box>
      ) : (
        <Loading />
      )}
      <ProjectMenu onClose={onClose} isOpen={isOpen} {...modalSettings} />
    </Box>
  );
}
function getErrorMessageDP(error) {
  if (!error.response) {
    return "Network error.";
  }
  let status = error.response.status;
  if (status === 403) {
    return "Not authorised.";
  }
  if (status === 404) {
    return "Project not found";
  }
  return "Unknown error.";
}
function getErrorMessageEP(error) {
  if (!error.response) {
    return "Network error.";
  }
  let status = error.response.status;
  return "Unknown error.";
}