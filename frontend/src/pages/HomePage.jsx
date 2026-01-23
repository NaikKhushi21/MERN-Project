import {
    Container,
    Text,
    VStack,
    SimpleGrid,
    Input,
    Select,
    HStack,
    Button,
    Box,
    useColorModeValue,
    Skeleton,
    SkeletonCircle,
    SkeletonText,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useProductStore } from "../store/product";
import ProductCard from "../components/ProductCard";

const HomePage = () => {
    const { fetchProducts, products, loading, pagination, filters, setFilters, fetchCategories, categories } = useProductStore();
    const [searchTerm, setSearchTerm] = useState(filters.search || "");

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFilters({ search: searchTerm });
            fetchProducts({ search: searchTerm });
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleFilterChange = (key, value) => {
        setFilters({ [key]: value });
        fetchProducts({ [key]: value });
    };

    const handlePageChange = (page) => {
        fetchProducts({ page });
    };

    const bg = useColorModeValue("white", "gray.800");

    return (
        <Container maxW="container.xl" py={12}>
            <VStack spacing={8}>
                <Text
                    fontSize={"30"}
                    fontWeight={"bold"}
                    bgGradient={"linear(to-r, purple.600, purple.600)"}
                    bgClip={"text"}
                    textAlign={"center"}
                >
                    Current Products
                </Text>

                {/* Search and Filters */}
                <Box w="full" bg={bg} p={6} shadow="md" rounded="lg">
                    <VStack spacing={4}>
                        <Input
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            size="lg"
                        />
                        <HStack spacing={4} w="full" flexWrap="wrap">
                            <Select
                                placeholder="All Categories"
                                value={filters.category}
                                onChange={(e) => handleFilterChange("category", e.target.value)}
                                maxW="200px"
                            >
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </Select>
                            <Input
                                placeholder="Min Price"
                                type="number"
                                value={filters.minPrice}
                                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                                maxW="150px"
                            />
                            <Input
                                placeholder="Max Price"
                                type="number"
                                value={filters.maxPrice}
                                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                                maxW="150px"
                            />
                            <Select
                                value={filters.sort}
                                onChange={(e) => handleFilterChange("sort", e.target.value)}
                                maxW="200px"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Highest Rated</option>
                            </Select>
                            <Button
                                onClick={() => {
                                    setFilters({
                                        search: "",
                                        category: "",
                                        minPrice: "",
                                        maxPrice: "",
                                        sort: "newest",
                                    });
                                    setSearchTerm("");
                                    fetchProducts();
                                }}
                            >
                                Clear Filters
                            </Button>
                        </HStack>
                    </VStack>
                </Box>

                {/* Products Grid */}
                {loading ? (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10} w="full">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Box key={i} p={4} borderWidth="1px" borderRadius="lg">
                                <Skeleton height="200px" mb={4} />
                                <SkeletonText mt="4" noOfLines={3} spacing="4" />
                            </Box>
                        ))}
                    </SimpleGrid>
                ) : (
                    <>
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10} w="full">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </SimpleGrid>

                        {products.length === 0 && (
                            <Text fontSize={"xl"} fontWeight={"bold"} textAlign={"center"}>
                                No Products Found 😢{" "}
                                <Link to={"/create"}>
                                    <Text color="purple.500" _hover={{ textDecoration: "underline" }}>
                                        Create a new product!
                                    </Text>
                                </Link>
                            </Text>
                        )}

                        {/* Pagination */}
                        {pagination && pagination.pages > 1 && (
                            <HStack spacing={2}>
                                <Button
                                    isDisabled={pagination.page === 1}
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                >
                                    Previous
                                </Button>
                                <Text>
                                    Page {pagination.page} of {pagination.pages}
                                </Text>
                                <Button
                                    isDisabled={pagination.page === pagination.pages}
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                >
                                    Next
                                </Button>
                            </HStack>
                        )}
                    </>
                )}
            </VStack>
        </Container>
    );
};

export default HomePage;
