const Product = require("../models/Product");

// Add a new product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      pricePerDay,
      image,
    } = req.body;

    if (!name || !description || !category || pricePerDay === undefined) {
      return res.status(400).json({
        message: "Please fill in all required fields",
      });
    }

    if (!Number.isFinite(Number(pricePerDay)) || Number(pricePerDay) < 0) {
      return res.status(400).json({
        message: "Please enter a valid rental price",
      });
    }

    const product = await Product.create({
      name,
      description,
      category,
      pricePerDay: Number(pricePerDay),
      image,
      owner: req.user._id,
    });

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Add Product Error:", error.message);

    res.status(500).json({
      message: "Server error while adding product",
    });
  }
};

// Get all available products
const getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;

    let filter = {
      isAvailable: true,
    };

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.pricePerDay = {};

      if (minPrice) {
        filter.pricePerDay.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.pricePerDay.$lte = Number(maxPrice);
      }
    }

    const products = await Product.find(filter)
      .populate("owner", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get Products Error:", error.message);

    res.status(500).json({
      message: "Server error while fetching products",
    });
  }
};

// Get products added by the logged-in user
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({
      owner: req.user._id,
    });

    res.status(200).json({
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get My Products Error:", error.message);

    res.status(500).json({
      message: "Server error while fetching your products",
    });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Only the product owner can update it
    if (product.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to update this product",
      });
    }

    const { name, description, category, pricePerDay, image } = req.body;

    if (pricePerDay !== undefined &&
        (!Number.isFinite(Number(pricePerDay)) || Number(pricePerDay) < 0)) {
      return res.status(400).json({
        message: "Please enter a valid rental price",
      });
    }

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (category !== undefined) product.category = category;
    if (pricePerDay !== undefined) product.pricePerDay = Number(pricePerDay);
    if (image !== undefined) product.image = image;

    await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update Product Error:", error.message);

    res.status(500).json({
      message: "Server error while updating product",
    });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Only the product owner can delete it
    if (product.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to delete this product",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Product Error:", error.message);

    res.status(500).json({
      message: "Server error while deleting product",
    });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getMyProducts,
  updateProduct,
  deleteProduct,
};