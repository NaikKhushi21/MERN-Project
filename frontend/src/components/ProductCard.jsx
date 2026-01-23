import { StarIcon } from "@chakra-ui/icons";
import {
    Box,
    Heading,
    HStack,
    Image,
    Text,
    useColorModeValue,
    Badge,
    Link,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useAuthStore } from "../store/auth";

const ProductCard = ({ product }) => {
    const textcolor = useColorModeValue("gray.600", "gray.200");
    const bg = useColorModeValue("white", "gray.800");
    const { user } = useAuthStore();
    const isOwner = user && product.user?._id === user._id;

    return (
        <Link as={RouterLink} to={`/products/${product._id}`} _hover={{ textDecoration: "none" }}>
            <Box
                shadow="lg"
                rounded="lg"
                overflow="hidden"
                transition="all 0.3s"
                _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
                bg={bg}
                cursor="pointer"
            >
                <Image src={product.image} alt={product.name} h={48} w="full" objectFit="cover" />

                <Box p={4}>
                    <HStack justify="space-between" mb={2}>
                        <Heading as="h3" size="md" noOfLines={1}>
                            {product.name}
                        </Heading>
                        {isOwner && (
                            <Badge colorScheme="purple" fontSize="xs">
                                Your Product
                            </Badge>
                        )}
                    </HStack>

                    <HStack mb={2}>
                        <Text fontWeight="bold" fontSize="xl" color="purple.600">
                            ${product.price}
                        </Text>
                        {product.averageRating > 0 && (
                            <HStack spacing={1}>
                                <StarIcon color="yellow.400" boxSize={3} />
                                <Text fontSize="sm" color={textcolor}>
                                    {product.averageRating.toFixed(1)}
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                    ({product.numReviews})
                                </Text>
                            </HStack>
                        )}
                    </HStack>

                    {product.category && (
                        <Badge colorScheme="blue" mb={2}>
                            {product.category.name}
                        </Badge>
                    )}

                    <HStack>
                        <Badge
                            colorScheme={product.stock > 0 ? "green" : "red"}
                            fontSize="xs"
                        >
                            {product.stock > 0 ? `In Stock` : "Out of Stock"}
                        </Badge>
                    </HStack>
                </Box>
            </Box>
        </Link>
    );
};

export default ProductCard;
