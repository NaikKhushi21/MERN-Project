import Review from '../models/review.model.js';
import Product from '../models/product.model.js';
import mongoose from 'mongoose';

// @desc    Get reviews for a product
// @route   GET /api/products/:productId/reviews
// @access  Public
export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(404).json({ success: false, message: "Invalid Product Id" });
        }

        const reviews = await Review.find({ product: productId })
            .populate('user', 'name email avatar')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: reviews });
    } catch (error) {
        console.error("Error in fetching reviews:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Create review
// @route   POST /api/products/:productId/reviews
// @access  Private
export const createReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const { rating, comment } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(404).json({ success: false, message: "Invalid Product Id" });
        }

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: "Please provide a valid rating (1-5)" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({
            product: productId,
            user: req.user._id
        });

        if (existingReview) {
            return res.status(400).json({ success: false, message: "You have already reviewed this product" });
        }

        const review = await Review.create({
            product: productId,
            user: req.user._id,
            rating: Number(rating),
            comment: comment || ""
        });

        await review.populate('user', 'name email avatar');

        // Update product rating
        const reviews = await Review.find({ product: productId });
        const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

        await Product.findByIdAndUpdate(productId, {
            averageRating: averageRating.toFixed(1),
            numReviews: reviews.length
        });

        res.status(201).json({ success: true, data: review });
    } catch (error) {
        console.error("Error in creating review:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ success: false, message: "Invalid Review Id" });
        }

        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        // Check if user owns the review
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized to update this review" });
        }

        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({ success: false, message: "Please provide a valid rating (1-5)" });
        }

        const updatedReview = await Review.findByIdAndUpdate(
            id,
            { rating: rating ? Number(rating) : review.rating, comment: comment !== undefined ? comment : review.comment },
            { new: true }
        ).populate('user', 'name email avatar');

        // Update product rating
        const reviews = await Review.find({ product: review.product });
        const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

        await Product.findByIdAndUpdate(review.product, {
            averageRating: averageRating.toFixed(1),
            numReviews: reviews.length
        });

        res.status(200).json({ success: true, data: updatedReview });
    } catch (error) {
        console.error("Error in updating review:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ success: false, message: "Invalid Review Id" });
        }

        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        // Check if user owns the review
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this review" });
        }

        const productId = review.product;

        await Review.findByIdAndDelete(id);

        // Update product rating
        const reviews = await Review.find({ product: productId });
        const averageRating = reviews.length > 0
            ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
            : 0;

        await Product.findByIdAndUpdate(productId, {
            averageRating: averageRating,
            numReviews: reviews.length
        });

        res.status(200).json({ success: true, message: "Review deleted successfully" });
    } catch (error) {
        console.error("Error in deleting review:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
