import { useEffect, useState } from "react";
import { TaskGroup } from "../../objects/taskGroup";
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Flex, Spacer, Text } from "@chakra-ui/react";


export default function Summary(props) {
    const proj = props.proj;
    const [summary, setSummary] = useState();
    useEffect(() => {
        if (proj) {
            setSummary(convertToSummary(proj).map(mapSummary));
        }
    }, [proj]);

    function mapSummary(obj) {
        return (
            <AccordionItem key={obj.person.id}>
                <AccordionButton padding="5px">
                    <Flex w="100%">
                        <Box textAlign="left" fontWeight='semibold'>{obj.person.name}</Box>
                        <Spacer />
                        <AccordionIcon/>
                    </Flex>
                </AccordionButton>
                <AccordionPanel>
                    {obj.taskGroups.map(mapTaskGroup)}
                </AccordionPanel>
            </AccordionItem>
        )
    }
    function mapTaskGroup(tg) {
        return <Text key={tg.tasks[0].id}>{tg.name} {tg.tasks[0].toString()}</Text>
    }

    return (
        <Accordion allowMultiple="true" defaultIndex={[-1]}>
            {summary}
        </Accordion>
    );
}

// Converts a Project object into a summary format
function convertToSummary(proj) {
    let array = [];
    let index = 0;
    for (const person of proj.people) {
        let taskGroups = [];
        for (const tg of proj.taskGroups) {
            taskGroups = addTasks(taskGroups, tg, person.id);
        }
        array[index] = {person: person, taskGroups: taskGroups};
        index++;
    }
    return array;
}

// Adds taskGroups containing one task which belongs to the id to the array and returns
// the array
function addTasks(array, taskGroup, id) {
    const out = [...array];
    for (const task of taskGroup.tasks) {
        if (Number(task.user_id) === Number(id)) {
            out.push(new TaskGroup(taskGroup.id, taskGroup.name, [task], taskGroup.pax, taskGroup.priority));
        }
    }
    return out;
}