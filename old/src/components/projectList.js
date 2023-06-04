import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    ListItem,
    UnorderedList,
    Button,
    Box,
    useDisclosure,
  } from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function ProjectList(props) {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [update, setUpdate] = useState(false);

  const userEffect = props.user;
  const setArrayEffect = props.setProjectArray;
  const toastEffect = props.toast;
  useEffect(() => {
    axios.post(process.env.REACT_APP_API_URL + '/getprojects', {
        username: userEffect,
    })
    .then(function (response) {
        setArrayEffect(response.data.projectlist);
    })
    .catch(function (error) {
        toastEffect({
            title: "Unable to retrieve data.",
            description: error.toString(),
            status: "error",
            duration: 9000,
            isClosable: true,
        });
        setArrayEffect([]);
    });
  }, [setArrayEffect, userEffect, update, toastEffect]);

  const projects = props.projectArray.map(mapProjects);

  function mapProjects(proj) {
    async function deleteProject() {
        await axios.post(process.env.REACT_APP_API_URL + '/deleteproject', {
            username: props.user,
            projectname: proj,
        })
        .then(function (response) {
            props.toast({
                title: proj.toString() + " deleted.",
                description: "",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
            setUpdate(!update);
        })
        .catch(function (error) {
            props.toast({
                title: "Unable to delete project.",
                description: error.toString(),
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        });
    }
    return <ListItem key={proj}>
        {proj.toString()}
        <Button onClick={() => props.setProject(proj)}>Edit</Button> 
        <Button onClick={deleteProject}>Delete</Button> 
      </ListItem>;
  }
  function createProject(values, actions) {
    axios.post(process.env.REACT_APP_API_URL + '/saveproject', {
        username: props.user,
        projectname: values.name,
    })
    .then(function (response) {
        props.toast({
            title: values.name + " created.",
            description: "",
            status: "success",
            duration: 9000,
            isClosable: true,
        });
        setUpdate(!update);
        onClose();
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
  
  function validateField(value) {
    let error;
    if (!value) {
        error = "Project must have a name.";
    } else if (props.projectArray.includes(value)) {
        error = "Project must have a unique name.";
    }
    return error;
  }

  return (
    <Box>
        <UnorderedList>
            {projects}
        </UnorderedList>
        <Button onClick={onOpen}>Add Project</Button>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>New Project</ModalHeader>
            <ModalCloseButton onClick={onClose}/>
                <ModalBody>
                    <Formik
                        initialValues={{name: ""}}
                        onSubmit={createProject}
                    >
                    {propsInner => (
                        <Form>
                            <Field name='name' validate={validateField}>
                                {({ field, form }) => (
                                <FormControl isInvalid={form.errors.name && form.touched.name}>
                                    <FormLabel>Project Name</FormLabel>
                                    <Input {...field} placeholder='' />
                                    <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                                </FormControl>
                                )}
                            </Field>
                            <Button
                                mt={4}
                                colorScheme='teal'
                                isLoading={propsInner.isSubmitting}
                                type='submit'
                            >Create Project</Button>
                        </Form> )}
                    </Formik> 
                </ModalBody>
            </ModalContent>
        </Modal>
    </Box>
  );
}