const mongoose = require('mongoose');

const bitcoinPaymentSchema = mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Order',
    },
    bitcoinAddress: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'confirmed', 'failed'],
      default: 'pending',
    },
    transactionId: {
      type: String,
    },
    confirmations: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const BitcoinPayment = mongoose.model('BitcoinPayment', bitcoinPaymentSchema);

module.exports = BitcoinPayment;