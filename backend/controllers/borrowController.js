const BorrowRequest = require("../models/BorrowRequest");
const Product = require("../models/Product");

// Create a borrowing request
const createBorrowRequest = async (req, res) => {
  try {
    const { productId, startDate, endDate } = req.body;

    if (!productId || !startDate || !endDate) {
      return res.status(400).json({
        message: "Please provide product and rental dates",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (
      isNaN(start.getTime()) ||
      isNaN(end.getTime()) ||
      end <= start ||
      start < new Date()
    ) {
      return res.status(400).json({
        message: "Please provide valid future rental dates",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (!product.isAvailable) {
      return res.status(400).json({
        message: "This product is not available",
      });
    }
    const existingRequest = await BorrowRequest.findOne({
  product: product._id,
  status: { $in: ["pending", "approved"] },
  startDate: { $lt: end },
  endDate: { $gt: start },
});

if (existingRequest) {
  return res.status(400).json({
    message: "This product is already requested or booked for these dates",
  });
}

    if (product.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot borrow your own product",
      });
    }
    const rentalDays = Math.ceil(
  (end - start) / (1000 * 60 * 60 * 24)
);

const totalPrice = rentalDays * product.pricePerDay;

    const request = await BorrowRequest.create({
      product: product._id,
      borrower: req.user._id,
      owner: product.owner,
      startDate: start,
      endDate: end,
      rentalDays,
      totalPrice, 
    });

    res.status(201).json({
      message: "Borrowing request submitted successfully",
      request,
    });
  } catch (error) {
    console.error("Borrow Request Error:", error.message);

    res.status(500).json({
      message: "Server error while creating borrowing request",
    });
  }
};
const updateBorrowRequest = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be approved or rejected",
      });
    }

    const request = await BorrowRequest.findById(req.params.id);
    console.log("Request Owner ID:", request?.owner);
console.log("Logged-in User ID:", req.user._id);
console.log("Request ID:", req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Borrowing request not found",
      });
    }

    if (request.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to update this request",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        message: "This request has already been processed",
      });
    }

    request.status = status;
    await request.save();

    res.status(200).json({
      message: `Borrowing request ${status} successfully`,
      request,
    });
  } catch (error) {
    console.error("Update Borrow Request Error:", error.message);

    res.status(500).json({
      message: "Server error while updating borrowing request",
    });
  }
};
const getMyBorrowRequests = async (req, res) => {
  try {
    const requests = await BorrowRequest.find({
      $or: [
        { borrower: req.user._id },
        { owner: req.user._id },
      ],
    })
      .populate("product", "name category pricePerDay image")
      .populate("borrower", "name email")
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Get Borrow Requests Error:", error.message);

    res.status(500).json({
      message: "Server error while fetching borrowing requests",
    });
  }
};
const returnBorrowedProduct = async (req, res) => {
  try {
    const request = await BorrowRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Borrowing request not found",
      });
    }

    if (request.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only the product owner can confirm the return",
      });
    }

    if (request.status !== "approved") {
      return res.status(400).json({
        message: "Only approved requests can be marked as returned",
      });
    }

    request.status = "returned";
    request.actualReturnDate = new Date();

    await request.save();

    res.status(200).json({
      message: "Product marked as returned successfully",
      request,
    });
  } catch (error) {
    console.error("Return Product Error:", error.message);

    res.status(500).json({
      message: "Server error while updating return status",
    });
  }
};
module.exports = {
  createBorrowRequest,
  updateBorrowRequest,
  getMyBorrowRequests,
  returnBorrowedProduct,
};