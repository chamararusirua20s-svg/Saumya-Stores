const categories = [
  { name: "Vegetables", image: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=300&q=80", description: "Fresh farm organic vegetables" },
  { name: "Fruits", image: "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=300&q=80", description: "Sweet and juicy seasonal fruits" },
  { name: "Dairy", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&q=80", description: "Fresh milk, cheese, butter and yogurt" },
  { name: "Bakery", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=80", description: "Freshly baked bread, buns, cakes and cookies" },
  { name: "Beverages", image: "https://images.unsplash.com/photo-1527960650-2652a92c6df0?w=300&q=80", description: "Refreshing soft drinks, juices and energy drinks" },
  { name: "Rice", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&q=80", description: "Premium quality Keeri Samba, Basmati and raw rice" },
  { name: "Grocery", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&q=80", description: "Daily cooking essentials: flour, sugar, salt, oil, dhal, tea, coffee" },
  { name: "Snacks", image: "https://images.unsplash.com/photo-1599490659273-e3b6900ee3cd?w=300&q=80", description: "Chocolates, potato chips, biscuits and crackers" },
  { name: "Frozen Foods", image: "https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=300&q=80", description: "Frozen meats, nuggets, french fries and ice cream" },
  { name: "Household Items", image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&q=80", description: "Detergents, cleaners, toilet paper and garbage bags" },
  { name: "Personal Care", image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=300&q=80", description: "Soaps, toothpastes, shampoos and hand sanitizers" }
];

const users = [
  {
    name: "Admin User",
    email: "admin@grocery.com",
    password: "Admin@123",
    role: "admin"
  },
  {
    name: "Customer User",
    email: "customer@gmail.com",
    password: "Customer@123",
    role: "customer"
  }
];

const products = [
  // ── Vegetables ──────────────────────────────────────────────────────────────
  {
    name: "Tomato",
    barcode: "VEG001",
    categoryName: "Vegetables",
    brand: "Farm Organic",
    description: "Organically grown fresh red tomatoes, rich in nutrients.",
    buyingPrice: 80,
    sellingPrice: 120,
    quantity: 120,
    stockLevel: 15,
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80"
  },
  {
    name: "Carrot",
    barcode: "VEG002",
    categoryName: "Vegetables",
    brand: "Upcountry Farms",
    description: "Crispy, sweet orange carrots directly from hills.",
    buyingPrice: 120,
    sellingPrice: 180,
    quantity: 80,
    stockLevel: 10,
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80"
  },
  {
    name: "Potato",
    barcode: "VEG003",
    categoryName: "Vegetables",
    brand: "Rural Harvest",
    description: "Versatile starchy potatoes, ideal for roasting, boiling, or frying.",
    buyingPrice: 100,
    sellingPrice: 150,
    quantity: 200,
    stockLevel: 20,
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80"
  },
  {
    name: "Green Beans",
    barcode: "VEG004",
    categoryName: "Vegetables",
    brand: "Green Farms",
    description: "Freshly plucked green string beans, tender and delicious.",
    buyingPrice: 180,
    sellingPrice: 240,
    quantity: 45,
    stockLevel: 10,
    image: "https://images.unsplash.com/photo-1567375691080-60b1e427d142?w=400&q=80"
  },
  {
    name: "Leeks",
    barcode: "VEG005",
    categoryName: "Vegetables",
    brand: "Green Farms",
    description: "Premium quality fresh leeks with a mild onion-like flavor.",
    buyingPrice: 120,
    sellingPrice: 160,
    quantity: 30,
    stockLevel: 5,
    image: "https://images.unsplash.com/photo-1582515073490-39981397c445?w=400&q=80"
  },
  {
    name: "Cabbage",
    barcode: "VEG006",
    categoryName: "Vegetables",
    brand: "Hilltop Produce",
    description: "Fresh green cabbage, crisp and leaf-tight.",
    buyingPrice: 90,
    sellingPrice: 130,
    quantity: 5,
    stockLevel: 8,
    image: "https://images.unsplash.com/photo-1550142413-05c2434d7495?w=400&q=80"
  },
  {
    name: "Pumpkin",
    barcode: "VEG007",
    categoryName: "Vegetables",
    brand: "Farm Organic",
    description: "Rich, golden organic pumpkin, ideal for soups and curries.",
    buyingPrice: 75,
    sellingPrice: 110,
    quantity: 15,
    stockLevel: 5,
    image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=400&q=80"
  },
  {
    name: "Brinjal (Eggplant)",
    barcode: "VEG008",
    categoryName: "Vegetables",
    brand: "Rural Harvest",
    description: "Fresh purple eggplants with a soft, spongy texture.",
    buyingPrice: 130,
    sellingPrice: 190,
    quantity: 0,
    stockLevel: 10,
    image: "https://images.unsplash.com/photo-1601493700631-2b16ec4bc820?w=400&q=80"
  },
  {
    name: "Ladies Fingers (Okra)",
    barcode: "VEG009",
    categoryName: "Vegetables",
    brand: "Upcountry Farms",
    description: "Fresh okra pods, tender and green, perfect for stir fries.",
    buyingPrice: 95,
    sellingPrice: 140,
    quantity: 40,
    stockLevel: 10,
    image: "https://images.unsplash.com/photo-1625844706126-b6d58a202491?w=400&q=80"
  },
  {
    name: "Green Chilli",
    barcode: "VEG010",
    categoryName: "Vegetables",
    brand: "Hilltop Produce",
    description: "Spicy fresh green chillies, adding heat to your kitchen.",
    buyingPrice: 300,
    sellingPrice: 400,
    quantity: 25,
    stockLevel: 5,
    image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&q=80"
  },

  // ── Fruits ──────────────────────────────────────────────────────────────────
  {
    name: "Apple",
    barcode: "FRU001",
    categoryName: "Fruits",
    brand: "Fresh Imported",
    description: "Crisp and sweet imported red apples, rich in antioxidants.",
    buyingPrice: 270,
    sellingPrice: 350,
    quantity: 75,
    stockLevel: 15,
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80"
  },
  {
    name: "Banana",
    barcode: "FRU002",
    categoryName: "Fruits",
    brand: "Local Organic",
    description: "Ripe yellow bananas, sweet, energy-rich and natural.",
    buyingPrice: 100,
    sellingPrice: 150,
    quantity: 120,
    stockLevel: 20,
    image: "https://images.unsplash.com/photo-1571771894821-ad9902412746?w=400&q=80"
  },
  {
    name: "Orange",
    barcode: "FRU003",
    categoryName: "Fruits",
    brand: "Sunripe",
    description: "Juicy, sweet and tangy oranges packed with Vitamin C.",
    buyingPrice: 200,
    sellingPrice: 280,
    quantity: 8,
    stockLevel: 10,
    image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400&q=80"
  },
  {
    name: "Papaya",
    barcode: "FRU004",
    categoryName: "Fruits",
    brand: "Tropical Farms",
    description: "Sweet orange-fleshed local papayas, excellent for digestion.",
    buyingPrice: 140,
    sellingPrice: 200,
    quantity: 25,
    stockLevel: 5,
    image: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400&q=80"
  },
  {
    name: "Pineapple",
    barcode: "FRU005",
    categoryName: "Fruits",
    brand: "Tropical Farms",
    description: "Ripe, sweet and tangy pineapple with a tropical aroma.",
    buyingPrice: 175,
    sellingPrice: 250,
    quantity: 0,
    stockLevel: 5,
    image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&q=80"
  },
  {
    name: "Watermelon",
    barcode: "FRU006",
    categoryName: "Fruits",
    brand: "Eco Orchards",
    description: "Extremely refreshing and sweet red watermelon, perfect for summer.",
    buyingPrice: 210,
    sellingPrice: 300,
    quantity: 18,
    stockLevel: 5,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80"
  },
  {
    name: "Mango",
    barcode: "FRU007",
    categoryName: "Fruits",
    brand: "Sunripe",
    description: "Premium local mangoes, sweet, pulpy and highly fragrant.",
    buyingPrice: 125,
    sellingPrice: 180,
    quantity: 50,
    stockLevel: 12,
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=80"
  },
  {
    name: "Grapes",
    barcode: "FRU008",
    categoryName: "Fruits",
    brand: "Fresh Imported",
    description: "Sweet, seedless red grapes imported for premium quality.",
    buyingPrice: 500,
    sellingPrice: 650,
    quantity: 35,
    stockLevel: 8,
    image: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&q=80"
  },

  // ── Dairy ───────────────────────────────────────────────────────────────────
  {
    name: "Fresh Milk 1L",
    barcode: "DAI001",
    categoryName: "Dairy",
    brand: "Kotmale",
    description: "Pasteurized pure cow's milk, rich and nutritious.",
    buyingPrice: 240,
    sellingPrice: 290,
    quantity: 90,
    stockLevel: 15,
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80"
  },
  {
    name: "Yoghurt Cup",
    barcode: "DAI002",
    categoryName: "Dairy",
    brand: "Highland",
    description: "Creamy vanilla yoghurt made with fresh milk.",
    buyingPrice: 65,
    sellingPrice: 80,
    quantity: 150,
    stockLevel: 25,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80"
  },
  {
    name: "Cheddar Cheese 200g",
    barcode: "DAI003",
    categoryName: "Dairy",
    brand: "Anchor",
    description: "Rich cheddar cheese block, perfect for slicing or melting.",
    buyingPrice: 800,
    sellingPrice: 950,
    quantity: 6,
    stockLevel: 10,
    image: "https://images.unsplash.com/photo-1486299267070-8382e21b471a?w=400&q=80"
  },
  {
    name: "Salted Butter 200g",
    barcode: "DAI004",
    categoryName: "Dairy",
    brand: "Anchor",
    description: "Pure dairy butter made from fresh cream, salted.",
    buyingPrice: 620,
    sellingPrice: 720,
    quantity: 40,
    stockLevel: 10,
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&q=80"
  },

  // ── Bakery ──────────────────────────────────────────────────────────────────
  {
    name: "Sandwich Bread",
    barcode: "BAK001",
    categoryName: "Bakery",
    brand: "Prima",
    description: "Soft white sandwich bread slice loaf, baked fresh daily.",
    buyingPrice: 110,
    sellingPrice: 140,
    quantity: 60,
    stockLevel: 10,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80"
  },
  {
    name: "Sugar Buns (Pack of 4)",
    barcode: "BAK002",
    categoryName: "Bakery",
    brand: "Local Bakery",
    description: "Soft sweet buns sprinkled with sugar crystals.",
    buyingPrice: 60,
    sellingPrice: 80,
    quantity: 3,
    stockLevel: 10,
    image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&q=80"
  },
  {
    name: "Chocolate Gateau Cake",
    barcode: "BAK003",
    categoryName: "Bakery",
    brand: "Suriya",
    description: "Decadent rich chocolate cake, perfect for celebrations.",
    buyingPrice: 950,
    sellingPrice: 1200,
    quantity: 15,
    stockLevel: 5,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80"
  },
  {
    name: "Chocolate Chip Cookies",
    barcode: "BAK004",
    categoryName: "Bakery",
    brand: "Maliban",
    description: "Crunchy cookies studded with delicious chocolate chips.",
    buyingPrice: 280,
    sellingPrice: 350,
    quantity: 45,
    stockLevel: 10,
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=80"
  },

  // ── Beverages ───────────────────────────────────────────────────────────────
  {
    name: "Coca Cola 1.5L",
    barcode: "BEV001",
    categoryName: "Beverages",
    brand: "Coca Cola",
    description: "Refreshing cold carbonated soft drink.",
    buyingPrice: 320,
    sellingPrice: 380,
    quantity: 80,
    stockLevel: 15,
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80"
  },
  {
    name: "Mango Fruit Juice 1L",
    barcode: "BEV002",
    categoryName: "Beverages",
    brand: "Smak",
    description: "Sweet mango nectar fruit juice, pasteurized.",
    buyingPrice: 350,
    sellingPrice: 420,
    quantity: 30,
    stockLevel: 8,
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80"
  },
  {
    name: "Red Bull Energy Drink",
    barcode: "BEV003",
    categoryName: "Beverages",
    brand: "Red Bull",
    description: "Premium energy drink to vitalize body and mind.",
    buyingPrice: 550,
    sellingPrice: 650,
    quantity: 0,
    stockLevel: 12,
    image: "https://images.unsplash.com/photo-1542841201-99615a5fa1c9?w=400&q=80"
  },
  {
    name: "Ginger Beer 1.5L",
    barcode: "BEV004",
    categoryName: "Beverages",
    brand: "Elephant House",
    description: "Traditional local carbonated ginger beer.",
    buyingPrice: 280,
    sellingPrice: 330,
    quantity: 65,
    stockLevel: 10,
    image: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=400&q=80"
  },

  // ── Rice ────────────────────────────────────────────────────────────────────
  {
    name: "Keeri Samba Rice 5kg",
    barcode: "RIC001",
    categoryName: "Rice",
    brand: "Araliya",
    description: "Premium local keeri samba rice, highly polished and aromatic.",
    buyingPrice: 1400,
    sellingPrice: 1650,
    quantity: 65,
    stockLevel: 10,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80"
  },
  {
    name: "Basmati Rice 5kg",
    barcode: "RIC002",
    categoryName: "Rice",
    brand: "India Gate",
    description: "Aged long-grain Basmati rice, premium aroma and length.",
    buyingPrice: 2500,
    sellingPrice: 2950,
    quantity: 40,
    stockLevel: 8,
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=80"
  },
  {
    name: "Red Raw Rice 5kg",
    barcode: "RIC003",
    categoryName: "Rice",
    brand: "Lanka Rice",
    description: "Nutritious traditional red raw rice, high in fiber.",
    buyingPrice: 950,
    sellingPrice: 1150,
    quantity: 50,
    stockLevel: 10,
    image: "https://images.unsplash.com/photo-1536304997881-a372c179924b?w=400&q=80"
  },

  // ── Grocery ─────────────────────────────────────────────────────────────────
  {
    name: "White Sugar 1kg",
    barcode: "GRO001",
    categoryName: "Grocery",
    brand: "Lanka Sugar",
    description: "Fine granulated white sugar for sweetening.",
    buyingPrice: 220,
    sellingPrice: 260,
    quantity: 120,
    stockLevel: 20,
    image: "https://images.unsplash.com/photo-1581781862590-f164b13c1bb5?w=400&q=80"
  },
  {
    name: "Tea Packet 400g",
    barcode: "GRO002",
    categoryName: "Grocery",
    brand: "Watawala",
    description: "Premium blend Ceylon black tea, strong flavor.",
    buyingPrice: 520,
    sellingPrice: 620,
    quantity: 85,
    stockLevel: 15,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&q=80"
  },
  {
    name: "Coffee Packet 200g",
    barcode: "GRO003",
    categoryName: "Grocery",
    brand: "Harischandra",
    description: "Locally roasted pure ground coffee powder.",
    buyingPrice: 750,
    sellingPrice: 890,
    quantity: 35,
    stockLevel: 8,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80"
  },
  {
    name: "Wheat Flour 1kg",
    barcode: "GRO004",
    categoryName: "Grocery",
    brand: "Prima",
    description: "All-purpose wheat flour, ideal for breads and rotis.",
    buyingPrice: 180,
    sellingPrice: 210,
    quantity: 110,
    stockLevel: 15,
    image: "https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=400&q=80"
  },
  {
    name: "Red Dhal 1kg",
    barcode: "GRO005",
    categoryName: "Grocery",
    brand: "Lanka Import",
    description: "Split red lentils (masoor dhal), quick cooking.",
    buyingPrice: 270,
    sellingPrice: 320,
    quantity: 95,
    stockLevel: 12,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80"
  },
  {
    name: "Table Salt 1kg",
    barcode: "GRO006",
    categoryName: "Grocery",
    brand: "Indra",
    description: "Iodized table salt for everyday seasoning.",
    buyingPrice: 90,
    sellingPrice: 120,
    quantity: 140,
    stockLevel: 15,
    image: "https://images.unsplash.com/photo-1608797178974-15b35a61d121?w=400&q=80"
  },
  {
    name: "Cooking Oil 1L",
    barcode: "GRO007",
    categoryName: "Grocery",
    brand: "Marina",
    description: "Refined coconut cooking oil, pure and clear.",
    buyingPrice: 580,
    sellingPrice: 680,
    quantity: 75,
    stockLevel: 10,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80"
  },

  // ── Snacks ──────────────────────────────────────────────────────────────────
  {
    name: "Chocolate Bar 100g",
    barcode: "SNA001",
    categoryName: "Snacks",
    brand: "Kandos",
    description: "Creamy milk chocolate bar, sweet local favorite.",
    buyingPrice: 200,
    sellingPrice: 250,
    quantity: 110,
    stockLevel: 15,
    image: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&q=80"
  },
  {
    name: "Potato Chips 120g",
    barcode: "SNA002",
    categoryName: "Snacks",
    brand: "Lays",
    description: "Crispy salted potato chips family pack.",
    buyingPrice: 260,
    sellingPrice: 320,
    quantity: 90,
    stockLevel: 12,
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&q=80"
  },
  {
    name: "Cream Crackers 300g",
    barcode: "SNA003",
    categoryName: "Snacks",
    brand: "Maliban",
    description: "Crisp and flaky classic cream cracker biscuits.",
    buyingPrice: 200,
    sellingPrice: 240,
    quantity: 150,
    stockLevel: 20,
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=400&q=80"
  },
  {
    name: "Salted Cashews 100g",
    barcode: "SNA004",
    categoryName: "Snacks",
    brand: "Royal Snacks",
    description: "Roasted and lightly salted premium cashew nuts.",
    buyingPrice: 650,
    sellingPrice: 780,
    quantity: 25,
    stockLevel: 5,
    image: "https://images.unsplash.com/photo-1534120247760-c44c3e4a62f1?w=400&q=80"
  },

  // ── Frozen Foods ────────────────────────────────────────────────────────────
  {
    name: "Chicken Nuggets 500g",
    barcode: "FRO001",
    categoryName: "Frozen Foods",
    brand: "Keells",
    description: "Breaded chicken nuggets, crispy outside and juicy inside.",
    buyingPrice: 750,
    sellingPrice: 890,
    quantity: 50,
    stockLevel: 8,
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80"
  },
  {
    name: "Frozen French Fries 1kg",
    barcode: "FRO002",
    categoryName: "Frozen Foods",
    brand: "McCain",
    description: "Premium frozen cut potatoes, ready for deep frying or baking.",
    buyingPrice: 1000,
    sellingPrice: 1200,
    quantity: 30,
    stockLevel: 5,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80"
  },
  {
    name: "Vanilla Ice Cream 1L",
    barcode: "FRO003",
    categoryName: "Frozen Foods",
    brand: "Cargills",
    description: "Rich and creamy vanilla flavored dairy ice cream.",
    buyingPrice: 370,
    sellingPrice: 450,
    quantity: 40,
    stockLevel: 10,
    image: "https://images.unsplash.com/photo-1570145820259-b5b80c5c8bd6?w=400&q=80"
  },
  {
    name: "Frozen Green Peas 500g",
    barcode: "FRO004",
    categoryName: "Frozen Foods",
    brand: "Green Farms",
    description: "Freshly frozen sweet green peas, tender and green.",
    buyingPrice: 280,
    sellingPrice: 350,
    quantity: 4,
    stockLevel: 6,
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&q=80"
  },

  // ── Household Items ──────────────────────────────────────────────────────────
  {
    name: "Laundry Detergent 1kg",
    barcode: "HOU001",
    categoryName: "Household Items",
    brand: "Surf Excel",
    description: "Stain remover laundry washing powder.",
    buyingPrice: 460,
    sellingPrice: 540,
    quantity: 150,
    stockLevel: 15,
    image: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=400&q=80"
  },
  {
    name: "Dishwashing Liquid 500ml",
    barcode: "HOU002",
    categoryName: "Household Items",
    brand: "Vim",
    description: "Lemon fresh grease-removing dishwashing liquid.",
    buyingPrice: 240,
    sellingPrice: 290,
    quantity: 80,
    stockLevel: 10,
    image: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=400&q=80"
  },
  {
    name: "Toilet Paper 4-Pack",
    barcode: "HOU003",
    categoryName: "Household Items",
    brand: "Flora",
    description: "Soft, absorbent 2-ply toilet paper rolls.",
    buyingPrice: 380,
    sellingPrice: 450,
    quantity: 65,
    stockLevel: 8,
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80"
  },
  {
    name: "Garbage Bags Large",
    barcode: "HOU004",
    categoryName: "Household Items",
    brand: "Clean Home",
    description: "Strong, tear-resistant black garbage bags.",
    buyingPrice: 260,
    sellingPrice: 320,
    quantity: 110,
    stockLevel: 12,
    image: "https://images.unsplash.com/photo-1610557892470-76d74022fa86?w=400&q=80"
  },

  // ── Personal Care ───────────────────────────────────────────────────────────
  {
    name: "Soap Bar",
    barcode: "PER001",
    categoryName: "Personal Care",
    brand: "Lux",
    description: "Beauty soap bar for soft fragrant skin.",
    buyingPrice: 130,
    sellingPrice: 160,
    quantity: 150,
    stockLevel: 20,
    image: "https://images.unsplash.com/photo-1607006342411-92f1f6a5b6d7?w=400&q=80"
  },
  {
    name: "Toothpaste 120g",
    barcode: "PER002",
    categoryName: "Personal Care",
    brand: "Clogard",
    description: "Fluoride toothpaste with clove oil for strong teeth.",
    buyingPrice: 180,
    sellingPrice: 220,
    quantity: 95,
    stockLevel: 15,
    image: "https://images.unsplash.com/photo-1559599141-3815480a826b?w=400&q=80"
  },
  {
    name: "Shampoo 180ml",
    barcode: "PER003",
    categoryName: "Personal Care",
    brand: "Sunsilk",
    description: "Hair shampoo for thick, glossy and smooth hair.",
    buyingPrice: 400,
    sellingPrice: 480,
    quantity: 60,
    stockLevel: 10,
    image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&q=80"
  },
  {
    name: "Hand Sanitizer 100ml",
    barcode: "PER004",
    categoryName: "Personal Care",
    brand: "Dettol",
    description: "Instant hand sanitizer gel, kills 99.9% germs.",
    buyingPrice: 200,
    sellingPrice: 250,
    quantity: 8,
    stockLevel: 10,
    image: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=400&q=80"
  }
];

module.exports = { categories, products, users };
