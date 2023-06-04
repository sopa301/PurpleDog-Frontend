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
import { DateTimeField } from "@mui/x-date-pickers";
import { Interval } from "luxon";

export default function TaskMenu(props) {
    function validateField(value) {
        let error;
        if (!value) {
            error = 'Field is required';
        } 
        return error;
    }
    function validateInterval(value) {
        let error;
        if (!props.activeStart || !props.activeEnd) {
          error = 'Field is required';
        } else if (!Interval.fromDateTimes(props.activeStart, props.activeEnd).isValid) {
          error = 'Interval is invalid';
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
                <Field name='pax' validate={validateField}>
                    {({ field, form }) => (
                    <FormControl isInvalid={form.errors.pax && form.touched.pax}>
                        <FormLabel>Pax</FormLabel>
                        <Input {...field} placeholder='' />
                        <FormErrorMessage>{form.errors.pax}</FormErrorMessage>
                    </FormControl>
                    )}
                </Field>
                <Field name='interval' validate={validateInterval}>
                    {({ field, form }) => (
                        <FormControl isInvalid={form.errors.interval && form.touched.interval}>
                            <FormLabel>Interval</FormLabel>
                            <DateTimeField 
                              onChange={props.setActiveStart} 
                              value={props.activeStart} 
                              label='Start Time'/>
                            <div><br/></div>
                            <DateTimeField 
                              onChange={props.setActiveEnd} 
                              value={props.activeEnd} 
                              label='End Time'/>
                            <div class="chakra-form__error-message css-502kp3" aria-live="polite">{form.errors.interval}</div>
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