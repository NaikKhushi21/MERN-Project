import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Box,
    Heading,
    VStack,
    HStack,
    Text,
    Button,
    Input,
    FormControl,
    FormLabel,
    useColorModeValue,
    useToast,
    SimpleGrid,
    Divider,
} from "@chakra-ui/react";
import { useCartStore } from "../store/cart";
import { useOrderStore } from "../store/order";
import { useAuthStore } from "../store/auth";

const CheckoutPage = () => {
    const [shippingAddress, setShippingAddress] = useState({
        address: "",
        city: "",
        postalCode: "",
        country: "",
    });
    const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
    const { cart, getCartTotal } = useCartStore();
    const { createOrder, loading } = useOrderStore();
    const navigate = useNavigate();
    const toast = useToast();
    const bg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");

    const itemsPrice = getCartTotal();
    const taxPrice = itemsPrice * 0.1;
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!shippingAddress.address || !shippingAddress.city || 
            !shippingAddress.postalCode || !shippingAddress.country) {
            toast({
                title: "Error",
                description: "Please fill in all shipping address fields",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const { success, message, data } = await createOrder(shippingAddress, paymentMethod);

        if (success) {
            toast({
                title: "Success",
                description: message,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            navigate(`/orders/${data._id}`);
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

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <Container maxW="container.xl" py={12}>
                <VStack spacing={4}>
                    <Heading size="lg">Your Cart is Empty</Heading>
                    <Text color="gray.500">Add some products to checkout!</Text>
                    <Button colorScheme="purple" onClick={() => navigate("/")}>
                        Continue Shopping
                    </Button>
                </VStack>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={12}>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                {/* Shipping Form */}
                <Box bg={bg} p={6} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                    <Heading size="lg" mb={6}>
                        Shipping Information
                    </Heading>
                    <form onSubmit={handleSubmit}>
                        <VStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Address</FormLabel>
                                <Input
                                    placeholder="Enter your address"
                                    value={shippingAddress.address}
                                    onChange={(e) =>
                                        setShippingAddress({ ...shippingAddress, address: e.target.value })
                                    }
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>City</FormLabel>
                                <Input
                                    placeholder="Enter your city"
                                    value={shippingAddress.city}
                                    onChange={(e) =>
                                        setShippingAddress({ ...shippingAddress, city: e.target.value })
                                    }
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Postal Code</FormLabel>
                                <Input
                                    placeholder="Enter postal code"
                                    value={shippingAddress.postalCode}
                                    onChange={(e) =>
                                        setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                                    }
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Country</FormLabel>
                                <Input
                                    placeholder="Enter your country"
                                    value={shippingAddress.country}
                                    onChange={(e) =>
                                        setShippingAddress({ ...shippingAddress, country: e.target.value })
                                    }
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Payment Method</FormLabel>
                                <Input
                                    value={paymentMethod}
                                    readOnly
                                    bg={useColorModeValue("gray.50", "gray.700")}
                                />
                            </FormControl>

                            <Button
                                type="submit"
                                colorScheme="purple"
                                size="lg"
                                w="full"
                                isLoading={loading}
                                loadingText="Placing Order..."
                            >
                                Place Order
                            </Button>
                        </VStack>
                    </form>
                </Box>

                {/* Order Summary */}
                <Box bg={bg} p={6} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                    <Heading size="lg" mb={6}>
                        Order Summary
                    </Heading>
                    <VStack spacing={4} align="stretch">
                        {cart.items.map((item) => (
                            <HStack key={item._id} justify="space-between">
                                <Text>
                                    {item.product.name} x {item.quantity}
                                </Text>
                                <Text fontWeight="bold">
                                    ${(item.product.price * item.quantity).toFixed(2)}
                                </Text>
                            </HStack>
                        ))}

                        <Divider />

                        <HStack justify="space-between">
                            <Text>Items Price:</Text>
                            <Text>${itemsPrice.toFixed(2)}</Text>
                        </HStack>
                        <HStack justify="space-between">
                            <Text>Tax (10%):</Text>
                            <Text>${taxPrice.toFixed(2)}</Text>
                        </HStack>
                        <HStack justify="space-between">
                            <Text>Shipping:</Text>
                            <Text>{shippingPrice === 0 ? "FREE" : `$${shippingPrice.toFixed(2)}`}</Text>
                        </HStack>

                        <Divider />

                        <HStack justify="space-between">
                            <Text fontSize="xl" fontWeight="bold">
                                Total:
                            </Text>
                            <Text fontSize="xl" fontWeight="bold" color="purple.600">
                                ${totalPrice.toFixed(2)}
                            </Text>
                        </HStack>
                    </VStack>
                </Box>
            </SimpleGrid>
        </Container>
    );
};

export default CheckoutPage;
