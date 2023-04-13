const express = require("express");
const { sequelizeConnect } = require("./database/sequalize");
const { Product } = require("./models/ProductModel");
const { User } = require("./models/UserModel");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "success" });
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json({ products });
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

app.get("/products/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findOne({ where: { id } });

    if (!product) {
      return res
        .status(404)
        .json({ message: `Product with ${id} was not found` });
    }
    res.json({ product });
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

app.post("/products", async (req, res) => {
  const { name, price, category } = req.body;
  try {
    const product = await Product.create({ name, price, category });
    res.status(201).json({ product });
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

app.patch("/products/:id", async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  try {
    const product = await Product.findOne({ where: { id } });

    if (!product) {
      return res
        .status(404)
        .json({ message: `Product with ${id} was not found` });
    }

    product.set(body);
    await product.save();

    res.json({ product });
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

app.delete("/products/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const product = await Product.destroy({
      where: {
        id,
      },
    });

    if (!product) {
      return res
        .status(404)
        .json({ message: `Product with ${id} was not found` });
    }

    res.status(204).json();
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

const startServer = async () => {
  try {
    await sequelizeConnect();
    app.listen(4000, () => console.log("listening on port 4000"));
  } catch (err) {}
};

startServer();
