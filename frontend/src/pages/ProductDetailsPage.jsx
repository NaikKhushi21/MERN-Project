import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    Container,
    Box,
    Heading,
    Text,
    Image,
    Button,
    VStack,
    HStack,
    Badge,
    useColorModeValue,
    useToast,
    Input,
    Textarea,
    Divider,
    SimpleGrid,
    Skeleton,
    SkeletonText,
    IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    useDisclosure,
    Select,
    FormControl,
    FormLabel,
} from "@chakra-ui/react";
import { StarIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useProductStore } from "../store/product";
import { useCartStore } from "../store/cart";
import { useReviewStore } from "../store/review";
import { useAuthStore } from "../store/auth";

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const { product, loading, fetchProduct, deleteProduct, updateProduct } = useProductStore();
    const { addToCart } = useCartStore();
    const { reviews, loading: reviewsLoading, fetchReviews, createReview, deleteReview } = useReviewStore();
    const { isAuthenticated, user } = useAuthStore();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [quantity, setQuantity] = useState(1);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
    const [editProduct, setEditProduct] = useState(null);
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

    const bg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");

    useEffect(() => {
        fetchProduct(id);
        fetchReviews(id);
    }, [id]);

    useEffect(() => {
        if (product) {
            setEditProduct({
                name: product.name,
                description: product.description || "",
                price: product.price,
                stock: product.stock || 0,
                category: product.category?._id || "",
            });
        }
    }, [product]);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            toast({
                title: "Login Required",
                description: "Please login to add items to cart",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            navigate("/login");
            return;
        }

        const { success, message } = await addToCart(id, quantity);
        toast({
            title: success ? "Success" : "Error",
            description: message,
            status: success ? "success" : "error",
            duration: 3000,
            isClosable: true,
        });
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            const { success, message } = await deleteProduct(id);
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
        }
    };

    const handleSubmitReview = async () => {
        const { success, message } = await createReview(id, reviewForm.rating, reviewForm.comment);
        toast({
            title: success ? "Success" : "Error",
            description: message,
            status: success ? "success" : "error",
            duration: 3000,
            isClosable: true,
        });
        if (success) {
            setReviewForm({ rating: 5, comment: "" });
            fetchProduct(id);
        }
    };

    const handleUpdateProduct = async () => {
        // Clean the data before sending - convert empty category to null
        const cleanedData = {
            ...editProduct,
            category: editProduct.category === "" ? null : editProduct.category,
            price: Number(editProduct.price),
            stock: Number(editProduct.stock) || 0,
        };
        
        const { success, message } = await updateProduct(id, cleanedData);
        toast({
            title: success ? "Success" : "Error",
            description: message,
            status: success ? "success" : "error",
            duration: 3000,
            isClosable: true,
        });
        if (success) {
            onEditClose();
            fetchProduct(id);
        }
    };

    const isOwner = product && user && product.user._id === user._id;

    if (loading) {
        return (
            <Container maxW="container.xl" py={12}>
                <Skeleton height="400px" />
                <SkeletonText mt="4" noOfLines={5} spacing="4" />
            </Container>
        );
    }

    if (!product) {
        return (
            <Container maxW="container.xl" py={12}>
                <Text fontSize="xl">Product not found</Text>
                <Link to="/">
                    <Button mt={4}>Go Back</Button>
                </Link>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py={12}>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                {/* Product Image */}
                <Box>
                    <Image src={product.image} alt={product.name} borderRadius="lg" w="full" />
                </Box>

                {/* Product Info */}
                <VStack align="stretch" spacing={4}>
                    <HStack justify="space-between">
                        <Heading size="xl">{product.name}</Heading>
                        {isOwner && (
                            <HStack>
                                <IconButton icon={<EditIcon />} onClick={onEditOpen} colorScheme="purple" />
                                <IconButton icon={<DeleteIcon />} onClick={handleDelete} colorScheme="red" />
                            </HStack>
                        )}
                    </HStack>

                    <HStack>
                        <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                            ${product.price}
                        </Text>
                        {product.averageRating > 0 && (
                            <HStack>
                                <StarIcon color="yellow.400" />
                                <Text>{product.averageRating.toFixed(1)}</Text>
                                <Text color="gray.500">({product.numReviews} reviews)</Text>
                            </HStack>
                        )}
                    </HStack>

                    {product.description && <Text>{product.description}</Text>}

                    <HStack>
                        <Badge colorScheme={product.stock > 0 ? "green" : "red"}>
                            {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                        </Badge>
                        {product.category && (
                            <Badge colorScheme="purple">{product.category.name}</Badge>
                        )}
                    </HStack>

                    {product.stock > 0 && (
                        <HStack>
                            <Text>Quantity:</Text>
                            <Input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                min={1}
                                max={product.stock}
                                w="100px"
                            />
                            <Button colorScheme="purple" onClick={handleAddToCart} flex={1}>
                                Add to Cart
                            </Button>
                        </HStack>
                    )}

                    <Divider />

                    <Text fontSize="sm" color="gray.500">
                        Listed by: {product.user?.name}
                    </Text>
                </VStack>
            </SimpleGrid>

            {/* Reviews Section */}
            <Box mt={12} bg={bg} p={6} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                <Heading size="lg" mb={4}>
                    Reviews ({product.numReviews})
                </Heading>

                {isAuthenticated && (
                    <Box mb={6} p={4} bg={useColorModeValue("gray.50", "gray.700")} borderRadius="md">
                        <VStack spacing={3} align="stretch">
                            <FormControl>
                                <FormLabel>Rating</FormLabel>
                                <Select
                                    value={reviewForm.rating}
                                    onChange={(e) =>
                                        setReviewForm({ ...reviewForm, rating: Number(e.target.value) })
                                    }
                                >
                                    <option value={5}>5 - Excellent</option>
                                    <option value={4}>4 - Very Good</option>
                                    <option value={3}>3 - Good</option>
                                    <option value={2}>2 - Fair</option>
                                    <option value={1}>1 - Poor</option>
                                </Select>
                            </FormControl>
                            <Textarea
                                placeholder="Write your review..."
                                value={reviewForm.comment}
                                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                            />
                            <Button colorScheme="purple" onClick={handleSubmitReview}>
                                Submit Review
                            </Button>
                        </VStack>
                    </Box>
                )}

                {reviewsLoading ? (
                    <SkeletonText noOfLines={3} spacing="4" />
                ) : reviews.length > 0 ? (
                    <VStack spacing={4} align="stretch">
                        {reviews.map((review) => (
                            <Box key={review._id} p={4} borderWidth="1px" borderRadius="md" borderColor={borderColor}>
                                <HStack justify="space-between" mb={2}>
                                    <HStack>
                                        <Text fontWeight="bold">{review.user?.name}</Text>
                                        <HStack>
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon
                                                    key={i}
                                                    color={i < review.rating ? "yellow.400" : "gray.300"}
                                                />
                                            ))}
                                        </HStack>
                                    </HStack>
                                    {isAuthenticated && review.user._id === user._id && (
                                        <Button
                                            size="sm"
                                            colorScheme="red"
                                            onClick={async () => {
                                                const { success } = await deleteReview(review._id);
                                                if (success) {
                                                    fetchReviews(id);
                                                    fetchProduct(id);
                                                }
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    )}
                                </HStack>
                                {review.comment && <Text>{review.comment}</Text>}
                                <Text fontSize="xs" color="gray.500" mt={2}>
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </Text>
                            </Box>
                        ))}
                    </VStack>
                ) : (
                    <Text color="gray.500">No reviews yet. Be the first to review!</Text>
                )}
            </Box>

            {/* Edit Product Modal */}
            <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit Product</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {editProduct && (
                            <VStack spacing={4}>
                                <FormControl>
                                    <FormLabel>Product Name</FormLabel>
                                    <Input
                                        value={editProduct.name}
                                        onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Description</FormLabel>
                                    <Textarea
                                        value={editProduct.description}
                                        onChange={(e) =>
                                            setEditProduct({ ...editProduct, description: e.target.value })
                                        }
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Price</FormLabel>
                                    <Input
                                        type="number"
                                        value={editProduct.price}
                                        onChange={(e) =>
                                            setEditProduct({ ...editProduct, price: e.target.value })
                                        }
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Stock</FormLabel>
                                    <Input
                                        type="number"
                                        value={editProduct.stock}
                                        onChange={(e) =>
                                            setEditProduct({ ...editProduct, stock: e.target.value })
                                        }
                                    />
                                </FormControl>
                            </VStack>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onEditClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="purple" onClick={handleUpdateProduct}>
                            Update
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default ProductDetailsPage;
