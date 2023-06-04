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

    function mapPeople(person, index) {
        function moveTask() {
            const {task, taskIndex, setOriginalArray, originalArray} = props.taskPack;
            // check for same place
            if ((originalArray === props.taskArray && person.unassigned === "true") 
                || originalArray === person.tasks) {
                props.modalOnClose();
                return;
            }
            // delete task from old place
            setOriginalArray([...originalArray.slice(0, taskIndex), 
                ...originalArray.slice(taskIndex + 1, originalArray.length)]);

            // add task to new place
            if (person.name === "Unassigned" && person.unassigned === "true") {
                props.setTaskArray(ta => [...ta, task]);
            } else {
                const newTaskArray = [...person.tasks, task];
                const editedPerson = new Person(person.name, person.avails, newTaskArray);
                props.setPeopleArray(pa => [...pa.slice(0, index),
                    editedPerson,
                    ...pa.slice(index + 1, pa.length)]);
            }
            props.modalOnClose();
        }
        return (
            <ListItem key={index}>
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

function createOptions(array) {
    return [...array, {"name": "Unassigned", "unassigned":"true"}];
}