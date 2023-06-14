import { useContext, useState, useEffect } from "react";
import { ToastContext } from "../../../main";
import { Accordion, Box, Button, useDisclosure } from "@chakra-ui/react";
import TaskMenu from "./taskMenu";
import TaskSettings from "./taskSettings";
import { DateTime, Interval } from "luxon";
import { TaskGroup } from "../../../objects/taskGroup";
import { Task } from "../../../objects/task";
import axios from "axios";

export default function ManageTasks(props) {
  const toast = useContext(ToastContext);
  const [taskGroups, setTaskGroups] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const proj = props.proj;
  const update = props.update;
  useEffect(() => {
    if (proj && proj.taskGroups) {
      setTaskGroups(proj.taskGroups.map(mapTaskGroups));
    }
  }, [proj, update]);
  function mapTaskGroups(taskGroup, index) {
    return (
      <TaskSettings
        key={taskGroup.id}
        taskGroup={taskGroup}
        index={index}
        update={props.update}
        proj={props.proj}
      />
    );
  }
  async function handleSubmit(values, actions) {
    const array = [];
    const interval = Interval.fromDateTimes(values.start, values.end);
    for (let i = 0; i < values.assignees.length; i++) {
      array[i] = new Task(
        null,
        interval,
        values.assignees[i],
        "idk",
        props.proj.id,
        values.priority,
        null,
        values.assignees[i] ? true : false
      );
    }
    await axios
      .put(import.meta.env.VITE_API_URL + "/taskgroup", {
        proj_id: props.proj_id,
        pax: values.pax,
        tasks_arr_JSON: array,
      })
      .then(function (response) {
        toast({
          title: values.name + " added to project.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        // might have issues with keys in taskmenu
        const newTaskGroup = new TaskGroup(
          response.data.id,
          values.name,
          array,
          values.pax
        );
        const newTaskGroups = [...props.proj.taskGroups, newTaskGroup];
        props.update(newTaskGroups);
        onClose();
      })
      .catch(function (error) {
        toast({
          title: "Unable to add " + values.username + ".",
          description: error.toString(),
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        actions.setSubmitting(false);
        const newTaskGroup = new TaskGroup(
          1,
          values.name,
          array,
          values.pax
        );
        const newTaskGroups = [...props.proj.taskGroups, newTaskGroup];
        props.update(newTaskGroups);
        onClose();
      });
  }
  return (
    <Box>
      <Accordion allowMultiple="true" defaultIndex={[-1]}>
        {taskGroups}
      </Accordion>
      <Button onClick={onOpen}>Add Task</Button>
      <TaskMenu
        isOpen={isOpen}
        onClose={onClose}
        title="Add Task"
        initialValues={{
          name: "",
          pax: "",
          priority: 0,
          start: DateTime.now(),
          end: DateTime.now(),
          assignees: [],
        }}
        onSubmit={handleSubmit}
        proj={props.proj}
      />
    </Box>
  );
}
