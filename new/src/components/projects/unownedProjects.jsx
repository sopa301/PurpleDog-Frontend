import {
    ListItem,
    List,
    Button,
    Box,
    Skeleton,
    Stack,
    Flex,
    Spacer,
    Card,
    Container,
  } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function UnownedProjects(props) {
    const [projects, setProjects] = useState();

    const arrayEffect = props.array;
    useEffect(() => {
        if (arrayEffect) {
            setProjects(arrayEffect.map(mapProjects));
        }
    }, [arrayEffect]);
    
    function mapProjects(proj) {
        return <ListItem key={proj.proj_id}>
            <Card padding="5px">
                <Flex alignItems="center">
                    <Container maxWidth="40ch">{proj.proj_name}</Container>
                    <Spacer/>
                    <Link to={"./" + proj.proj_id}><Button>Open</Button></Link>
                </Flex>
            </Card>
        </ListItem>;
    }
    return (
        <Box>
            {projects 
                ? (<List>
                    {projects}
                </List>)
                : <Stack>
                    <Skeleton height='20px'/>
                    <Skeleton height='20px'/>
                    <Skeleton height='20px'/>
                </Stack>
            }
        </Box>
    );
}