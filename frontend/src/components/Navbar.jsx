import {
    Button,
    Container,
    Flex,
    HStack,
    Text,
    useColorMode,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Badge,
    Avatar,
    IconButton,
    useToast,
    MenuDivider,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import { FaShoppingCart } from "react-icons/fa";
import { useAuthStore } from "../store/auth";
import { useCartStore } from "../store/cart";
import { useEffect } from "react";

const Navbar = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const { isAuthenticated, user, logout, deleteAccount } = useAuthStore();
    const { getCartItemCount, fetchCart } = useCartStore();
    const navigate = useNavigate();
    const toast = useToast();
    const cartItemCount = getCartItemCount();

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        }
    }, [isAuthenticated]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone and will delete all your products, orders, and reviews.")) {
            const { success, message } = await deleteAccount();
            toast({
                title: success ? "Success" : "Error",
                description: message,
                status: success ? "success" : "error",
                duration: 5000,
                isClosable: true,
            });
            if (success) {
                navigate("/");
            }
        }
    };

    return (
        <Container maxW={"1140px"} px={4}>
            <Flex
                h={16}
                justifyContent={"space-between"}
                alignItems={"center"}
                flexDir={{
                    base: "column",
                    sm: "row",
                }}
            >
                <Text
                    fontSize={{ base: "22", sm: "28" }}
                    fontWeight={"extrabold"}
                    textTransform={"uppercase"}
                    textAlign={"center"}
                    bgGradient={"linear(to-r, purple.600, purple.600)"}
                    bgClip={"text"}
                >
                    <Link to={"/"}>Product Store</Link>
                </Text>
                <HStack spacing={2} alignItems={"center"}>
                    {isAuthenticated ? (
                        <>
                            <Link to={"/create"}>
                                <Button>
                                    <PlusSquareIcon fontSize={20} />
                                </Button>
                            </Link>
                            <Link to={"/cart"}>
                                <IconButton
                                    icon={<FaShoppingCart />}
                                    aria-label="Shopping Cart"
                                    position="relative"
                                >
                                    {cartItemCount > 0 && (
                                        <Badge
                                            position="absolute"
                                            top="-1"
                                            right="-1"
                                            colorScheme="red"
                                            borderRadius="full"
                                            fontSize="xs"
                                        >
                                            {cartItemCount}
                                        </Badge>
                                    )}
                                </IconButton>
                            </Link>
                            <Menu>
                                <MenuButton as={Button} variant="ghost">
                                    <HStack>
                                        <Avatar size="sm" name={user?.name} src={user?.avatar} />
                                        <Text display={{ base: "none", md: "block" }}>
                                            {user?.name}
                                        </Text>
                                    </HStack>
                                </MenuButton>
                                <MenuList>
                                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                    <MenuDivider />
                                    <MenuItem onClick={handleDeleteAccount} color="red.500">
                                        Delete Account
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        </>
                    ) : (
                        <>
                            <Link to={"/login"}>
                                <Button variant="ghost">Login</Button>
                            </Link>
                            <Link to={"/register"}>
                                <Button colorScheme="purple">Register</Button>
                            </Link>
                        </>
                    )}
                    <Button onClick={toggleColorMode}>
                        {colorMode === "light" ? <IoMoon /> : <LuSun size="20" />}
                    </Button>
                </HStack>
            </Flex>
        </Container>
    );
};

export default Navbar;
