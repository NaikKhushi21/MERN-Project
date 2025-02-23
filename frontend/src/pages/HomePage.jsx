import { Container, Text, VStack, SimpleGrid} from '@chakra-ui/react';
import { useEffect } from 'react';
import { Link} from 'react-router-dom';
import { useProductStore } from '../store/product';
import ProductCard from "../components/ProductCard";


const HomePage = () => {

  const {fetchProducts, products} = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);    
  console.log('products', products);

  return (
  <Container maxW='container.x1' py={12}>
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

        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={10}
          w={"full"}
        >
          {products.map((product) => ( 
            <ProductCard key={product._id} product={product} />
          ))}
        </SimpleGrid>

        {products.length === 0 && (
          <Text
          fontSize={"xl"}
          fontWeight={"bold"}
          // textTransform={"uppercase"}
          textAlign={"center"}
          color={"black."}
          >
          No Products Found 😢 {""}
            <Link to = {'/create'}>
              <Text color='purple.500' _hover={{textDecoration: 'underline'}}>
                Create a new product!
                </Text>
            </Link>
          </Text>
          )}
    </VStack>
  </Container>

  )
  
};

export default HomePage;
