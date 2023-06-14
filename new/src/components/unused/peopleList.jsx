import { useState } from "react";
import { Person } from "../../Objects";
import {
  Flex,
  Spacer,
  AccordionItem,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Button,
  Box,
  Heading,
  useDisclosure,
  } from '@chakra-ui/react';
import PersonMenu from "./personMenu";
import TaskList from "./taskList";

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

  function mapPeople(person, index, array) {
    function handleEdit() {
      setActiveIntervalArray(person.avails);
      setActivePerson(person); 
      onOpenEdit();
    }
    function handleDelete() {
      props.setArray([...props.array.slice(0, index),
        ...props.array.slice(index + 1, props.array.length)]);
    }
    function setTaskArray(newArray) {
      const editedPerson = new Person(person.name, person.avails, newArray);
      props.setArray([...props.array.slice(0, index),
        editedPerson,
        ...props.array.slice(index + 1, props.array.length)])
    }

    return (<AccordionItem backgroundColor="#FFEBC3" color="#703A44" key={index}>
      <h2>
        <AccordionButton>
          <Box as="span" flex='1' textAlign='left'>
            <b>{person.name}</b>
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
      <Flex>
        Assigned Tasks:
        <Spacer />
        <Button onClick={handleEdit}>Edit Person</Button> 
        <Button onClick={handleDelete}>Delete Person</Button> 
      </Flex>
        <TaskList 
          array={person.tasks} 
          setArray={setTaskArray} 
          handleMove={props.handleMove}
        />
      </AccordionPanel>
    </AccordionItem>);
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
            <Accordion allowMultiple="true" defaultIndex={[0]}>
                {people}
            </Accordion>
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