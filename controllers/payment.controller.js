const braintree = require("braintree");
const orderModel = require("../models/Order.model");
const dotenv = require("dotenv");

dotenv.config();

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MARCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

exports.braintreeTokenController = async (req, res, next) => {
  try {
    gateway.clientToken.generate({}, function (error, result) {
      if (error) {
        res.status(500).send(error);
      } else {
        res.send(result);
      }
    });
  } catch (error) {
    next();
  }
};

exports.braintreePaymentController = async (req, res, next) => {
  try {
    const { cart, nonce } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    next(error);
  }
};
