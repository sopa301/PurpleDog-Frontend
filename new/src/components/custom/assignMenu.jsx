import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Box,
    Select,
    Text,
    Button,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    FormControl,
    FormLabel,
    FormErrorMessage,
  } from '@chakra-ui/react';
import { Field, Form, Formik, FieldArray } from 'formik';
import { useRef } from 'react';

export default function AssignMenu(props) {
    return (<Box>
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Assign Task</ModalHeader>
        <ModalCloseButton onClick={props.onClose}/>
        <ModalBody>
        <Formik
            initialValues={{pax: 1, assignees:[null]}}
            onSubmit={(values, actions) => alert(values.assignees)}
        > 
            {({ values, setFieldValue }) => (
                <Form>
                  <Field name='pax'>
                  {({ field, form }) => (
                    <FormControl isInvalid={form.errors.pax && form.touched.pax}>
                      <FormLabel>Pax</FormLabel>
                      <NumberInput  step={1} min={1} >
                        <NumberInputField {...field} onChange={(v) => {setFieldValue('assignees', Number(v.target.value) < 1 ? [1] : Array.from(Array(Number(v.target.value)).keys()).map(x => null))}}/>
                      </NumberInput>
                      <FormErrorMessage>{form.errors.pax}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                  <FieldArray
                    name="assignees"
                    render={({ move, swap, push, insert, unshift, pop }) => (
                      <Box>
                        {values.assignees.map((assignee, index) => (
                          <Box key={index} padding="5px">
                            <Text>Person {index + 1}</Text>
                            <Select 
                              placeholder='None' 
                              defaultValue={null}
                              onChange={(v) => 
                                setFieldValue('assignees', 
                                  [...values.assignees.slice(0, index), v.target.value,
                                    ...values.assignees.slice(index + 1, values.assignees.length)])}>
                              {props.proj.people.map((person, index) => (
                                <option value={person.id}>{person.name}</option>))}
                            </Select>
                          </Box>
                        ))}
                      </Box>
                    )} /> 
                </Form> 
            )} 
        </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
    </Box>);
}