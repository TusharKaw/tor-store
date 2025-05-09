const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    bitcoinPrice: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['business_cards', 'flyers', 'brochures', 'posters', 'stickers', 'other'],
    },
    image: {
      type: String,
      required: false,
    },
    specifications: {
      type: Object,
      required: false,
      default: {},
    },
    customizationOptions: [{
      name: String,
      options: [String],
      priceModifier: Number,
    }],
    stockQuantity: {
      type: Number,
      required: true,
      default: 0,
    },
    shippingInfo: {
      weight: Number,
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
      },
      estimatedDeliveryDays: {
        type: Number,
        default: 14,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;