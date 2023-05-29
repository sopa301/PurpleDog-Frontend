import { useState } from "react";
import { Task } from "../../Objects";
import {
    ListItem,
    List,
    Button,
    Box,
    useDisclosure,
    Text,
    Card,
    CardBody,
  } from '@chakra-ui/react';
import {Interval} from "luxon";
import TaskMenu from './taskMenu';

export default function TaskList(props) {
  const addDisclosure = useDisclosure();
  const isOpenAdd = addDisclosure.isOpen;
  const onOpenAdd = addDisclosure.onOpen;
  const onCloseAdd = addDisclosure.onClose;
  const editDisclosure = useDisclosure();
  const isOpenEdit = editDisclosure.isOpen;
  const onOpenEdit = editDisclosure.onOpen; 
  const onCloseEdit = editDisclosure.onClose;
  const [activeTask, setActiveTask] = useState();
  const [activeStart, setActiveStart] = useState();
  const [activeEnd, setActiveEnd] = useState();

  const tasks = props.array.map(mapTasks);

  function mapTasks(task) {
    function handleEdit() {
      setActiveStart(task.interval.start);
      setActiveEnd(task.interval.end);
      setActiveTask(task);
      onOpenEdit();
    }
    function handleDelete() {
      props.setArray(props.array.filter((value) => value !== task));
    }
    return <ListItem key={task} padding="5px">
        <Card>
          <CardBody>
            <Text>Task: {task.name}</Text>
            <Text>Pax: {task.pax}</Text>
            <Text>Interval: {task.getInterval()}</Text>
            <Text>Time Needed: {task.getTimeNeeded()} hours</Text>
            <Button onClick={handleEdit}>Edit</Button> 
            <Button onClick={handleDelete}>Delete</Button> 
          </CardBody>
        </Card>
      </ListItem>;
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
  function editTaskOnSubmit (values, actions) {
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
              <List>
                  {tasks}
              </List>
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