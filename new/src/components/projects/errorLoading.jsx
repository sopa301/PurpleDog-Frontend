import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function ErrorLoading(props) {
    const navigate = useNavigate();
    props.toast({
        title: "Unable to load project.",
        status: "error",
        duration: 9000,
        isClosable: true,
    });
    useEffect(() => {
        navigate("./projects");
    })
    return <div></div>;
}