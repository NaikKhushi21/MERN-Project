import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    Container,
    Box,
    Heading,
    VStack,
    HStack,
    Text,
    Button,
    Image,
    IconButton,
    useColorModeValue,
    useToast,
    Badge,
    Divider,
} from "@chakra-ui/react";
import { DeleteIcon, AddIcon, MinusIcon } from "@chakra-ui/icons";
import { useCartStore } from "../store/cart";
import { useAuthStore } from "../store/auth";

const CartPage = () => {
    const { cart, loading, fetchCart, updateCartItem, removeFromCart, clearCart, getCartTotal } =
        useCartStore();
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const toast = useToast();
    const bg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");

    useEffect(() => {
        if (!isAuthenticated) {
            toast({
                title: "Login Required",
                description: "Please login to view your cart",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            navigate("/login");
            return;
        }
        fetchCart();
    }, [isAuthenticated]);

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) {
            handleRemoveItem(itemId);
            return;
        }
        const { success, message } = await updateCartItem(itemId, newQuantity);
        if (!success) {
            toast({
                title: "Error",
                description: message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleRemoveItem = async (itemId) => {
        const { success, message } = await removeFromCart(itemId);
        toast({
            title: success ? "Success" : "Error",
            description: message,
            status: success ? "success" : "error",
            duration: 3000,
            isClosable: true,
        });
    };

    const handleClearCart = async () => {
        if (window.confirm("Are you sure you want to clear your cart?")) {
            const { success, message } = await clearCart();
            toast({
                title: success ? "Success" : "Error",
                description: message,
                status: success ? "success" : "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    if (loading) {
        return (
            <Container maxW="container.xl" py={12}>
                <Text>Loading cart...</Text>
            </Container>
        );
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <Container maxW="container.xl" py={12}>
                <VStack spacing={4}>
                    <Heading size="lg">Your Cart is Empty</Heading>
                    <Text color="gray.500">Add some products to get started!</Text>
                    <Link to="/">
                        <Button colorScheme="purple">Continue Shopping</Button>
                    </Link>
                </VStack>
            </Container>
        );
    }

    const total = getCartTotal();

    return (
        <Container maxW="container.xl" py={12}>
            <VStack spacing={6} align="stretch">
                <HStack justify="space-between">
                    <Heading size="lg">Shopping Cart</Heading>
                    <Button variant="outline" colorScheme="red" onClick={handleClearCart}>
                        Clear Cart
                    </Button>
                </HStack>

                <VStack spacing={4} align="stretch">
                    {cart.items.map((item) => (
                        <Box
                            key={item._id}
                            bg={bg}
                            p={4}
                            borderRadius="lg"
                            borderWidth="1px"
                            borderColor={borderColor}
                        >
                            <HStack spacing={4} align="start">
                                <Link to={`/products/${item.product._id}`}>
                                    <Image
                                        src={item.product.image}
                                        alt={item.product.name}
                                        boxSize="100px"
                                        objectFit="cover"
                                        borderRadius="md"
                                        cursor="pointer"
                                    />
                                </Link>
                                <VStack align="start" flex={1} spacing={2}>
                                    <Link to={`/products/${item.product._id}`}>
                                        <Heading size="sm" _hover={{ color: "purple.500" }}>
                                            {item.product.name}
                                        </Heading>
                                    </Link>
                                    <Text fontSize="lg" fontWeight="bold" color="purple.600">
                                        ${item.product.price}
                                    </Text>
                                    {item.product.stock < item.quantity && (
                                        <Badge colorScheme="red">Insufficient Stock</Badge>
                                    )}
                                </VStack>
                                <VStack spacing={2}>
                                    <HStack>
                                        <IconButton
                                            icon={<MinusIcon />}
                                            size="sm"
                                            onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                                        />
                                        <Text minW="40px" textAlign="center">
                                            {item.quantity}
                                        </Text>
                                        <IconButton
                                            icon={<AddIcon />}
                                            size="sm"
                                            onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                                            isDisabled={item.product.stock <= item.quantity}
                                        />
                                    </HStack>
                                    <Text fontWeight="bold">
                                        ${(item.product.price * item.quantity).toFixed(2)}
                                    </Text>
                                    <IconButton
                                        icon={<DeleteIcon />}
                                        colorScheme="red"
                                        size="sm"
                                        onClick={() => handleRemoveItem(item._id)}
                                    />
                                </VStack>
                            </HStack>
                        </Box>
                    ))}
                </VStack>

                <Divider />

                <Box bg={bg} p={6} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                    <VStack spacing={4} align="stretch">
                        <HStack justify="space-between">
                            <Text fontSize="xl" fontWeight="bold">
                                Total:
                            </Text>
                            <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                                ${total.toFixed(2)}
                            </Text>
                        </HStack>
                        <Button 
                            colorScheme="purple" 
                            size="lg" 
                            w="full"
                            onClick={() => navigate("/checkout")}
                        >
                            Proceed to Checkout
                        </Button>
                        <Link to="/">
                            <Button variant="outline" w="full">
                                Continue Shopping
                            </Button>
                        </Link>
                    </VStack>
                </Box>
            </VStack>
        </Container>
    );
};

export default CartPage;
