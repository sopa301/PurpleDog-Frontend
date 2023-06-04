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
  } from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import AvailList from "./availList";

export default function PersonMenu(props) {
    function validateField(value) {
        let error;
        if (!value) {
            error = 'Field is required';
        } 
        return error;
    }
    function validateArray(value) {
        let error;
        if (props.activeIntervalArray.length < 1) {
          error = 'At least one interval is required';
        } 
        return error;
    }

    return (
    <Fragment>
      <Modal isOpen={props.modalIsOpen} onClose={props.modalOnClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{props.modalMenuType}</ModalHeader>
          <ModalCloseButton onClick={props.modalCloseButton}/>
          <ModalBody>
          <Formik
              initialValues={props.initialValues}
              onSubmit={props.onSubmit}
            >
              {propsInner => (
                <Form>
                <Field name='name' validate={validateField}>
                    {({ field, form }) => (
                    <FormControl isInvalid={form.errors.name && form.touched.name}>
                        <FormLabel>Name</FormLabel>
                        <Input {...field} placeholder='' />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                    </FormControl>
                    )}
                </Field>
                <Field name='avails' validate={validateArray}>
                    {({ field, form }) => (
                    <FormControl isInvalid={form.errors.avails && form.touched.avails}>
                        <FormLabel>Availabilities</FormLabel>
                        <AvailList array={props.activeIntervalArray} setArray={props.setActiveIntervalArray}/>
                        <FormErrorMessage>{form.errors.avails}</FormErrorMessage>
                    </FormControl>
                    )}
                </Field>
                <Button
                    mt={4}
                    colorScheme='teal'
                    isLoading={propsInner.isSubmitting}
                    type='submit'
                > {props.modalMenuType} </Button>
                </Form> )}
              </Formik> 
          </ModalBody>
        </ModalContent>
      </Modal>
    </Fragment>);
}