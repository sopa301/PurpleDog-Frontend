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
    Skeleton,
  } from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CButton from '../custom/cButton';

export default function ProjectList(props) {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [projectArray, setProjectArray] = useState();

    const userEffect = props.user;
    const toastEffect = props.toast;
    useEffect(() => {
        axios.post(import.meta.env.VITE_API_URL + '/getprojects', {
            username: userEffect,
        })
        .then(function (response) {
            setProjectArray(response.data.projectlist);
        })
        .catch(function (error) {
            toastEffect({
                title: "Unable to retrieve data.",
                description: error.toString(),
                status: "error",
                duration: 9000,
                isClosable: true,
            });
            setProjectArray([]);
        });
    }, [setProjectArray, userEffect, toastEffect]);

    let projects;
    if (projectArray) {
        projects = projectArray.map(mapProjects);
    }

    function mapProjects(proj, index) {
        async function deleteProject() {
            await axios.post(import.meta.env.VITE_API_URL + '/deleteproject', {
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
                setProjectArray(x => [...x.slice(0, index),
                    ...x.slice(index + 1, x.length)]);
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
            <Link to={"./" + proj}><Button>Edit</Button></Link> 
            <CButton content="Delete" onClick={deleteProject} /> 
        </ListItem>;
    }
    function createProject(values, actions) {
        axios.post(import.meta.env.VITE_API_URL + '/saveproject', {
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
            onClose();
            setProjectArray(x => [...x, values.name]);
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
        } else if (projectArray.includes(value)) {
            error = "Project must have a unique name.";
        }
        return error;
    }

    return (
        <Box>
            <UnorderedList>
                {projects ? projects : <Skeleton height='20px'/>}
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