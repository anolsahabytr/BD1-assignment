const express = require('express');
const cors = require('cors');
const { resolve } = require('path');

const app = express();
const port = 3010;

app.use(express.static('static'));
app.use(cors());

let taxRate = 5; // 5%
let discountPercentage = 10; // 10%
let loyalityRate = 2; // 2 points per 1$

function calculateCartTotal(newItemPrice, cartTotal) {
  let cartTotalPrice = newItemPrice + cartTotal;
  return cartTotalPrice.toString();
}

app.get('/cart-total', (req, res) => {
  let newItemPrice = parseFloat(req.query.newItemPrice);
  let cartTotal = parseFloat(req.query.cartTotal);
  res.send(calculateCartTotal(newItemPrice, cartTotal));
});

function calculateDiscountedCartTotal(cartTotal, isMember) {
  let result;
  if (isMember == 'true') {
    result = cartTotal - (cartTotal * discountPercentage) / 100;
  } else {
    result = cartTotal;
  }
  return result.toString();
}

app.get('/membership-discount', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  let isMember = req.query.isMember;
  res.send(calculateDiscountedCartTotal(cartTotal, isMember));
});

function calculateTax(cartTotal) {
  let tax = (cartTotal * taxRate) / 100;
  return tax.toString();
}

app.get('/calculate-tax', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  res.send(calculateTax(cartTotal));
});

function calculateDeliveryTime(shippingMethod, distance) {
  let result;
  if (shippingMethod == 'Standard') {
    result = distance / 50;
  } else {
    result = distance / 100;
  }
  return result.toString();
}

app.get('/estimate-delivery', (req, res) => {
  let shippingMethod = req.query.shippingMethod;
  let distance = parseFloat(req.query.distance);
  res.send(calculateDeliveryTime(shippingMethod, distance));
});

function calculateShippingCost(weight, distance) {
  let shippingCost = weight * distance * 0.1;
  return shippingCost.toString();
}

app.get('/shipping-cost', (req, res) => {
  let weight = parseFloat(req.query.weight);
  let distance = parseFloat(req.query.distance);
  res.send(calculateShippingCost(weight, distance));
});

function calculateLoyalityPoints(purchaseAmount) {
  let loyalityPoints = purchaseAmount * loyalityRate;
  return loyalityPoints.toString();
}

app.get('/loyalty-points', (req, res) => {
  let purchaseAmount = parseFloat(req.query.purchaseAmount);
  res.send(calculateLoyalityPoints(purchaseAmount));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
