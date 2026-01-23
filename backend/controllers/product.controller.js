import Product from '../models/product.model.js';
import Review from '../models/review.model.js';
import mongoose from 'mongoose';

// @desc    Get all products with search, filter, pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
    try {
        const {
            search,
            category,
            minPrice,
            maxPrice,
            sort,
            page = 1,
            limit = 12
        } = req.query;

        // Build query
        const query = {};

        // Search
        if (search) {
            query.$text = { $search: search };
        }

        // Category filter
        if (category && mongoose.Types.ObjectId.isValid(category)) {
            query.category = category;
        }

        // Price range filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Sort options
        let sortOption = {};
        switch (sort) {
            case 'price-low':
                sortOption = { price: 1 };
                break;
            case 'price-high':
                sortOption = { price: -1 };
                break;
            case 'rating':
                sortOption = { averageRating: -1 };
                break;
            case 'newest':
                sortOption = { createdAt: -1 };
                break;
            case 'oldest':
                sortOption = { createdAt: 1 };
                break;
            default:
                sortOption = { createdAt: -1 };
        }

        // Pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const products = await Product.find(query)
            .populate('category', 'name')
            .populate('user', 'name email')
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum);

        const total = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            data: products,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        console.error("Error in fetching products:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ success: false, message: "Invalid Product Id" });
        }

        const product = await Product.findById(id)
            .populate('category', 'name description')
            .populate('user', 'name email avatar');

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        console.error("Error in fetching product:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category, stock } = req.body;

        if (!name || !price || !image) {
            return res.status(400).json({ success: false, message: "Please provide name, price, and image" });
        }

        // Validate category if provided
        let categoryId = null;
        if (category && category !== "" && mongoose.Types.ObjectId.isValid(category)) {
            categoryId = category;
        } else if (category && category !== "") {
            return res.status(400).json({ success: false, message: "Invalid category ID" });
        }

        const productData = {
            name,
            description: description || "",
            price: Number(price),
            image,
            category: categoryId,
            stock: stock ? Number(stock) : 0,
            user: req.user._id
        };

        const newProduct = await Product.create(productData);
        await newProduct.populate('category', 'name');
        await newProduct.populate('user', 'name email');

        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        console.error("Error in creating product:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ success: false, message: "Invalid Product Id" });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Check if user owns the product
        if (product.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized to update this product" });
        }

        // Clean the update data
        const updateData = { ...req.body };
        
        // Convert empty category string to null
        if (updateData.category === "" || updateData.category === undefined) {
            updateData.category = null;
        } else if (updateData.category && !mongoose.Types.ObjectId.isValid(updateData.category)) {
            return res.status(400).json({ success: false, message: "Invalid category ID" });
        }

        // Convert price and stock to numbers if provided
        if (updateData.price !== undefined) {
            updateData.price = Number(updateData.price);
        }
        if (updateData.stock !== undefined) {
            updateData.stock = Number(updateData.stock);
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        )
            .populate('category', 'name')
            .populate('user', 'name email');

        res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
        console.error("Error in updating product:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ success: false, message: "Invalid Product Id" });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Check if user owns the product
        if (product.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this product" });
        }

        // Delete associated reviews
        await Review.deleteMany({ product: id });

        await Product.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error in deleting product:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
