import { useState } from "react";
import { Task } from "../../Objects";
import {
  AccordionItem,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Button,
  Box,
  useDisclosure,
  Text,
  } from '@chakra-ui/react';
import {Interval} from "luxon";
import TaskMenu from './taskMenu';

export default function TaskList(props) {
  // Add menu state controllers
  const addDisclosure = useDisclosure();
  const isOpenAdd = addDisclosure.isOpen;
  const onOpenAdd = addDisclosure.onOpen;
  const onCloseAdd = addDisclosure.onClose;
  // Edit menu state controllers
  const editDisclosure = useDisclosure();
  const isOpenEdit = editDisclosure.isOpen;
  const onOpenEdit = editDisclosure.onOpen; 
  const onCloseEdit = editDisclosure.onClose;
  const [activeStart, setActiveStart] = useState();
  const [activeEnd, setActiveEnd] = useState();
  // Task selector state controller
  const [activeTask, setActiveTask] = useState();
  
  const tasks = props.array.map(mapTasks);

  function mapTasks(task, index, array) {
    function handleEdit() {
      setActiveStart(task.interval.start);
      setActiveEnd(task.interval.end);
      setActiveTask(task);
      onOpenEdit();
    }
    function handleDelete() {
      props.setArray([...props.array.slice(0, index),
        ...props.array.slice(index + 1, props.array.length)]);
    }
    function handleMove() {
      props.handleMove(task, index, props.setArray, props.array);
    }

    return (<AccordionItem key={index}>
      <h2>
        <AccordionButton>
          <Box as="span" flex='1' textAlign='left'>
            {task.name}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        <Text>Pax: {task.pax}</Text>
        <Text>Interval: {task.getInterval()}</Text>
        <Text>Time Needed: {task.getTimeNeeded()} hours</Text>
        <Button onClick={handleEdit}>Edit</Button> 
        <Button onClick={handleMove}>Move</Button>
        <Button onClick={handleDelete}>Delete</Button> 
      </AccordionPanel>
    </AccordionItem>);
  }

  function onAddTask() {
    onOpenAdd();
    setActiveStart();
    setActiveEnd();
  }

  function addTaskOnSubmit(values, actions) {
    onCloseAdd();
    const interval = Interval.fromDateTimes(activeStart, activeEnd);
    props.setArray([...props.array, 
      new Task(values.name, 
        values.pax, 
        interval)]);
  }
  function editTaskOnSubmit(values, actions) {
    onCloseEdit();
    const index = props.array.indexOf(activeTask);
    const interval = Interval.fromDateTimes(activeStart, activeEnd);
    const editedTask = new Task(values.name, values.pax, interval);
    props.setArray([...props.array.slice(0, index),
      editedTask,
      ...props.array.slice(index + 1, props.array.length)]);
  }

  return (
      <div>
          <Box>
              <Accordion allowMultiple="true" defaultIndex={[0]}>
                {tasks}
              </Accordion>  
              <br />
              <Button onClick={onAddTask}>Add Task</Button>
              <TaskMenu 
                modalIsOpen={isOpenAdd}
                modalOnClose={onCloseAdd}
                modalMenuType="Add Task"
                modalCloseButton={onCloseAdd}
                initialValues={{ name: '', pax:'' }}
                onSubmit={addTaskOnSubmit}
                activeStart={activeStart}
                activeEnd={activeEnd}
                setActiveStart={setActiveStart}
                setActiveEnd={setActiveEnd}
              />
              <TaskMenu 
                modalIsOpen={isOpenEdit}
                modalOnClose={onCloseEdit}
                modalMenuType="Edit Task"
                modalCloseButton={onCloseEdit}
                initialValues={activeTask}
                onSubmit={editTaskOnSubmit}
                activeStart={activeStart}
                activeEnd={activeEnd}
                setActiveStart={setActiveStart}
                setActiveEnd={setActiveEnd}
                />
          </Box>
      </div>
  );
}