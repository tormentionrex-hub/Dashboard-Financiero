// ─────────────────────────────────────────────────────────────────────────────
//  THE SPACE SHOP — Kennedy Space Center Official Store
//  Datos reales extraídos de thespaceshop.com
//  Empresa matriz: Delaware North | Merritt Island, FL 32953
//  Teléfono: 1.800.621.9826 | Envío gratis en compras ≥ $75
// ─────────────────────────────────────────────────────────────────────────────

// ── EMPRESA ───────────────────────────────────────────────────────────────────
export const COMPANY_INFO = {
  name:          "The Space Shop",
  fullName:      "The Space Shop — Kennedy Space Center Official Store",
  parent:        "Delaware North",
  location:      "Space Commerce Way, Merritt Island, FL 32953",
  phone:         "1.800.621.9826",
  website:       "https://thespaceshop.com",
  platform:      "BigCommerce",
  freeShipping:  75,   // USD threshold
  currency:      "USD",
  totalProducts: 1149, // aprox. según conteo del sitio
};

// ── MARCAS ASOCIADAS ──────────────────────────────────────────────────────────
export const BRANDS = [
  "47 Brand", "Champion", "Nike", "Under Armour", "RSVLTS",
  "Peter Millar", "Loungefly", "New Era", "Fisher Space Pen",
  "YETI", "Corkcicle", "DemerBox", "Pins & Aces", "Lusso",
  "Barbie / Mattel", "LEGO", "Palm Pals",
];

// ── TEMAS ESPACIALES ──────────────────────────────────────────────────────────
export const SPACE_THEMES = [
  "Apollo", "STS Shuttle", "Artemis", "SpaceX", "Blue Origin", "Peanuts / Snoopy",
];

// ── CATEGORÍAS REALES DEL SITIO ───────────────────────────────────────────────
export const CATEGORIES = [
  { id: "memorabilia",   name: "Memorabilia",             count: 233, icon: "🏅" },
  { id: "clothing",      name: "Clothing & Accessories",  count: 367, icon: "👕" },
  { id: "toys",          name: "Toy Shop",                count: 87,  icon: "🧸" },
  { id: "home_gift",     name: "Home & Gift",             count: 462, icon: "🏠" },
  { id: "sale",          name: "Sale",                    count: 12,  icon: "🏷️" },
];

// ── SUBCATEGORÍAS ──────────────────────────────────────────────────────────────
export const SUBCATEGORIES = {
  memorabilia: ["Mission Patches", "Models", "Framed Art", "Meteorites"],
  clothing:    ["Men", "Women", "Kids", "Accessories", "Brands"],
  toys:        ["LEGO & Blocks", "Plush", "Puzzles & Games", "Toys", "Costumes"],
  home_gift:   ["Drinkware & Mugs", "Magnets", "Pens", "Home Accents", "Books", "Golf", "Space Food", "Keychains & Bag Charms"],
};

// ── CATÁLOGO DE PRODUCTOS REALES ──────────────────────────────────────────────
export const SPACE_SHOP_PRODUCTS = [

  // ── MEMORABILIA — MODELOS ─────────────────────────────────────────────────
  { id: "MR001", name: "Executive Series Space Shuttle Full Stack Discovery 1:200 Model", category: "Memorabilia", sub: "Models", price: 300.00, icon: "🚀", brand: null },
  { id: "MR002", name: "Executive Series Saturn V Rocket 1:200 Model",                   category: "Memorabilia", sub: "Models", price: 350.00, icon: "🚀", brand: null },
  { id: "MR003", name: "Executive Series Lunar Excursion Module 1:48 Model",             category: "Memorabilia", sub: "Models", price: 280.00, icon: "🌕", brand: null },
  { id: "MR004", name: "Executive Series Command Module 1:48 Model",                     category: "Memorabilia", sub: "Models", price: 300.00, icon: "🛸", brand: null },
  { id: "MR005", name: "Executive Series Space Shuttle Full Stack Endeavour 1:200 Model",category: "Memorabilia", sub: "Models", price: 300.00, icon: "🚀", brand: null },
  { id: "MR006", name: "Executive Series Space Shuttle Full Stack Atlantis 1:200 Model", category: "Memorabilia", sub: "Models", price: 300.00, icon: "🚀", brand: null },
  { id: "MR007", name: "Executive Series Mercury Capsule 1:24 Model",                   category: "Memorabilia", sub: "Models", price: 260.00, icon: "🛸", brand: null },
  { id: "MR008", name: "Executive Series Gemini IV Capsule 1:24 Model",                 category: "Memorabilia", sub: "Models", price: 280.00, icon: "🛸", brand: null },
  { id: "MR009", name: "Executive Series Mercury Redstone Rocket 1:72 Model",           category: "Memorabilia", sub: "Models", price: 250.00, icon: "🚀", brand: null },
  { id: "MR010", name: "Executive Series Apollo 11 Capsule 1:25 Model",                 category: "Memorabilia", sub: "Models", price: 300.00, icon: "🌕", brand: null },
  { id: "MR011", name: "SLS Rocket 1:235 Model",                                        category: "Memorabilia", sub: "Models", price: 59.99,  icon: "🚀", brand: null },
  { id: "MR012", name: "Boeing CST-100 STARLINER 1:48 Model",                           category: "Memorabilia", sub: "Models", price: 59.99,  icon: "🛸", brand: null },
  { id: "MR013", name: "Apollo 11 Saturn V Rocket Model 1:96 Scale",                   category: "Memorabilia", sub: "Models", price: 209.99, icon: "🚀", brand: null },

  // ── MEMORABILIA — METEORITOS ──────────────────────────────────────────────
  { id: "MT001", name: "Authentic Moon Rock Small",         category: "Memorabilia", sub: "Meteorites", price: 80.00,  icon: "🌕", brand: null },
  { id: "MT002", name: "Authentic Moon Rock Large",         category: "Memorabilia", sub: "Meteorites", price: 170.00, icon: "🌕", brand: null },
  { id: "MT003", name: "Authentic Mars Rock Small",         category: "Memorabilia", sub: "Meteorites", price: 80.00,  icon: "☄️", brand: null },
  { id: "MT004", name: "Authentic Mars Rock Medium",        category: "Memorabilia", sub: "Meteorites", price: 105.00, icon: "☄️", brand: null },
  { id: "MT005", name: "Authentic Mars Rock Large",         category: "Memorabilia", sub: "Meteorites", price: 170.00, icon: "☄️", brand: null },
  { id: "MT006", name: "Genuine Meteorite 3 Grams",         category: "Memorabilia", sub: "Meteorites", price: 14.99,  icon: "☄️", brand: null },
  { id: "MT007", name: "Genuine Meteorite 25 Grams",        category: "Memorabilia", sub: "Meteorites", price: 60.00,  icon: "☄️", brand: null },
  { id: "MT008", name: "Genuine Meteorite 150 Grams",       category: "Memorabilia", sub: "Meteorites", price: 220.00, icon: "☄️", brand: null },
  { id: "MT009", name: "Genuine Meteorite 1/2 Lb",          category: "Memorabilia", sub: "Meteorites", price: 315.00, icon: "☄️", brand: null },
  { id: "MT010", name: "Genuine Meteorite Necklace",        category: "Memorabilia", sub: "Meteorites", price: 24.99,  icon: "💎", brand: null },
  { id: "MT011", name: "Silver Star Meteorite Earrings",    category: "Memorabilia", sub: "Meteorites", price: 100.00, icon: "💫", brand: null },
  { id: "MT012", name: "Silver Star Meteorite Pendant",     category: "Memorabilia", sub: "Meteorites", price: 105.00, icon: "💫", brand: null },
  { id: "MT013", name: "Solar System Meteorite Pendant",    category: "Memorabilia", sub: "Meteorites", price: 105.00, icon: "💫", brand: null },
  { id: "MT014", name: "Spiral Galaxy Meteorite Pendant",   category: "Memorabilia", sub: "Meteorites", price: 105.00, icon: "💫", brand: null },
  { id: "MT015", name: "I Love You To The Moon Pendant",    category: "Memorabilia", sub: "Meteorites", price: 400.00, icon: "🌙", brand: null },

  // ── MEMORABILIA — PARCHES DE MISIÓN (muestra representativa de 176 totales) ─
  { id: "MP001", name: "STS-119 Mission Patch",   category: "Memorabilia", sub: "Mission Patches", price: 9.99, icon: "🎖️", brand: null },
  { id: "MP002", name: "STS-100 Mission Patch",   category: "Memorabilia", sub: "Mission Patches", price: 9.99, icon: "🎖️", brand: null },
  { id: "MP003", name: "STS-98 Mission Patch",    category: "Memorabilia", sub: "Mission Patches", price: 9.99, icon: "🎖️", brand: null },
  { id: "MP004", name: "STS-97 Mission Patch",    category: "Memorabilia", sub: "Mission Patches", price: 9.99, icon: "🎖️", brand: null },
  { id: "MP005", name: "STS-106 Mission Patch",   category: "Memorabilia", sub: "Mission Patches", price: 9.99, icon: "🎖️", brand: null },
  { id: "MP006", name: "STS-99 Mission Patch",    category: "Memorabilia", sub: "Mission Patches", price: 9.99, icon: "🎖️", brand: null },
  { id: "MP007", name: "STS-96 Mission Patch",    category: "Memorabilia", sub: "Mission Patches", price: 9.99, icon: "🎖️", brand: null },
  { id: "MP008", name: "STS-89 Mission Patch",    category: "Memorabilia", sub: "Mission Patches", price: 9.99, icon: "🎖️", brand: null },
  { id: "MP009", name: "NASA Hubble Patch",        category: "Memorabilia", sub: "Mission Patches", price: 9.99, icon: "🔭", brand: null },
  { id: "MP010", name: "STS-125 Mission Patch",   category: "Memorabilia", sub: "Mission Patches", price: 9.99, icon: "🎖️", brand: null },
  { id: "MP011", name: "STS-130 Mission Patch",   category: "Memorabilia", sub: "Mission Patches", price: 9.99, icon: "🎖️", brand: null },
  { id: "MP012", name: "STS-129 Mission Patch",   category: "Memorabilia", sub: "Mission Patches", price: 9.99, icon: "🎖️", brand: null },

  // ── CLOTHING & ACCESSORIES ────────────────────────────────────────────────
  { id: "CL001", name: "RSVLTS® Peanuts Moonwalk Snoopy Tee",                    category: "Clothing & Accessories", sub: "Men",   price: 44.99, icon: "👕", brand: "RSVLTS" },
  { id: "CL002", name: "RSVLTS® Snoopy In Space KUNUFLEX Short Sleeve Shirt",    category: "Clothing & Accessories", sub: "Men",   price: 79.99, icon: "👕", brand: "RSVLTS" },
  { id: "CL003", name: "Villainous Astronaut Tee",                               category: "Clothing & Accessories", sub: "Men",   price: 34.99, icon: "👕", brand: null },
  { id: "CL004", name: "RSVLTS® One Small Putt For Man All-Day Polo",            category: "Clothing & Accessories", sub: "Men",   price: 79.99, icon: "👔", brand: "RSVLTS" },
  { id: "CL005", name: "Pins & Aces NASA Space Walk Polo Grey",                  category: "Clothing & Accessories", sub: "Men",   price: 79.99, icon: "👔", brand: "Pins & Aces" },
  { id: "CL006", name: "Pins & Aces NASA Space Walk Polo Blue",                  category: "Clothing & Accessories", sub: "Men",   price: 79.99, icon: "👔", brand: "Pins & Aces" },
  { id: "CL007", name: "Under Armour KSC NASA Meatball Tech™ Stretch Hoodie Tee",category: "Clothing & Accessories", sub: "Men",   price: 44.99, icon: "👕", brand: "Under Armour" },
  { id: "CL008", name: "Be Greater Than Average Pocket Tee Soothing Blue",       category: "Clothing & Accessories", sub: "Men",   price: 34.99, icon: "👕", brand: null },
  { id: "CL009", name: "Ballroom KSC Shuttle Tee Spruce",                        category: "Clothing & Accessories", sub: "Men",   price: 29.99, icon: "👕", brand: null },
  { id: "CL010", name: "KSC Blockbuster Tee Pepper",                             category: "Clothing & Accessories", sub: "Men",   price: 29.99, icon: "👕", brand: null },
  { id: "CL011", name: "Under Armour Women's NASA Worm Icon Crew Sweatshirt",    category: "Clothing & Accessories", sub: "Women", price: 69.99, icon: "👚", brand: "Under Armour" },
  { id: "CL012", name: "Under Armour Women's NASA Meatball Quarter Zip Pullover",category: "Clothing & Accessories", sub: "Women", price: 69.99, icon: "👚", brand: "Under Armour" },
  { id: "CL013", name: "Women's Doorway Astronaut Tee Periwinkle",               category: "Clothing & Accessories", sub: "Women", price: 29.99, icon: "👕", brand: null },
  { id: "CL014", name: "Champion Women's NASA Meatball Ringer Tee White Navy",   category: "Clothing & Accessories", sub: "Women", price: 39.99, icon: "👕", brand: "Champion" },
  { id: "CL015", name: "Women's NASA Meatball Ribbed Tee Steel Grey",            category: "Clothing & Accessories", sub: "Women", price: 44.99, icon: "👕", brand: null },
  { id: "CL016", name: "Women's NASA Meatball Midi Sweatshirt Spring Navy",      category: "Clothing & Accessories", sub: "Women", price: 59.99, icon: "👚", brand: null },
  { id: "CL017", name: "Women's Kennedy Space Center Embossed Mock Neck Sweatshirt", category: "Clothing & Accessories", sub: "Women", price: 69.99, icon: "👚", brand: null },
  { id: "CL018", name: "Women's Kennedy Space Center Nelly Bows Tee Ivory",      category: "Clothing & Accessories", sub: "Women", price: 29.99, icon: "👕", brand: null },
  { id: "CL019", name: "Under Armour Youth KSC NASA Worm Tech™ Stretch Hoodie Tee", category: "Clothing & Accessories", sub: "Kids", price: 44.99, icon: "👕", brand: "Under Armour" },
  { id: "CL020", name: "Loungefly NASA Mini Backpack",                            category: "Clothing & Accessories", sub: "Accessories", price: 85.00, icon: "🎒", brand: "Loungefly" },
  { id: "CL021", name: "NASA Meatball Luggage Tag",                              category: "Clothing & Accessories", sub: "Accessories", price: 9.99,  icon: "🏷️", brand: null },
  { id: "CL022", name: "Pins & Aces NASA Meatball Golf Ball Marker",             category: "Clothing & Accessories", sub: "Accessories", price: 14.95, icon: "⛳", brand: "Pins & Aces" },
  { id: "CL023", name: "NASA 2027 Calendar",                                     category: "Clothing & Accessories", sub: "Accessories", price: 9.99,  icon: "📅", brand: null },

  // ── TOY SHOP ──────────────────────────────────────────────────────────────
  { id: "TY001", name: "Kennedy Space Center Toy Cube Puzzle",              category: "Toy Shop", sub: "Puzzles & Games", price: 9.99,   icon: "🧩", brand: null },
  { id: "TY002", name: "Palm Pals Plush Astronaut Snoopy",                  category: "Toy Shop", sub: "Plush",          price: 14.99,  icon: "🧸", brand: "Palm Pals" },
  { id: "TY003", name: "Plush Peanuts Astronaut Snoopy",                    category: "Toy Shop", sub: "Plush",          price: 29.99,  icon: "🧸", brand: null },
  { id: "TY004", name: "LEGO® Creator 3-in-1 Space Exploration Telescope",  category: "Toy Shop", sub: "LEGO & Blocks",  price: 44.99,  icon: "🔭", brand: "LEGO" },
  { id: "TY005", name: "Articulated Astronaut Toy",                         category: "Toy Shop", sub: "Toys",           price: 5.99,   icon: "👨‍🚀", brand: null },
  { id: "TY006", name: "Space Shuttle Launch Pad Diecast Toy",              category: "Toy Shop", sub: "Toys",           price: 14.99,  icon: "🚀", brand: null },
  { id: "TY007", name: "Astronaut Rubber Duck Toy",                         category: "Toy Shop", sub: "Toys",           price: 12.99,  icon: "🐥", brand: null },
  { id: "TY008", name: "Plush Astronaut In Space Suit",                     category: "Toy Shop", sub: "Plush",          price: 24.99,  icon: "🧸", brand: null },
  { id: "TY009", name: "Astronaut Galaxy Projector Lamp",                   category: "Toy Shop", sub: "Toys",           price: 34.99,  icon: "🌌", brand: null },
  { id: "TY010", name: "Plush Astronaut Monkey",                            category: "Toy Shop", sub: "Plush",          price: 24.99,  icon: "🧸", brand: null },
  { id: "TY011", name: "Atlantis Space Shuttle Mini Building Blocks",       category: "Toy Shop", sub: "LEGO & Blocks",  price: 39.99,  icon: "🧱", brand: null },
  { id: "TY012", name: "Ellen Ochoa Barbie Inspiring Women Doll",           category: "Toy Shop", sub: "Toys",           price: 44.99,  icon: "🪆", brand: "Barbie / Mattel" },
  { id: "TY013", name: "Youth Astronaut Gloves",                            category: "Toy Shop", sub: "Costumes",       price: 14.99,  icon: "🧤", brand: null },
  { id: "TY014", name: "LEGO® Technic Lunar Outpost® Moon Rover",          category: "Toy Shop", sub: "LEGO & Blocks",  price: 110.00, icon: "🤖", brand: "LEGO" },
  { id: "TY015", name: "LEGO® Icons Shuttle Carrier Aircraft",              category: "Toy Shop", sub: "LEGO & Blocks",  price: 240.00, icon: "✈️", brand: "LEGO" },
  { id: "TY016", name: "Barbie Limited Edition 60th Anniversary Miss Astronaut", category: "Toy Shop", sub: "Toys",     price: 115.00, icon: "🪆", brand: "Barbie / Mattel" },
  { id: "TY017", name: "Space Shuttle With Transporter Truck",              category: "Toy Shop", sub: "Toys",           price: 39.99,  icon: "🚛", brand: null },
  { id: "TY018", name: "Astronaut Action Figure",                           category: "Toy Shop", sub: "Toys",           price: 39.99,  icon: "🤖", brand: null },
  { id: "TY019", name: "Build Your Own Space Station Playset",              category: "Toy Shop", sub: "Toys",           price: 12.99,  icon: "🏗️", brand: null },
  { id: "TY020", name: "Playing Cards NASA Foil Meatball",                 category: "Toy Shop", sub: "Puzzles & Games",price: 12.99,  icon: "🃏", brand: null },

  // ── HOME & GIFT ───────────────────────────────────────────────────────────
  { id: "HG001", name: "Space Candy Freeze Dried Galaxy Clusters",          category: "Home & Gift", sub: "Space Food",          price: 12.99, icon: "🍬", brand: null },
  { id: "HG002", name: "NASA Worm Siren Mug Cream",                         category: "Home & Gift", sub: "Drinkware & Mugs",    price: 19.99, icon: "☕", brand: null },
  { id: "HG003", name: "Artemis II Mug",                                    category: "Home & Gift", sub: "Drinkware & Mugs",    price: 24.99, icon: "☕", brand: null },
  { id: "HG004", name: "Artemis II Shot Glass",                             category: "Home & Gift", sub: "Drinkware & Mugs",    price: 12.99, icon: "🥃", brand: null },
  { id: "HG005", name: "Space Shuttle Program Embroidered Patch Magnet",    category: "Home & Gift", sub: "Magnets",             price: 9.99,  icon: "🧲", brand: null },
  { id: "HG006", name: "Space Shuttle Embroidered Patch Magnet",            category: "Home & Gift", sub: "Magnets",             price: 9.99,  icon: "🧲", brand: null },
  { id: "HG007", name: "Apollo Embroidered Patch Magnet",                   category: "Home & Gift", sub: "Magnets",             price: 9.99,  icon: "🧲", brand: null },
  { id: "HG008", name: "Shuttle Malta Magnet",                              category: "Home & Gift", sub: "Magnets",             price: 9.99,  icon: "🧲", brand: null },
  { id: "HG009", name: "Snoopy In Space With American Flag Chunky Magnet",  category: "Home & Gift", sub: "Magnets",             price: 12.99, icon: "🧲", brand: null },
  { id: "HG010", name: "Artemis II Magnet",                                 category: "Home & Gift", sub: "Magnets",             price: 12.99, icon: "🧲", brand: null },
  { id: "HG011", name: "Astronaut Ballpoint Pen",                           category: "Home & Gift", sub: "Pens",                price: 9.99,  icon: "🖊️", brand: null },
  { id: "HG012", name: "Saturn V Coaster",                                  category: "Home & Gift", sub: "Home Accents",        price: 6.99,  icon: "🥏", brand: null },
  { id: "HG013", name: "Man On The Moon Coaster",                           category: "Home & Gift", sub: "Home Accents",        price: 6.99,  icon: "🥏", brand: null },
  { id: "HG014", name: "Atlantis Lift Off Coaster",                         category: "Home & Gift", sub: "Home Accents",        price: 6.99,  icon: "🥏", brand: null },
  { id: "HG015", name: "Artemis II Beach Towel",                            category: "Home & Gift", sub: "Home Accents",        price: 29.99, icon: "🏖️", brand: null },
  { id: "HG016", name: "NASA Meatball Silicone Luggage Tag",                category: "Home & Gift", sub: "Keychains & Bag Charms", price: 9.99, icon: "🏷️", brand: null },
  { id: "HG017", name: "Magic Tree House® #8: Midnight on the Moon Book",   category: "Home & Gift", sub: "Books",               price: 6.99,  icon: "📚", brand: null },
  { id: "HG018", name: "NASA 2027 Calendar",                                category: "Home & Gift", sub: "Home Accents",        price: 9.99,  icon: "📅", brand: null },
  { id: "HG019", name: "RSVLTS One Small Putt Polo",                        category: "Home & Gift", sub: "Golf",                price: 79.99, icon: "⛳", brand: "RSVLTS" },

  // ── SALE (artículos en oferta actuales) ───────────────────────────────────
  { id: "SA001", name: "Kennedy Space Center Hat & Tee Combo Grey & Red",   category: "Sale", sub: "Combo",      price: 19.88, icon: "🏷️", brand: null },
  { id: "SA002", name: "NASA Airstream Bus Ornament",                       category: "Sale", sub: "Home",       price: 8.88,  icon: "🎄", brand: null },
  { id: "SA003", name: "Failure Is Not An Option Tee",                      category: "Sale", sub: "Clothing",   price: 29.88, icon: "👕", brand: null },
  { id: "SA004", name: "Wide Brim Bucket Hat NASA Meatball White",          category: "Sale", sub: "Accessories",price: 14.88, icon: "🧢", brand: null },
  { id: "SA005", name: "Astronaut Suit Apron",                              category: "Sale", sub: "Home",       price: 9.88,  icon: "🍳", brand: null },
  { id: "SA006", name: "KSC Logo Mug Red White Blue",                       category: "Sale", sub: "Drinkware",  price: 7.88,  icon: "☕", brand: null },
  { id: "SA007", name: "Lusso NASA Worm Metallic Key Ring Pouch Royal Blue",category: "Sale", sub: "Accessories",price: 12.88, icon: "🔑", brand: "Lusso" },
  { id: "SA008", name: "Lusso NASA Worm Metallic Key Ring Pouch Gold",      category: "Sale", sub: "Accessories",price: 12.88, icon: "🔑", brand: "Lusso" },
  { id: "SA009", name: "Lusso NASA Worm Tassel Key Ring Gold",              category: "Sale", sub: "Accessories",price: 9.88,  icon: "🔑", brand: "Lusso" },
  { id: "SA010", name: "NASA Meatball Applique Crew Sweater Blue",          category: "Sale", sub: "Clothing",   price: 64.88, icon: "👕", brand: null },
  { id: "SA011", name: "Lusso NASA Worm Metallic Key Ring Pouch Red",       category: "Sale", sub: "Accessories",price: 12.88, icon: "🔑", brand: "Lusso" },
];

// ── ANÁLISIS FINANCIERO DEL CATÁLOGO ──────────────────────────────────────────
export const CATALOG_STATS = (() => {
  const prices = SPACE_SHOP_PRODUCTS.map(p => p.price);
  const total  = prices.reduce((s, p) => s + p, 0);
  const byCategory = {};
  SPACE_SHOP_PRODUCTS.forEach(p => {
    if (!byCategory[p.category]) byCategory[p.category] = { count: 0, revenue: 0, minPrice: Infinity, maxPrice: 0 };
    byCategory[p.category].count++;
    byCategory[p.category].revenue += p.price;
    byCategory[p.category].minPrice = Math.min(byCategory[p.category].minPrice, p.price);
    byCategory[p.category].maxPrice = Math.max(byCategory[p.category].maxPrice, p.price);
  });
  return {
    totalSKUs:    SPACE_SHOP_PRODUCTS.length,
    avgPrice:     total / SPACE_SHOP_PRODUCTS.length,
    minPrice:     Math.min(...prices),
    maxPrice:     Math.max(...prices),
    catalogValue: total,
    byCategory,
  };
})();

// ── HELPERS ───────────────────────────────────────────────────────────────────
export function getRandomProduct() {
  return SPACE_SHOP_PRODUCTS[Math.floor(Math.random() * SPACE_SHOP_PRODUCTS.length)];
}

export function getRandomQty(product) {
  // Productos baratos tienen mayor rotación
  if (product.price < 15)  return Math.floor(Math.random() * 5) + 1;
  if (product.price < 50)  return Math.floor(Math.random() * 3) + 1;
  if (product.price < 150) return Math.floor(Math.random() * 2) + 1;
  return 1;
}

export function getRandomLocation() {
  const locations = [
    "Kennedy Space Center — Tienda Principal",
    "KSC — Visitor Complex",
    "KSC — Gift Shop",
    "Online — thespaceshop.com",
    "Online — Mobile App",
    "KSC — Launch Complex 39",
    "KSC — Apollo/Saturn V Center",
    "Online — thespaceshop.com/sale",
  ];
  return locations[Math.floor(Math.random() * locations.length)];
}

export function getProductsByCategory(categoryName) {
  return SPACE_SHOP_PRODUCTS.filter(p => p.category === categoryName);
}

export function getProductsByBrand(brandName) {
  return SPACE_SHOP_PRODUCTS.filter(p => p.brand === brandName);
}

export function getSaleItems() {
  return SPACE_SHOP_PRODUCTS.filter(p => p.category === "Sale");
}
