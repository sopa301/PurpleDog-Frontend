import { Fragment } from "react";
import {
    Flex,
    Spacer,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    List, 
    ListItem,
  } from '@chakra-ui/react';
import { Person } from "../../Objects";

export default function MoveMenu(props) {
    const options = createOptions(props.peopleArray);
    const people = options.map(mapPeople);

    function createOptions(array) {
        return [...array, {"name": "Unassigned", "unassigned":"true"}];
    }
    function mapPeople(person, index, array) {
        function moveTask() {
            const {task, taskIndex, setOriginalArray, originalArray} = props.taskPack;
            let newPeopleArray = props.peopleArray;
            // check for same place
            if ((originalArray === props.taskArray && person.unassigned === "true") 
                || originalArray === person.tasks) {
                props.modalOnClose();
                return;
            }
            // delete task from old place
            const newArray = [...originalArray.slice(0, taskIndex),
                ...originalArray.slice(taskIndex + 1, originalArray.length)]
            setOriginalArray(newArray);
            // if the unassigned task array is neither a source or destination array,
            // we need to update the people array immediately because setState 
            // only updates at rerender
            if (person.tasks !== props.taskArray && originalArray !== props.taskArray) {
                let originalPerson;
                for (let pax of props.peopleArray) {
                    if (pax.tasks === originalArray) {
                        originalPerson = pax;
                    }
                }
                let originalIndex = props.peopleArray.indexOf(originalPerson);
                newPeopleArray = [...props.peopleArray.slice(0, originalIndex),
                    new Person(originalPerson.name, originalPerson.avails, newArray),
                    ...props.peopleArray.slice(originalIndex + 1, props.peopleArray.length)];
            }
            // add task to new place
            if (person.name === "Unassigned" && person.unassigned === "true") {
                props.setTaskArray([...props.taskArray, task]);
            } else {
                const newTaskArray = [...person.tasks, task];
                const editedPerson = new Person(person.name, person.avails, newTaskArray);
                props.setPeopleArray([...newPeopleArray.slice(0, index),
                    editedPerson,
                    ...newPeopleArray.slice(index + 1, newPeopleArray.length)]);
            }
            props.modalOnClose();
        }
        return (
            <ListItem>
                <Flex>
                    {person.name}
                    <Spacer />
                    <Button onClick={moveTask}>Select</Button>
                </Flex>
            </ListItem>
        );
    }

    return (
    <Fragment>
      <Modal isOpen={props.modalIsOpen} onClose={props.modalOnClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Move Task</ModalHeader>
          <ModalCloseButton onClick={props.modalCloseButton}/>
          <ModalBody>
            <List>
                {people}
            </List>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Fragment>);
}