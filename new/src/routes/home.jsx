import {Box, Heading} from '@chakra-ui/react';
import { useOutletContext } from 'react-router-dom';
import Profile from '../components/profile';

export default function Home() {
    const [user] = useOutletContext();
    return (<Box>
        <Heading >Hello, {user}.</Heading>
        <Profile/>
    </Box>);
}