import { useState } from "react";
import {
    ListItem,
    UnorderedList,
    Button,
    Box,
    useDisclosure,
    Text,
  } from '@chakra-ui/react';
import {Interval} from "luxon";
import AvailMenu from './availMenu';
import { DateTime } from "luxon";

export default function AvailList(props) {
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
      setActiveStart(task.start);
      setActiveEnd(task.end);
      setActiveTask(task); 
      onOpenEdit();
    }
    return <ListItem>
        <Text>{task.toLocaleString(DateTime.DATETIME_MED)}</Text>
        <Button onClick={handleEdit}>Edit</Button> 
        <Button onClick={() => props.setArray(props.array.filter((value) => value !== task))}>Delete</Button> 
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
    props.setArray([...props.array, interval]);
  }
  function editTaskOnSubmit (values, actions) {
    onCloseEdit();
    const interval = Interval.fromDateTimes(activeStart, activeEnd);
    const index = props.array.findIndex((avail) => avail === activeTask);
    props.setArray([...props.array.slice(0, index), interval, ...props.array.slice(index + 1, props.array.length)]);
  }

  return (
      <div>
          <Box>
              <UnorderedList>
                  {tasks}
              </UnorderedList>
              <Button onClick={onAddTask}>Add Availability</Button>
              <AvailMenu 
                modalIsOpen={isOpenAdd}
                modalOnClose={onCloseAdd}
                modalMenuType="Add Availability"
                modalCloseButton={onCloseAdd}
                onSubmit={addTaskOnSubmit}
                activeStart={activeStart}
                activeEnd={activeEnd}
                setActiveStart={setActiveStart}
                setActiveEnd={setActiveEnd}
              />
              <AvailMenu 
                modalIsOpen={isOpenEdit}
                modalOnClose={onCloseEdit}
                modalMenuType="Edit Availability"
                modalCloseButton={onCloseEdit}
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