import { useState } from "react";
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Link,
    Text,
    useColorModeValue,
    useToast,
    VStack,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();
    const { login } = useAuthStore();

    const bg = useColorModeValue("white", "gray.800");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { success, message } = await login(formData.email, formData.password);

        setLoading(false);

        if (success) {
            toast({
                title: "Success",
                description: message,
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            navigate("/");
        } else {
            toast({
                title: "Error",
                description: message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Container maxW="container.sm" py={12}>
            <VStack spacing={8}>
                <Heading as="h1" size="2xl" textAlign="center">
                    Login
                </Heading>

                <Box w="full" bg={bg} p={8} shadow="md" rounded="lg">
                    <form onSubmit={handleSubmit}>
                        <VStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Password</FormLabel>
                                <Input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                />
                            </FormControl>

                            <Button
                                type="submit"
                                colorScheme="purple"
                                w="full"
                                isLoading={loading}
                                loadingText="Logging in..."
                            >
                                Login
                            </Button>

                            <Text>
                                Don't have an account?{" "}
                                <Link as={RouterLink} to="/register" color="purple.500">
                                    Register here
                                </Link>
                            </Text>
                        </VStack>
                    </form>
                </Box>
            </VStack>
        </Container>
    );
};

export default LoginPage;
