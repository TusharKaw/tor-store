const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Sample products data
const products = [
  {
    name: 'Premium Business Cards',
    description: 'High-quality business cards printed on premium 350gsm silk card with a matte finish. Perfect for making a professional impression.',
    price: 29.99,
    bitcoinPrice: '0.00075',
    category: 'business_cards',
    image: 'https://images.unsplash.com/photo-1572502384866-3a3482d5f2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    specifications: {
      size: '85mm x 55mm',
      paper: '350gsm Silk',
      finish: 'Matte',
      sides: 'Double-sided',
      corners: 'Square or Rounded',
    },
    customizationOptions: [
      {
        name: 'Quantity',
        options: ['100', '250', '500', '1000'],
        priceModifier: 0,
      },
      {
        name: 'Corners',
        options: ['Square', 'Rounded'],
        priceModifier: 0,
      },
      {
        name: 'Finish',
        options: ['Matte', 'Gloss', 'Spot UV'],
        priceModifier: 5,
      },
    ],
    stockQuantity: 1000,
    shippingInfo: {
      weight: 0.2,
      dimensions: {
        length: 9,
        width: 6,
        height: 1,
      },
      estimatedDeliveryDays: 7,
    },
  },
  {
    name: 'Economy Business Cards',
    description: 'Affordable business cards printed on 300gsm silk card. Great for startups and small businesses on a budget.',
    price: 19.99,
    bitcoinPrice: '0.0005',
    category: 'business_cards',
    image: 'https://images.unsplash.com/photo-1589384267710-7a170981ca78?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    specifications: {
      size: '85mm x 55mm',
      paper: '300gsm Silk',
      finish: 'Matte',
      sides: 'Single-sided',
      corners: 'Square',
    },
    customizationOptions: [
      {
        name: 'Quantity',
        options: ['100', '250', '500', '1000'],
        priceModifier: 0,
      },
      {
        name: 'Sides',
        options: ['Single-sided', 'Double-sided'],
        priceModifier: 5,
      },
    ],
    stockQuantity: 1000,
    shippingInfo: {
      weight: 0.2,
      dimensions: {
        length: 9,
        width: 6,
        height: 1,
      },
      estimatedDeliveryDays: 10,
    },
  },
  {
    name: 'Luxury Business Cards',
    description: 'Make a statement with our luxury business cards printed on 450gsm silk card with spot UV finish and gold foil options.',
    price: 49.99,
    bitcoinPrice: '0.00125',
    category: 'business_cards',
    image: 'https://images.unsplash.com/photo-1566013656433-e818796d04f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    specifications: {
      size: '85mm x 55mm',
      paper: '450gsm Silk',
      finish: 'Spot UV',
      sides: 'Double-sided',
      corners: 'Square or Rounded',
      special: 'Gold Foil Option',
    },
    customizationOptions: [
      {
        name: 'Quantity',
        options: ['100', '250', '500', '1000'],
        priceModifier: 0,
      },
      {
        name: 'Corners',
        options: ['Square', 'Rounded'],
        priceModifier: 0,
      },
      {
        name: 'Special Finish',
        options: ['None', 'Gold Foil', 'Silver Foil', 'Embossed'],
        priceModifier: 10,
      },
    ],
    stockQuantity: 500,
    shippingInfo: {
      weight: 0.3,
      dimensions: {
        length: 9,
        width: 6,
        height: 1,
      },
      estimatedDeliveryDays: 14,
    },
  },
  {
    name: 'A5 Flyers',
    description: 'Vibrant A5 flyers perfect for promotions, events, and announcements. Printed on high-quality 150gsm gloss paper.',
    price: 39.99,
    bitcoinPrice: '0.001',
    category: 'flyers',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    specifications: {
      size: 'A5 (148mm x 210mm)',
      paper: '150gsm Gloss',
      finish: 'Gloss',
      sides: 'Double-sided',
    },
    customizationOptions: [
      {
        name: 'Quantity',
        options: ['100', '250', '500', '1000', '2500', '5000'],
        priceModifier: 0,
      },
      {
        name: 'Sides',
        options: ['Single-sided', 'Double-sided'],
        priceModifier: 5,
      },
      {
        name: 'Paper',
        options: ['150gsm Gloss', '170gsm Silk', '250gsm Gloss'],
        priceModifier: 3,
      },
    ],
    stockQuantity: 2000,
    shippingInfo: {
      weight: 0.5,
      dimensions: {
        length: 22,
        width: 16,
        height: 2,
      },
      estimatedDeliveryDays: 7,
    },
  },
  {
    name: 'A4 Trifold Brochures',
    description: 'Professional trifold brochures printed on 170gsm silk paper. Perfect for product catalogs, menus, and information packs.',
    price: 59.99,
    bitcoinPrice: '0.0015',
    category: 'brochures',
    image: 'https://images.unsplash.com/photo-1531053270060-6643c9e70514?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    specifications: {
      size: 'A4 (210mm x 297mm)',
      paper: '170gsm Silk',
      finish: 'Matte',
      fold: 'Trifold',
      sides: 'Double-sided',
    },
    customizationOptions: [
      {
        name: 'Quantity',
        options: ['100', '250', '500', '1000', '2500'],
        priceModifier: 0,
      },
      {
        name: 'Paper',
        options: ['170gsm Silk', '250gsm Gloss', '300gsm Silk'],
        priceModifier: 5,
      },
      {
        name: 'Fold Type',
        options: ['Trifold', 'Bifold', 'Z-fold', 'Gate fold'],
        priceModifier: 2,
      },
    ],
    stockQuantity: 1000,
    shippingInfo: {
      weight: 0.8,
      dimensions: {
        length: 30,
        width: 22,
        height: 3,
      },
      estimatedDeliveryDays: 10,
    },
  },
  {
    name: 'A2 Posters',
    description: 'Eye-catching A2 posters printed on 170gsm gloss paper. Ideal for advertising events, promotions, or decorative purposes.',
    price: 29.99,
    bitcoinPrice: '0.00075',
    category: 'posters',
    image: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    specifications: {
      size: 'A2 (420mm x 594mm)',
      paper: '170gsm Gloss',
      finish: 'Gloss',
      sides: 'Single-sided',
    },
    customizationOptions: [
      {
        name: 'Quantity',
        options: ['10', '25', '50', '100', '250'],
        priceModifier: 0,
      },
      {
        name: 'Paper',
        options: ['170gsm Gloss', '200gsm Silk', '250gsm Gloss'],
        priceModifier: 4,
      },
    ],
    stockQuantity: 500,
    shippingInfo: {
      weight: 1.2,
      dimensions: {
        length: 60,
        width: 45,
        height: 5,
      },
      estimatedDeliveryDays: 7,
    },
  },
  {
    name: 'Custom Vinyl Stickers',
    description: 'Durable vinyl stickers with custom shapes and sizes. Weather-resistant and perfect for indoor or outdoor use.',
    price: 24.99,
    bitcoinPrice: '0.000625',
    category: 'stickers',
    image: 'https://images.unsplash.com/photo-1535982330050-f1c2fb79ff78?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    specifications: {
      material: 'Vinyl',
      finish: 'Gloss or Matte',
      waterproof: 'Yes',
      adhesive: 'Permanent',
      shape: 'Custom Die-Cut',
    },
    customizationOptions: [
      {
        name: 'Size',
        options: ['Small (up to 50mm)', 'Medium (up to 100mm)', 'Large (up to 200mm)'],
        priceModifier: 5,
      },
      {
        name: 'Quantity',
        options: ['50', '100', '250', '500', '1000'],
        priceModifier: 0,
      },
      {
        name: 'Finish',
        options: ['Gloss', 'Matte'],
        priceModifier: 0,
      },
    ],
    stockQuantity: 2000,
    shippingInfo: {
      weight: 0.3,
      dimensions: {
        length: 15,
        width: 15,
        height: 1,
      },
      estimatedDeliveryDays: 7,
    },
  },
  {
    name: 'Custom Letterheads',
    description: 'Professional letterheads printed on premium 120gsm uncoated paper. Perfect for business correspondence.',
    price: 34.99,
    bitcoinPrice: '0.000875',
    category: 'other',
    image: 'https://images.unsplash.com/photo-1586282391129-76a6df230234?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    specifications: {
      size: 'A4 (210mm x 297mm)',
      paper: '120gsm Uncoated',
      finish: 'Uncoated',
      sides: 'Single-sided',
    },
    customizationOptions: [
      {
        name: 'Quantity',
        options: ['100', '250', '500', '1000', '2500'],
        priceModifier: 0,
      },
      {
        name: 'Paper',
        options: ['120gsm Uncoated', '100gsm Recycled', '90gsm Bond'],
        priceModifier: 2,
      },
    ],
    stockQuantity: 1000,
    shippingInfo: {
      weight: 0.6,
      dimensions: {
        length: 30,
        width: 22,
        height: 2,
      },
      estimatedDeliveryDays: 7,
    },
  },
];

// Sample admin user
const adminUser = {
  username: 'admin',
  password: 'admin123',
  isAdmin: true,
};

// Import data function
const importData = async () => {
  try {
    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();

    // Insert sample products
    await Product.insertMany(products);

    // Create admin user
    await User.create(adminUser);

    console.log('Data imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

// Delete data function
const destroyData = async () => {
  try {
    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data destroyed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

// Run the appropriate function based on command line argument
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}