import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Container,
    Box,
    Heading,
    VStack,
    HStack,
    Text,
    Button,
    Image,
    useColorModeValue,
    Badge,
    Divider,
    SimpleGrid,
} from "@chakra-ui/react";
import { useOrderStore } from "../store/order";

const OrderDetailsPage = () => {
    const { id } = useParams();
    const { order, loading, fetchOrder } = useOrderStore();
    const bg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");

    useEffect(() => {
        fetchOrder(id);
    }, [id]);

    if (loading) {
        return (
            <Container maxW="container.xl" py={12}>
                <Text>Loading order...</Text>
            </Container>
        );
    }

    if (!order) {
        return (
            <Container maxW="container.xl" py={12}>
                <VStack spacing={4}>
                    <Heading size="lg">Order Not Found</Heading>
                    <Link to="/">
                        <Button colorScheme="purple">Go Home</Button>
                    </Link>
                </VStack>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={12}>
            <VStack spacing={8} align="stretch">
                <HStack justify="space-between">
                    <Heading size="xl">Order Details</Heading>
                    <Badge colorScheme={order.isPaid ? "green" : "yellow"} fontSize="md" p={2}>
                        {order.isPaid ? "Paid" : "Pending Payment"}
                    </Badge>
                </HStack>

                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                    {/* Order Items */}
                    <Box bg={bg} p={6} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                        <Heading size="md" mb={4}>
                            Order Items
                        </Heading>
                        <VStack spacing={4} align="stretch">
                            {order.orderItems.map((item, index) => (
                                <HStack key={index} spacing={4}>
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        boxSize="80px"
                                        objectFit="cover"
                                        borderRadius="md"
                                    />
                                    <VStack align="start" flex={1} spacing={1}>
                                        <Text fontWeight="bold">{item.name}</Text>
                                        <Text fontSize="sm" color="gray.500">
                                            Quantity: {item.quantity}
                                        </Text>
                                        <Text fontWeight="bold" color="purple.600">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </Text>
                                    </VStack>
                                </HStack>
                            ))}
                        </VStack>
                    </Box>

                    {/* Shipping & Payment Info */}
                    <VStack spacing={4} align="stretch">
                        <Box bg={bg} p={6} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                            <Heading size="md" mb={4}>
                                Shipping Address
                            </Heading>
                            <VStack align="start" spacing={2}>
                                <Text>{order.shippingAddress.address}</Text>
                                <Text>
                                    {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                                </Text>
                                <Text>{order.shippingAddress.country}</Text>
                            </VStack>
                        </Box>

                        <Box bg={bg} p={6} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                            <Heading size="md" mb={4}>
                                Payment Method
                            </Heading>
                            <Text>{order.paymentMethod}</Text>
                        </Box>

                        <Box bg={bg} p={6} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                            <Heading size="md" mb={4}>
                                Order Summary
                            </Heading>
                            <VStack spacing={2} align="stretch">
                                <HStack justify="space-between">
                                    <Text>Items:</Text>
                                    <Text>${order.itemsPrice.toFixed(2)}</Text>
                                </HStack>
                                <HStack justify="space-between">
                                    <Text>Tax:</Text>
                                    <Text>${order.taxPrice.toFixed(2)}</Text>
                                </HStack>
                                <HStack justify="space-between">
                                    <Text>Shipping:</Text>
                                    <Text>
                                        {order.shippingPrice === 0
                                            ? "FREE"
                                            : `$${order.shippingPrice.toFixed(2)}`}
                                    </Text>
                                </HStack>
                                <Divider />
                                <HStack justify="space-between">
                                    <Text fontSize="lg" fontWeight="bold">
                                        Total:
                                    </Text>
                                    <Text fontSize="lg" fontWeight="bold" color="purple.600">
                                        ${order.totalPrice.toFixed(2)}
                                    </Text>
                                </HStack>
                            </VStack>
                        </Box>
                    </VStack>
                </SimpleGrid>

                <Link to="/">
                    <Button colorScheme="purple" w="full">
                        Continue Shopping
                    </Button>
                </Link>
            </VStack>
        </Container>
    );
};

export default OrderDetailsPage;
