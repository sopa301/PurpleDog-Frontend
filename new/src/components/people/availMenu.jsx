import { Fragment } from "react";
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
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

export default function AvailMenu(props) {
    function validateInterval(value) {
        let error;
        if (!props.activeStart || !props.activeEnd) {
          error = 'Both fields are required';
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
              initialValues={{}}
              onSubmit={props.onSubmit}
            >
              {propsInner => (
                <Form>
                <Field name='interval' validate={validateInterval}>
                    {({ field, form }) => (
                        <FormControl isInvalid={form.errors.interval}>
                            <FormLabel>Interval</FormLabel>
                            <DateTimeField onChange={props.setActiveStart} value={props.activeStart} label='Start Time'/>
                            <div><br/></div>
                            <DateTimeField onChange={props.setActiveEnd} value={props.activeEnd} label='End Time'/>
                            <FormErrorMessage>{form.errors.interval}</FormErrorMessage>
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