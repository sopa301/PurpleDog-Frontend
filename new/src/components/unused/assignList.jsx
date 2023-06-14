import {
    Box,
    Button,
    useDisclosure,
} from '@chakra-ui/react';
import { useContext } from 'react';
import { ToastContext } from '../../../main';
import AssignMenu from './assignMenu';

export default function AssignList(props) {
    const toast = useContext(ToastContext);
    const {onOpen, isOpen, onClose} = useDisclosure();

    function handleSubmit(values, actions) {

    }
    return (<Box>
        <Button onClick={onOpen}>Assign Tasks</Button>
        <AssignMenu
            isOpen={isOpen}
            onClose={onClose}
            initialValues={{pax: 0, assignees: Array.apply(null, Array(5)).map(function () {}) }}
            onSubmit={handleSubmit}
            proj={props.proj}
        />
    </Box>);
}