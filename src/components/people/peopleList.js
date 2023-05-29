import { useState } from "react";
import { Person } from "../../Objects";
import {
  ListItem,
  List,
  Button,
  Box,
  Heading,
  useDisclosure,
  Text,
  Card,
  CardBody,
  } from '@chakra-ui/react';
import PersonMenu from "./personMenu";
import TaskList from "../tasks/taskList";

export default function PeopleList(props) {
  const addDisclosure = useDisclosure();
  const isOpenAdd = addDisclosure.isOpen;
  const onOpenAdd = addDisclosure.onOpen;
  const onCloseAdd = addDisclosure.onClose;
  const editDisclosure = useDisclosure();
  const isOpenEdit = editDisclosure.isOpen;
  const onOpenEdit = editDisclosure.onOpen; 
  const onCloseEdit = editDisclosure.onClose;
  const [activePerson, setActivePerson] = useState();
  const [activeStart, setActiveStart] = useState();
  const [activeEnd, setActiveEnd] = useState();
  const [activeIntervalArray, setActiveIntervalArray] = useState([]);

  const people = props.array.map(mapPeople);

  function mapPeople(person) {
    function handleEdit() {
      setActiveIntervalArray(person.avails);
      setActivePerson(person); 
      onOpenEdit();
    }
    function handleDelete() {
      props.setArray(props.array.filter((value) => value !== person));
    }
    function setTaskArray(newArray) {
      const index = props.array.indexOf(person);
      const editedPerson = new Person(person.name, person.avails, newArray);
      props.setArray([...props.array.slice(0, index),
        editedPerson,
        ...props.array.slice(index + 1, props.array.length)])
    }
    return (<ListItem key={person} padding="5px">
      <Card>
        <CardBody>
          <Text>Name: {person.name}</Text>
          <Button onClick={handleEdit}>Edit Person</Button> 
          <Button onClick={handleDelete}>Delete Person</Button> 
          <Text>Assigned Tasks:</Text>
          <TaskList array={person.tasks} setArray={setTaskArray}/>
        </CardBody>
      </Card>
    </ListItem>);
  }

  function onAddPerson() {
    onOpenAdd();
    setActivePerson();
    setActiveIntervalArray([]);
  }

  function addPersonOnSubmit(values, actions) {
    onCloseAdd();
    props.setArray([...props.array, new Person(values.name, activeIntervalArray, [])]);
  }

  function editPersonOnSubmit(values, actions) {
    onCloseEdit();
    const index = props.array.indexOf(activePerson);
    const editedPerson = new Person(values.name, activeIntervalArray, activePerson.tasks);
    props.setArray([...props.array.slice(0, index),
      editedPerson,
      ...props.array.slice(index + 1, props.array.length)]);
  }

  return (
    <div>
        <Heading>People</Heading>
        <Box>
            <List>
                {people}
            </List>
            <br />
            <Button onClick={onAddPerson}>Add Person</Button>
            <PersonMenu 
              modalIsOpen={isOpenAdd}
              modalOnClose={onCloseAdd}
              modalMenuType="Add Person"
              modalCloseButton={onCloseAdd}
              initialValues={{ name: '' }}
              onSubmit={addPersonOnSubmit}
              activeStart={activeStart}
              activeEnd={activeEnd}
              setActiveStart={setActiveStart}
              setActiveEnd={setActiveEnd}
              activeIntervalArray={activeIntervalArray}
              setActiveIntervalArray={setActiveIntervalArray}
            />
            <PersonMenu 
              modalIsOpen={isOpenEdit}
              modalOnClose={onCloseEdit}
              modalMenuType="Edit Person"
              modalCloseButton={onCloseEdit}
              initialValues={activePerson}
              onSubmit={editPersonOnSubmit}
              activeStart={activeStart}
              activeEnd={activeEnd}
              setActiveStart={setActiveStart}
              setActiveEnd={setActiveEnd}
              activeIntervalArray={activeIntervalArray}
              setActiveIntervalArray={setActiveIntervalArray}
            />
        </Box>
    </div>
  );
}