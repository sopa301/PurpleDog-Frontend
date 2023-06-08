import { useContext, useState, useEffect } from "react";
import { ToastContext } from "../../../main";
import {
    Accordion, 
    Box, 
    Button,
    useDisclosure,
} from "@chakra-ui/react";
import TaskMenu from "./taskMenu";


export default function ManageTasks(props) {
    const toast = useContext(ToastContext);
    const [tasks, setTasks] = useState();
    const {isOpen, onOpen, onClose} = useDisclosure();

    const proj = props.proj;
    const update = props.update;
    useEffect(() => {
        if (proj && proj.tasks) {
            setTasks(proj.tasks.map(mapTasks));
        }
    }, [proj, update]);
    function mapTasks(task, index) {
        return <div>{task.toString()}</div>;
    }
    return (
        <Box>
            <Accordion allowMultiple="true" defaultIndex={[0]}>
                {tasks}
            </Accordion>
            <Button onClick={onOpen}>Add Task</Button>
            <TaskMenu
                isOpen={isOpen}
                onClose={onClose}
            />
        </Box>
    );
}