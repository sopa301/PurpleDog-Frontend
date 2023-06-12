import {
    Flex,
    Spacer,
    Box,
    RadioGroup,
    Stack,
    Radio,
    AccordionItem,
    AccordionButton,
    AccordionIcon,
    AccordionPanel,
} from "@chakra-ui/react";
import CButton from "../../custom/cButton";
import { useState, useContext } from "react";
import { Person } from "../../../objects/person";
import axios from "axios";
import { ToastContext } from "../../../main";
import AvailList from "./availList";

export default function PersonSettings(props) {
    const toast = useContext(ToastContext);
    const [val, setVal] = useState(props.person.role);
    const [avails, setAvails] = useState(props.person.avails);
    const [isOwner] = useState(() => props.person.id.toString() === localStorage.getItem("user_id"));
    async function setPerm(newVal) {
        if (val === newVal) {
            return;
        } else {
            axios.patch(import.meta.env.VITE_API_URL + '/person', {
                user_id: props.person.id,
                proj_id: props.proj.id,
                role: newVal,
            }).then(function (response) {
                toast({
                title: props.person.name + " set to " + newVal + ".",
                status: "success",
                duration: 9000,
                isClosable: true,
                });
                const newPerson = new Person(props.person.id, props.person.name, props.person.avails, newVal);
                const newPeople = [...props.proj.people.slice(0, props.index),
                    newPerson,
                    ...props.proj.people.slice(props.index + 1, props.proj.people.length)];
                props.update(newPeople);
            }).catch(function (error) {
                toast({
                    title: "Unable to set role for " + props.person.name + ".",
                    description: error.toString(),
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
                setVal(val);
            });
        }
    }
    async function handleDelete() {
        axios.delete(import.meta.env.VITE_API_URL + '/person', {
            user_id: props.person.id,
            proj_id: props.proj.id,
        }).then(function (response) {
            toast({
            title: props.person.name + " removed.",
            status: "success",
            duration: 9000,
            isClosable: true,
            });
            const newPeople = [...props.proj.people.slice(0, props.index),
                ...props.proj.people.slice(props.index + 1, props.proj.people.length)];
            props.update(newPeople);
        }).catch(function (error) {
            toast({
                title: "Unable to remove " + props.person.name,
                description: error.toString(),
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        });
    }
    function updateAvails(newAvails) {
        setAvails(newAvails);
        const newPerson = new Person(props.person.id, props.person.name, newAvails, props.person.role);
        const newPeople = [...props.proj.people.slice(0, props.index),
            newPerson,
            ...props.proj.people.slice(props.index + 1, props.proj.people.length)];
        props.update(newPeople);
    }
    return <AccordionItem>
        <AccordionButton padding="5px">
            <Flex w="100%">
                <Box textAlign="left" fontWeight='semibold'>{props.person.name}</Box>
                <Spacer />
                <AccordionIcon/>
            </Flex>
        </AccordionButton>
        <AccordionPanel>
            { isOwner ? <div/> : <Flex>
                <RadioGroup onChange={setPerm} value={val}>
                    <Stack direction='row'>
                        <Radio value='editor'>Editor</Radio>
                        <Radio value='viewer'>Viewer</Radio>
                    </Stack>
                </RadioGroup>
                <Spacer/>
                <CButton children={{colorScheme: "red", paddingX: "5px"}}
                    content="Remove from project" 
                    onClick={handleDelete}
                />
            </Flex>}
            <AvailList array={avails} setArray={updateAvails} person={props.person}/>
        </AccordionPanel>
    </AccordionItem>
}