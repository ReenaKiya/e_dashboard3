const express = require('express')
const cors = require('cors')
require('./db/config')
const User = require('./db/User')
const Product = require('./db/Product')
const jwt = require('jsonwebtoken');
const jwtKey = 'e-comm';
const app = express();


app.use(express.json())
app.use(cors());


//How to make a signup api
app.post('/signup', async (req, res) => {

  let user = new User(req.body)
  let response = await user.save();
  response = response.toObject();
  delete response.password
  jwt.sign({ response }, jwtKey, { expiresIn: "2h" }, (err, token) => {
    if (err) {
      res.send({ result: "somethin went wrong,Please try after sometime" })
    }
    res.send({ response, auth: token })
  })
  // res.send(response)
})

// How to make a login api
app.post('/login', async (req, res) => {
  console.log(req.body)

  if (req.body.email && req.body.password) {
    let user = await User.findOne(req.body).select("-password")
    if (user) {
      jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
          res.send({ result: "somethin went wrong,Please try after sometime" })
        }
        res.send({ user, auth: token })
      })
    } else {
      res.send({ result: "No user Found" })
    }
  } else {
    res.send({ result: "No user Found" })
  }

})

// How to add a Product
app.post('/add-product', verifyToken, async (req, res) => {

  let product = new Product(req.body)
  let response = await product.save();
  res.send(response);
  console.log(response)
})


//How to get all product from database to load them in frontend side

app.get('/product-list', verifyToken, async (req, res) => {

  let product = await Product.find()
  if (product.length > 0) {
    res.send(product);
  } else {
    res.send({ result: "No product found" })
  }
  console.log(product)
})


//How to delete product
app.delete('/product/:id', verifyToken, async (req, res) => {

  let result = await Product.deleteOne({ _id: req.params.id })
  res.send(result)
  console.log(req.params.id)
})

//how to get single product in database for update product
app.get('/product/:id', verifyToken, async (req, res) => {

  let result = await Product.findOne({ _id: req.params.id })
  if (result) {
    res.send(result);
  } else {
    res.send({ result: "No Record found" })
  }

})

//How to update a product
app.put('/product/:id', verifyToken, async (req, res) => {

  let result = await Product.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  )
  res.send(result)
})

//How to single product
app.get('/search/:key', verifyToken, async (req, res) => {
  let result = await Product.find({
    "$or": [
      { name: { $regex: req.params.key } },
      { company: { $regex: req.params.key } },
      { category: { $regex: req.params.key } },
    ]
  })
  res.send(result)
})


// verify token //
function verifyToken(req, res, next) {
  let token = req.headers['authorization']
  if (token) {
    token = token.split(' ')[1];
    jwt.verify(token, jwtKey, (err, valid) => {
      if (err) {
        res.status(401).send("Please provide valid token")
      } else {
        next();
      }
    })

  } else {
    res.status(403).send({ result: "Please add token with header" })
  }
  // console.log('middleware called if', token)
}



app.listen(4200)