const express = require("express");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const bcrypt = require("bcryptjs");
const { sequelizeConnect } = require("./database/sequalize");
const { Product } = require("./models/ProductModel");
const { User } = require("./models/UserModel");
const { protect } = require("./middleware/protect");

const app = express();

const oneDay = 1000 * 60 * 60 * 24;
app.use(
  sessions({
    secret: "mysecret",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

app.use(cookieParser());

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

app.post("/products", protect, async (req, res) => {
  const { name, price, category } = req.body;
  try {
    const product = await Product.create({ name, price, category });
    res.status(201).json({ product });
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

app.patch("/products/:id", protect, async (req, res) => {
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

app.delete("/products/:id", protect, async (req, res) => {
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

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        message: "incorrect username or password",
      });
    }

    const isCorrect = await bcrypt.compare(password, user.password);
    if (isCorrect) {
      req.session.user = user;
      res.status(200).json({
        status: "success",
      });
    } else {
      res.status(400).json({
        message: "incorrect username or password",
      });
    }
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashpassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      email,
      password: hashpassword,
    });
    req.session.user = newUser;
    res.status(201).json({
      user: newUser,
    });
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
