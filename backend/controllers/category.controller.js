import Category from '../models/category.model.js';
import mongoose from 'mongoose';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({}).sort({ name: 1 });
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        console.error("Error in fetching categories:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
export const getCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ success: false, message: "Invalid Category Id" });
        }

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        res.status(200).json({ success: true, data: category });
    } catch (error) {
        console.error("Error in fetching category:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private
export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: "Please provide category name" });
        }

        // Check if category already exists
        const categoryExists = await Category.findOne({ name: name.trim() });
        if (categoryExists) {
            return res.status(400).json({ success: false, message: "Category already exists" });
        }

        const category = await Category.create({
            name: name.trim(),
            description: description || ""
        });

        res.status(201).json({ success: true, data: category });
    } catch (error) {
        console.error("Error in creating category:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
