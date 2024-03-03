const productRouter = require("express").Router();
const multer = require("multer");
const Product = require("../models/product");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads/");
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
        (file) => "uploads/" + file.filename,
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
