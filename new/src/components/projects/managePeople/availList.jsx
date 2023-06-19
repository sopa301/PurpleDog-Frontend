import { useEffect, useState, useContext, useRef } from "react";
import {
  ListItem,
  List,
  Button,
  Box,
  useDisclosure,
  Text,
  Flex,
  Container,
  Spacer,
  Card,
} from "@chakra-ui/react";
import { Interval, DateTime } from "luxon";
import AvailMenu from "./availMenu";
import { Availability } from "../../../objects/availability";
import axios from "axios";
import { ToastContext } from "../../../main";
import CButton from "../../custom/cButton";
import { AvailabilityJSONable } from "../../../objects/availabilityJSONable";

export default function AvailList(props) {
  const toast = useContext(ToastContext);
  const activeAvail = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const addAvail = {
    title: "Add Availability",
    initialValues: { start: DateTime.now(), end: DateTime.now() },
    onSubmit: addAvailOnSubmit,
  };
  const editAvailFn = (avail) => {
    return {
      title: "Edit Availability",
      initialValues: { start: avail.interval.start, end: avail.interval.end },
      onSubmit: editAvailOnSubmit,
    };
  };
  const [modalSettings, setModalSettings] = useState(addAvail);
  const [avails, setAvails] = useState();

  const arrayEffect = props.array;
  useEffect(() => {
    if (arrayEffect) {
      setAvails(arrayEffect.map(mapTasks));
    }
  }, [arrayEffect]);

  function mapTasks(avail) {
    function handleEdit() {
      onOpen();
      setModalSettings(editAvailFn(avail));
      activeAvail.current = avail;
    }
    async function handleDelete() {
      await axios
        .delete(import.meta.env.VITE_API_URL + "/avail", {
          data: {
            avail_id: avail.id,
          },
        })
        .then(function (response) {
          toast({
            title: "Availability removed.",
            status: "success",
            duration: 1000,
            isClosable: true,
          });
          props.setArray((x) => [
            ...x.slice(0, index),
            ...x.slice(index + 1, x.length),
          ]);
        })
        .catch(function (error) {
          toast({
            title: "Unable to remove availability.",
            description: getErrorMessage(error),
            status: "error",
            duration: 1000,
            isClosable: true,
          });
        });
    }
    return (
      <ListItem key={avail.id}>
        <Card paddingY="5px" paddingX="5px">
          <Flex>
            <Container>{avail.toString()}</Container>
            <Spacer />
            <Button onClick={handleEdit}>Edit</Button>
            <CButton
              content="Delete"
              onClick={handleDelete}
              children={{ colorScheme: "red" }}
            />
          </Flex>
        </Card>
      </ListItem>
    );
  }

  function onAddAvail() {
    setModalSettings(addAvail);
    onOpen();
  }

  async function addAvailOnSubmit(values, actions) {
    const interval = Interval.fromDateTimes(values.start, values.end);
    await axios
      .put(import.meta.env.VITE_API_URL + "/avail", {
        user_id: props.person.id,
        avail_JSON: new AvailabilityJSONable(null, interval.toISO({ suppressSeconds: true })),
        project_id: props.project_id,
      })
      .then(function (response) {
        toast({
          title: "Added availability.",
          status: "success",
          duration: 1000,
          isClosable: true,
        });
        onClose();
        props.setArray((x) => [
          ...x,
          new Availability(response.data.avail_id, interval),
        ]);
      })
      .catch(function (error) {
        toast({
          title: "Unable to add availability.",
          description: getErrorMessage(error),
          status: "error",
          duration: 1000,
          isClosable: true,
        });
        actions.setSubmitting(false);
      });
  }
  async function editAvailOnSubmit(values, actions) {
    const interval = Interval.fromDateTimes(values.start, values.end);
    await axios
      .patch(import.meta.env.VITE_API_URL + "/avail", {
        user_id: props.person.id,
        avail_JSON: new AvailabilityJSONable(activeAvail.current.id, interval.toISO({ suppressSeconds: true })),
        project_id: props.project_id,
        avail_id: activeAvail.current.id,
      })
      .then(function (response) {
        toast({
          title: "Edited availability.",
          status: "success",
          duration: 1000,
          isClosable: true,
        });
        onClose();
        const index = props.array.findIndex(
          (avail) => avail.id === activeAvail.current.id
        );
        props.setArray([
          ...props.array.slice(0, index),
          new Availability(activeAvail.current.id, interval),
          ...props.array.slice(index + 1, props.array.length),
        ]);
      })
      .catch(function (error) {
        toast({
          title: "Unable to edit availability.",
          description: getErrorMessage(error),
          status: "error",
          duration: 1000,
          isClosable: true,
        });
        actions.setSubmitting(false);
      });
  }

  return (
    <div>
      <Box>
        <Text>Availabilities</Text>
        <List>{avails}</List>
        <Button onClick={onAddAvail}>Add Availability</Button>
        <AvailMenu {...modalSettings} isOpen={isOpen} onClose={onClose} />
      </Box>
    </div>
  );
}
function getErrorMessage(error) {
  if (!error.response) {
    return "Network error.";
  }
  let status = error.response.status;
  return "Unknown error.";
}
