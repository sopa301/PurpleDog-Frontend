import { 
    Accordion,
    Box,
    Button,
    useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState, useContext } from "react";
import PersonSettings from "./personSettings";
import PersonMenu from "./personMenu";
import axios from "axios";
import { ToastContext } from "../../../main";
import { Person } from "../../../Objects";

export default function ManagePeople(props) {
    const toast = useContext(ToastContext);
    const [people, setPeople] = useState();
    const {isOpen, onOpen, onClose} = useDisclosure();

    const proj = props.proj;
    const update = props.update;
    useEffect(() => {
        if (proj && proj.people) {
            setPeople(proj.people.map(mapPeople));
        }
    }, [proj, update]);
    function mapPeople(person, index) {
        return <PersonSettings 
            key={person.id}
            person={person} 
            proj={props.proj}
            update={props.update}
            index={index}/>;
    }
    async function handleSubmit(values, actions) {
        await axios.put(import.meta.env.VITE_API_URL + '/person', {
            username: values.username,
            proj_id: props.proj.id,
            role: values.role,
        }).then(function (response) {
            toast({
            title: values.username + " added to project.",
            status: "success",
            duration: 3000,
            isClosable: true,
            });
            const newPerson = new Person(response.data.user_id, values.username, [], values.role);
            const newPeople = [...props.proj.people, newPerson];
            props.update(newPeople);
            onClose();
        }).catch(function (error) {
            toast({
                title: "Unable to add " + values.username + ".",
                description: error.toString(),
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            actions.setSubmitting(false);
            // const newPerson = new Person(2, values.username, [], values.role);
            // const newPeople = [...props.proj.people, newPerson];
            // props.update(newPeople);
            // onClose();
        });
    }

    return (
        <Box>
            <Accordion allowMultiple="true" defaultIndex={[-1]} padding="5px">
                {people}
            </Accordion>
            <Button onClick={onOpen}>Add Person</Button>
            <PersonMenu 
                initialValues={{username: "", role: "viewer"}}
                isOpen={isOpen}
                onClose={onClose}
                title="Add Person"
                onSubmit={handleSubmit}    
            />
        </Box>
    );
}