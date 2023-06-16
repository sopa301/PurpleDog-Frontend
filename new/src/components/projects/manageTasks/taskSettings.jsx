import {
  Flex,
  Spacer,
  Box,
  Button,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import CButton from "../../custom/cButton";
import { useState, useContext, useEffect } from "react";
import { Task } from "../../../objects/task";
import axios from "axios";
import { ToastContext } from "../../../main";
import TaskMenu from "./taskMenu";
import { Interval } from "luxon";
import { TaskGroup } from "../../../objects/taskGroup";

export default function TaskSettings(props) {
  const toast = useContext(ToastContext);
  const [tasks, setTasks] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const tgEffect = props.taskGroup;
  const updateEffect = props.update;
  useEffect(() => {
    if (tgEffect && tgEffect.tasks) {
      setTasks(tgEffect.tasks.map(mapTG));
    }
  }, [updateEffect]);
  function mapTG(task) {
    let out;
    if (task.user_id > 0) {
      const name = props.proj.people.filter(
        (x) => Number(x.id) === Number(task.user_id)
      )[0].name;
      out = <Text key={task.task_id}>{name}</Text>;
    } else {
      out = <Box key={task.id} />;
    }
    return out;
  }
  async function handleEdit(values, actions) {
    const array = [];
    const outArray = [];
    const interval = Interval.fromDateTimes(values.start, values.end);
    for (let i = 0; i < values.assignees.length; i++) {
      array[i] = new Task(
        null,
        interval,
        values.assignees[i],
        values.completed,
        props.proj.id,
        values.priority,
        props.taskGroup.id,
        values.assignees[i] ? true : false
      );
      outArray[i] = array[i].toJSONable();
    }
    axios
      .patch(import.meta.env.VITE_API_URL + "/taskgroup", {
        group_id: props.taskGroup.id,
        pax: values.pax,
        tasks_arr_JSON: outArray,
      })
      .then(function (response) {
        toast({
          title: "Task settings edited.",
          status: "success",
          duration: 1000,
          isClosable: true,
        });
        for (let i = 0; i < array.length; i++) {
          array[i].task_id = response.data.id_array[i];
        }
        const newTaskGroup = new TaskGroup(
          props.taskGroup.id,
          values.name,
          array,
          values.pax
        );
        const newTaskGroups = [
          ...props.proj.taskGroups.slice(0, props.index),
          newTaskGroup,
          ...props.proj.taskGroups.slice(
            props.index + 1,
            props.proj.taskGroups.length
          ),
        ];
        props.update(newTaskGroups);
        onClose();
      })
      .catch(function (error) {
        toast({
          title: "Unable to edit task settings.",
          description: error.toString(),
          status: "error",
          duration: 1000,
          isClosable: true,
        });
        const newTaskGroup = new TaskGroup(
          props.taskGroup.id,
          values.name,
          array,
          values.pax
        );
        const newTaskGroups = [
          ...props.proj.taskGroups.slice(0, props.index),
          newTaskGroup,
          ...props.proj.taskGroups.slice(
            props.index + 1,
            props.proj.taskGroups.length
          ),
        ];
        props.update(newTaskGroups);
        onClose();
      });
  }
  async function handleDelete() {
    await axios
      .delete(import.meta.env.VITE_API_URL + "/taskgroup", {
        data: {
          group_id: props.taskGroup.id,
        },
      })
      .then(function (response) {
        toast({
          title: props.taskGroup.name + " removed from project.",
          status: "success",
          duration: 1000,
          isClosable: true,
        });
        const newTaskGroup = [
          ...props.proj.taskGroups.slice(0, props.index),
          ...props.proj.taskGroups.slice(
            props.index + 1,
            props.proj.taskGroups.length
          ),
        ];
        props.update(newTaskGroup);
        onClose();
      })
      .catch(function (error) {
        toast({
          title: "Unable to remove " + props.taskGroup.name,
          description: error.toString(),
          status: "error",
          duration: 1000,
          isClosable: true,
        });
        actions.setSubmitting(false);
      });
  }
  return (
    <AccordionItem>
      <AccordionButton padding="5px">
        <Flex w="100%">
          <Box textAlign="left" fontWeight="semibold">
            {props.taskGroup.name}
          </Box>
          <Spacer />
          <AccordionIcon />
        </Flex>
      </AccordionButton>
      <AccordionPanel>
        <Flex align="center">
          <Text>{props.taskGroup.tasks[0].getInterval()}</Text>
          <Spacer />
          <Button onClick={onOpen}>Edit Task</Button>
          <CButton
            children={{ colorScheme: "red", paddingX: "5px" }}
            content="Remove Task"
            onClick={handleDelete}
          />
        </Flex>
        <Text>{props.taskGroup.pax} pax</Text>
        <Box>Current assignees:</Box>
        <Box>{tasks}</Box>
      </AccordionPanel>
      <TaskMenu
        isOpen={isOpen}
        onClose={onClose}
        title="Edit Task"
        proj={props.proj}
        initialValues={{
          name: props.taskGroup.name,
          pax: props.taskGroup.pax,
          priority: 0,
          start: props.taskGroup.tasks[0].interval.start,
          end: props.taskGroup.tasks[0].interval.end,
          assignees: props.taskGroup.tasks.map((x) => x.user_id),
        }}
        onSubmit={handleEdit}
      />
    </AccordionItem>
  );
}
