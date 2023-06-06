import { Box, Button, Spacer } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function Nav(props) {
    return (
        <Box paddingX="10px">
            <Link to="./tasks"><Button>My Tasks</Button></Link>
            <Link to="./projects"><Button>Projects</Button></Link>  
        </Box>
    );
}