import {Heading} from '@chakra-ui/react';
import { useOutletContext } from 'react-router-dom';

export default function Home() {
    const [user] = useOutletContext();
    return <Heading >Hello, {user}.</Heading>;
}