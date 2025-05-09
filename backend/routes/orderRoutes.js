const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const BitcoinPayment = require('../models/BitcoinPayment');
const crypto = require('crypto');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
router.post('/', async (req, res) => {
  try {
    const {
      products,
      shippingAddress,
      paymentMethod,
      bitcoinAmount,
      orderNotes,
    } = req.body;

    if (products && products.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    }

    // Generate a unique customer identifier (for anonymous users)
    const customerIdentifier = crypto.randomBytes(16).toString('hex');

    const order = new Order({
      products,
      shippingAddress,
      paymentMethod,
      bitcoinAmount,
      orderNotes,
      customerIdentifier,
    });

    const createdOrder = await order.save();

    // Create a Bitcoin payment record
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 24); // 24 hour expiration

    // In a real implementation, you would generate a unique Bitcoin address
    // for each order using a Bitcoin payment processor or your own wallet
    const bitcoinAddress = 'bc1q' + crypto.randomBytes(20).toString('hex');

    const bitcoinPayment = new BitcoinPayment({
      order: createdOrder._id,
      bitcoinAddress,
      amount: bitcoinAmount,
      expiresAt: expirationTime,
    });

    await bitcoinPayment.save();

    res.status(201).json({
      order: createdOrder,
      bitcoinPayment: {
        address: bitcoinAddress,
        amount: bitcoinAmount,
        expiresAt: expirationTime,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public (with order ID and customer identifier)
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    const customerIdentifier = req.query.customerIdentifier;

    if (order && order.customerIdentifier === customerIdentifier) {
      // Find associated Bitcoin payment
      const bitcoinPayment = await BitcoinPayment.findOne({ order: order._id });
      
      res.json({
        order,
        bitcoinPayment: bitcoinPayment ? {
          address: bitcoinPayment.bitcoinAddress,
          amount: bitcoinPayment.amount,
          status: bitcoinPayment.status,
          expiresAt: bitcoinPayment.expiresAt,
        } : null,
      });
    } else {
      res.status(404).json({ message: 'Order not found or unauthorized access' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private (would be triggered by Bitcoin payment webhook in production)
router.put('/:id/pay', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    const { transactionId } = req.body;

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: transactionId,
        status: 'completed',
        update_time: Date.now(),
      };

      const updatedOrder = await order.save();

      // Update Bitcoin payment status
      const bitcoinPayment = await BitcoinPayment.findOne({ order: order._id });
      if (bitcoinPayment) {
        bitcoinPayment.status = 'confirmed';
        bitcoinPayment.transactionId = transactionId;
        bitcoinPayment.confirmations = 6; // Assuming 6 confirmations
        await bitcoinPayment.save();
      }

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update order to shipped
// @route   PUT /api/orders/:id/ship
// @access  Private/Admin
router.put('/:id/ship', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    const { trackingNumber } = req.body;

    if (order) {
      order.isShipped = true;
      order.shippedAt = Date.now();
      order.trackingNumber = trackingNumber;

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
router.put('/:id/deliver', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Check order status by tracking number
// @route   GET /api/orders/track/:trackingNumber
// @access  Public
router.get('/track/:trackingNumber', async (req, res) => {
  try {
    const order = await Order.findOne({ trackingNumber: req.params.trackingNumber });

    if (order) {
      res.json({
        orderId: order._id,
        status: {
          isPaid: order.isPaid,
          isShipped: order.isShipped,
          isDelivered: order.isDelivered,
        },
        shippedAt: order.shippedAt,
        estimatedDelivery: order.shippedAt 
          ? new Date(order.shippedAt.getTime() + (order.products[0].product.shippingInfo?.estimatedDeliveryDays || 14) * 24 * 60 * 60 * 1000)
          : null,
      });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;