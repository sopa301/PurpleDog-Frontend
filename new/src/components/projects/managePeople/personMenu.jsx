import { Fragment } from "react";
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    RadioGroup,
    Stack,
    Radio,
  } from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import AvailList from "./availList";

export default function PersonMenu(props) {
    function validateField(value) {
        let error;
        if (!value) {
            error = 'Username is required';
        } 
        return error;
    }
    // function validateArray(value) {
    //     let error;
    //     if (props.activeIntervalArray.length < 1) {
    //       error = 'At least one interval is required';
    //     } 
    //     return error;
    // }

    return (
    <Fragment>
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{props.title}</ModalHeader>
          <ModalCloseButton onClick={props.onClose}/>
          <ModalBody>
          <Formik
              initialValues={props.initialValues}
              onSubmit={props.onSubmit}
            >
              {formik => (
                <Form>
                <Field name='username' validate={validateField}>
                    {({ field, form }) => (
                    <FormControl isInvalid={form.errors.username && form.touched.username}>
                        <FormLabel>Username</FormLabel>
                        <Input {...field} placeholder='' />
                        <FormErrorMessage>{form.errors.username}</FormErrorMessage>
                    </FormControl>
                    )}
                </Field>
                <Field name='role' >
                    {({ field, form }) => (
                    <FormControl>
                        <FormLabel>Role</FormLabel>
                        <RadioGroup 
                            onChange={(val) => formik.setFieldValue("role", val, true)} 
                            value={formik.values.role}>
                          <Stack direction='row'>
                            <Radio value='editor'>Editor</Radio>
                            <Radio value='viewer'>Viewer</Radio>
                          </Stack>
                        </RadioGroup>
                    </FormControl>
                    )}  
                </Field>
                {/* <Field name='avails' validate={validateArray}>
                    {({ field, form }) => (
                    <FormControl isInvalid={form.errors.avails && form.touched.avails}>
                        <FormLabel>Availabilities</FormLabel>
                        <AvailList array={props.activeIntervalArray} setArray={props.setActiveIntervalArray}/>
                        <FormErrorMessage>{form.errors.avails}</FormErrorMessage>
                    </FormControl>
                    )}
                </Field> */}
                <Button
                    mt={4}
                    colorScheme='teal'
                    isLoading={formik.isSubmitting}
                    type='submit'
                > {props.title} </Button>
                </Form> )}
              </Formik> 
          </ModalBody>
        </ModalContent>
      </Modal>
    </Fragment>);
}