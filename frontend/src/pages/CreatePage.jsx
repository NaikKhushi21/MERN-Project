import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Heading,
    Container,
    useColorModeValue,
    VStack,
    Input,
    useToast,
    FormControl,
    FormLabel,
    Textarea,
    Select,
    Image,
    HStack,
} from "@chakra-ui/react";
import { useProductStore } from "../store/product";
import { useAuthStore } from "../store/auth";

const CreatePage = () => {
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: "",
        image: "",
        category: "",
        stock: "",
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const fileInputRef = useRef(null);
    const toast = useToast();
    const navigate = useNavigate();
    const { createProduct, fetchCategories, categories } = useProductStore();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            toast({
                title: "Login Required",
                description: "Please login to create products",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            navigate("/login");
        }
    }, [isAuthenticated]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setNewProduct({ ...newProduct, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddProduct = async () => {
        if (!newProduct.name || !newProduct.price || (!newProduct.image && !imageFile)) {
            toast({
                title: "Error",
                description: "Please fill in all required fields",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        const { success, message } = await createProduct(newProduct, imageFile);

        if (!success) {
            toast({
                title: "Error",
                description: message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } else {
            toast({
                title: "Success",
                description: message,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            setNewProduct({
                name: "",
                description: "",
                price: "",
                image: "",
                category: "",
                stock: "",
            });
            setImageFile(null);
            setImagePreview("");
            navigate("/");
        }
    };

    return (
        <Container maxW={"container.sm"}>
            <VStack spacing={8}>
                <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
                    Create New Product
                </Heading>

                <Box
                    w={"full"}
                    bg={useColorModeValue("white", "gray.800")}
                    p={6}
                    shadow={"md"}
                    rounded={"lg"}
                >
                    <VStack spacing={4}>
                        <FormControl isRequired>
                            <FormLabel>Product Name</FormLabel>
                            <Input
                                placeholder="Product Name"
                                name="name"
                                value={newProduct.name}
                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Description</FormLabel>
                            <Textarea
                                placeholder="Product Description"
                                name="description"
                                value={newProduct.description}
                                onChange={(e) =>
                                    setNewProduct({ ...newProduct, description: e.target.value })
                                }
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Price</FormLabel>
                            <Input
                                placeholder="Product Price"
                                name="price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={newProduct.price}
                                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Stock</FormLabel>
                            <Input
                                placeholder="Stock Quantity"
                                name="stock"
                                type="number"
                                min="0"
                                value={newProduct.stock}
                                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Category</FormLabel>
                            <Select
                                placeholder="Select Category"
                                value={newProduct.category}
                                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                            >
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Product Image</FormLabel>
                            <VStack spacing={2} align="stretch">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    display="none"
                                />
                                <HStack>
                                    <Button onClick={() => fileInputRef.current?.click()}>
                                        Choose Image
                                    </Button>
                                    <Input
                                        placeholder="Or enter image URL"
                                        value={newProduct.image}
                                        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                    />
                                </HStack>
                                {(imagePreview || newProduct.image) && (
                                    <Image
                                        src={imagePreview || newProduct.image}
                                        alt="Preview"
                                        maxH="200px"
                                        objectFit="contain"
                                        borderRadius="md"
                                    />
                                )}
                            </VStack>
                        </FormControl>

                        <Button colorScheme="purple" onClick={handleAddProduct} w="full">
                            Add Product
                        </Button>
                    </VStack>
                </Box>
            </VStack>
        </Container>
    );
};

export default CreatePage;
