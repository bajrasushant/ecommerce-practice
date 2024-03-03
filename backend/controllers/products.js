const productRouter = require("express").Router();
const multer = require("multer");
const Product = require("../models/product");
const fs = require("fs")

productRouter.get("/", async (request, response) => {
  try {
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 10;

    const skip = (page - 1) * limit;

    const products = await Product.find({}).skip(skip).limit(limit);
    response.json({ success: true, products: products });
  } catch {
    response
      .status(500)
      .json({ success: false, message: "Failed to fetch products" });
  }
});

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const productName = req.body.productName;
    const createdDate = new Date()
    const uploadPath = `uploads/${productName}`;
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

productRouter.post(
  "/addProduct",
  upload.array("images", 5),
  async (request, response) => {
    try {
      const { productName, description, category, price, quantity } =
        request.body;

      const imagePaths = request.files.map(
        (file) => `uploads/${productName}-${Date.now()}/${file.filename}`,
      );

      const newProduct = new Product({
        productName: productName,
        description: description,
        category: category,
        price: price,
        quantity: quantity,
        images: imagePaths,
      });
      await newProduct.save();

      response.json({ success: true, imagePaths: imagePaths });
    } catch (error) {
      console.error(error);
      response.status(500).json({ success: false, message: "failed" });
    }
  },
);

module.exports = productRouter;
