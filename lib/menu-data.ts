/* ════════════════════════════════════════════════════════
   THE JUNGLE WEY — Menu data
   Source of truth: client PDFs (TJW original/תפריטים MENU)
   · AM  = "MENU AM TJW AGO 25"        (breakfast/brunch, 08:00–15:00)
   · PM  = "MENU COMIDAS TJW MARZO 26" (dinner, 15:01–23:00)
   · Drinks = "MENU BEBIDAS TJW MARZO 26" (newest drinks card)
   All prices in Mexican pesos (MXN).
════════════════════════════════════════════════════════ */

export type MenuItem = {
  name: string;          // dish names are proper names — same in both languages
  desc?: string;         // English description (client's own wording)
  descEs?: string;       // Spanish description (client's own wording)
  price: string;
  extra?: string;        // e.g. "Add chicken +$40"
  extraEs?: string;
  badge?: "signature" | "fanFav" | "mustTry" | "premium" | "glutenFree" | "forTwo";
  img?: string;          // /public path when a real photo exists
};

export type MenuCategory = {
  id: string;
  label: string;
  labelEs: string;
  emoji: string;
  items: MenuItem[];
};

export type ServiceKey = "am" | "pm";

/* Service windows requested by the client */
export const SERVICE_HOURS = {
  am: { start: 8, end: 15, label: "08:00 – 15:00" },   // Breakfast
  pm: { start: 15, end: 23, label: "15:00 – 23:00" },  // Dinner
} as const;

/* Restaurant local timezone (Mahahual, Quintana Roo) */
export const RESTAURANT_TZ = "America/Cancun";

/** Which menu is being served right now, in restaurant local time. */
export function currentService(date: Date = new Date()): ServiceKey {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: RESTAURANT_TZ,
      hour: "numeric",
      hour12: false,
    }).format(date)
  );
  return hour >= 8 && hour < 15 ? "am" : "pm";
}

/* ════════════════════════════════════════════════════════
   AM — BRUNCH MENU (08:00–15:00)
════════════════════════════════════════════════════════ */
export const AM_FOOD: MenuCategory[] = [
  {
    id: "saladito",
    label: "Saladito Mood",
    labelEs: "Saladito Mood",
    emoji: "🍳",
    items: [
      {
        name: "Chilaquiles, wey",
        price: "$130",
        desc: "Corn chips bathed in your choice of sauce: red, green, or both (“divorciados”), served with avocado.",
        descEs: "Elige tu salsa: verde, roja o divorciados. Acompañados con aguacate.",
        extra: "Add protein: egg (2) +$30 · chicken +$50 · picaña barbacoa +$130",
        extraEs: "Elige tu proteína: huevos (2) +$30 · pollo +$50 · barbacoa de picaña +$130",
        badge: "fanFav",
      },
      {
        name: "Jungle-Style Enchiladas",
        price: "$180",
        desc: "Baked enchiladas topped with melted manchego cheese. Filled with your choice of chicken, veggies, or egg.",
        descEs: "Enchiladas suizas gratinadas con queso manchego. Rellenas de pollo, vegetales o huevo.",
      },
      {
        name: "Green Waffle",
        price: "$180",
        desc: "Savory waffle topped with egg, avocado, spinach, and confit tomatoes.",
        descEs: "Waffle de masa salada servido con topping de huevo, aguacate, espinaca baby y tomates confitados.",
      },
      {
        name: "Crispy Waffle",
        price: "$200",
        desc: "Savory waffle sandwich stuffed with crispy chicken and bacon, drizzled with honey.",
        descEs: "Sandwich de waffle de masa salada, relleno de pollo crispy y tocino, bañado en miel.",
      },
      {
        name: "Turkish Eggs",
        price: "$140",
        desc: "Greek yogurt with dill, topped with poached eggs, spicy butter and a touch of matcha sauce.",
        descEs: "Huevos pochados sobre espejo de yogurt griego con eneldo, mantequilla picante y un toque de salsa matcha.",
        badge: "mustTry",
      },
      {
        name: "Eggs Your Way",
        price: "$140",
        desc: "Choose up to 3 ingredients, your style: scrambled, sunny-side-up, or omelet. Options: mushrooms, onion, spinach, bell peppers, ham, cheese.",
        descEs: "Elige hasta 3 ingredientes y ordénalos como gustes: revueltos, estrellados o en omelette. Opciones: champiñones, cebolla, espinaca, pimientos, jamón de pavo, queso manchego.",
      },
      {
        name: "Eggs Divorciados",
        price: "$120",
        desc: "Two sunny-side-up eggs on a crunchy tortilla, topped with red and green sauce. Served with refried beans.",
        descEs: "Dos huevos estrellados montados en tortilla crunchy, bañados en salsa roja y verde. Acompañados con frijoles bayos.",
      },
      {
        name: "Huevos Rancheros",
        price: "$130",
        desc: "Two sunny-side-up eggs on a crunchy tortilla, topped with homemade red sauce and sprinkled fresh cheese. Served with refried beans.",
        descEs: "Dos huevos estrellados sobre tortilla crunchy y frijol, bañados en salsa roja casera con queso fresco espolvoreado.",
      },
    ],
  },
  {
    id: "toast",
    label: "Toast & Sandwich",
    labelEs: "Toast & Sandwich",
    emoji: "🍞",
    items: [
      {
        name: "Avocado Toast",
        price: "$180",
        desc: "Homemade bread topped with avocado, spinach, cherry tomatoes, and a poached egg.",
        descEs: "Pan casero con aguacate, espinaca, tomate cherry y huevo poché.",
        badge: "fanFav",
      },
      {
        name: "Jungle Toast",
        price: "$160",
        desc: "Homemade bread layered with guacamole, grilled veggies, and seared panela cheese.",
        descEs: "Pan casero con base de guacamole, queso panela asado y topping de verduras rostizadas.",
      },
      {
        name: "Salmon Toast",
        price: "$280",
        desc: "Homemade bread with cream cheese & capers spread, smoked salmon, arugula, avocado, red onion, and sprouts.",
        descEs: "Pan casero con aderezo de queso crema y alcaparras, lonjas de salmón ahumado, arúgula, aguacate, cebolla morada y brotes.",
        badge: "premium",
      },
      {
        name: "Beet Crunch Toast",
        price: "$140",
        desc: "Homemade bread with beet hummus, arugula, panela cheese, and walnuts.",
        descEs: "Pan casero, base de hummus de betabel, arúgula, queso panela y nueces.",
      },
      {
        name: "Cheesy Sandwich",
        price: "$160",
        desc: "Homemade bread with a 3-cheese blend, served with a tomato sauce for dipping.",
        descEs: "Pan casero con un mix de 3 quesos derretidos, acompañado de caldito de tomate para chopear.",
      },
      {
        name: "Barba Sandwich",
        price: "$220",
        desc: "Homemade bread stuffed with manchego cheese and slow-cooked picaña barbacoa, served with its broth.",
        descEs: "Pan casero, queso manchego y barbacoa de picaña, acompañado con su caldito.",
        badge: "signature",
        img: "/images/food-bbq-sandwich.jpg",
      },
      {
        name: "Sunshine Sandwich",
        price: "$180",
        desc: "Homemade bread with panela cheese, turkey ham, greens mix, avocado, tomato, and onion.",
        descEs: "Pan casero, queso panela, jamón de pavo, mix de verdes, aguacate, tomate y cebolla.",
      },
    ],
  },
  {
    id: "wraps",
    label: "Wraps",
    labelEs: "Wraps",
    emoji: "🌯",
    items: [
      {
        name: "El Cesar",
        price: "$180",
        desc: "Flour tortilla filled with lettuce, chicken, bacon, parmesan cheese, and Caesar dressing.",
        descEs: "Tortilla de harina envuelta y rellena con lechuga, pollo, tocino, queso parmesano y aderezo césar.",
      },
      {
        name: "El Revuelto",
        price: "$180",
        desc: "Flour tortilla filled with scrambled eggs, spinach, cheese, avocado, and turkey ham.",
        descEs: "Tortilla de harina rellena con huevo revuelto con espinaca, queso mozzarella, aguacate y jamón de pavo.",
      },
      {
        name: "El Fresh",
        price: "$240",
        desc: "Rice leaf base filled with smoked salmon, cucumber, carrot, spinach, tomato and avocado.",
        descEs: "Base de hoja de arroz, relleno de salmón ahumado, pepino, zanahoria, espinaca, tomate y aguacate.",
        badge: "glutenFree",
      },
      {
        name: "El Burger",
        price: "$240",
        desc: "Flour tortilla stuffed with ground beef, guacamole, lettuce, onion, cheddar cheese & house dressing. Served with French fries.",
        descEs: "Hamburguesa hecha wrap: tortilla de harina rellena con carne molida, guacamole, lechuga, cebolla, queso cheddar y aderezo de la casa. Con papas a la francesa.",
      },
    ],
  },
  {
    id: "poke",
    label: "Jungle Poke",
    labelEs: "Jungle Poke",
    emoji: "🥢",
    items: [
      {
        name: "Salmon Boom",
        price: "$240",
        desc: "Smoked salmon with avocado, seasonal fruit, and edamame over a rice base, topped with sesame seeds and alfalfa sprouts.",
        descEs: "Salmón ahumado, aguacate, fruta de temporada y edamames sobre base de arroz, coronado con ajonjolí y brotes de alfalfa.",
        badge: "mustTry",
      },
      {
        name: "Camaron Style",
        price: "$260",
        desc: "Shrimp with cucumber, cauliflower, broccoli, and avocado over a rice base, topped with sesame seeds and alfalfa sprouts.",
        descEs: "Camarones salteados, pepino, coliflor, brócoli y aguacate sobre base de arroz, coronado con ajonjolí y brotes de alfalfa.",
      },
      {
        name: "Pollo Flow",
        price: "$220",
        desc: "Chicken with cucumber, carrot, and edamame over a rice base, topped with sesame seeds and soy sprouts.",
        descEs: "Pollo, pepino, zanahoria y edamame sobre base de arroz, coronado con ajonjolí y germinado de soya.",
      },
    ],
  },
  {
    id: "dulce",
    label: "Dulce Mood",
    labelEs: "Dulce Mood",
    emoji: "🧇",
    items: [
      {
        name: "Berry Sweet",
        price: "$180",
        desc: "Homemade brioche with red berry compote and maple syrup.",
        descEs: "Pan brioche hecho en casa con compota de frutos rojos y miel de maple.",
      },
      {
        name: "Crème de la Jungla",
        price: "$160",
        desc: "Homemade brioche with passion fruit crème brûlée.",
        descEs: "Pan brioche hecho en casa con crème brûlée de maracuyá.",
        badge: "signature",
      },
      {
        name: "Berrylicious Waffle",
        price: "$180",
        desc: "Waffle topped with red berries and cream cheese frosting bites.",
        descEs: "Waffle dulce con tropiezos de queso crema y topping de frutos rojos.",
      },
      {
        name: "Dulce de Selva",
        price: "$140",
        desc: "Waffle topped with dulce de leche, banana, and walnuts.",
        descEs: "Waffle dulce con dulce de leche, plátano fresco y nuez.",
      },
      {
        name: "Choco-Love",
        price: "$140",
        desc: "Waffle topped with Nutella, fresh banana, and walnuts.",
        descEs: "Waffle dulce con nutella, plátano fresco y nuez.",
      },
    ],
  },
  {
    id: "bowls",
    label: "Bowls & Co.",
    labelEs: "Bowls & Co.",
    emoji: "🫐",
    items: [
      {
        name: "Açaí Mi Amor",
        price: "$140",
        desc: "Açaí & banana base topped with strawberries, apple, granola, red fruit coulis, and chia stars.",
        descEs: "Base de plátanos con açaí y topping de fresas, manzana, granola, coulis de frutos rojos y sprinkles de chía.",
        badge: "fanFav",
      },
      {
        name: "Fruti Choco",
        price: "$160",
        desc: "Banana & cocoa base topped with fresh bananas, strawberries, nuts, and cranberries.",
        descEs: "Base de plátano y cocoa con plátanos, fresas, nueces y arándano.",
      },
      {
        name: "Matcha Tropical",
        price: "$140",
        desc: "Matcha & chia base topped with seasonal fruits and granola.",
        descEs: "Base de matcha con chía, topping de frutas de temporada y granola.",
      },
      {
        name: "Fresh & Crunchy",
        price: "$130",
        desc: "Seasonal fruits served with granola, honey, and Greek yogurt.",
        descEs: "Frutas de temporada acompañadas con yoghurt griego, granola y un toque de miel.",
      },
    ],
  },
  {
    id: "brunch-drinks",
    label: "Los del Brunch",
    labelEs: "Los del Brunch",
    emoji: "🥂",
    items: [
      {
        name: "Tropical Mimosa",
        price: "$120",
        desc: "Watermelon juice, fresh rosemary & sparkling wine.",
        descEs: "Jugo de sandía, romero fresco y espumante.",
        badge: "mustTry",
      },
      {
        name: "Passion Mimosa",
        price: "$120",
        desc: "Mango juice, passion fruit juice & sparkling wine.",
        descEs: "Jugo de mango, jugo de maracuyá y espumante.",
      },
      {
        name: "Bloody Cruda",
        price: "$180",
        desc: "Vodka, tomato juice, house sauces, crispy bacon & stuffed olives.",
        descEs: "Vodka, jugo de tomate, salsas, tocino crocante y aceitunas rellenas.",
      },
      {
        name: "Oreo Sundae",
        price: "$120",
        desc: "Banana smoothie with milk, yogurt, cocoa & Oreo cookies.",
        descEs: "Smoothie de plátano, leche, yoghurt, cacao y galletas oreo.",
      },
      {
        name: "Matcha Delight",
        price: "$120",
        desc: "Banana, honey, milk & matcha powder, topped with dill, orange peel & powdered sugar.",
        descEs: "Plátano, miel, leche, matcha en polvo, decorado con eneldo, piel de naranja y azúcar glass.",
      },
      {
        name: "Avocado After",
        price: "$120",
        desc: "Avocado, honey, yogurt, Carnation milk & walnuts.",
        descEs: "Aguacate, miel, yoghurt, leche carnation y nuez.",
      },
      {
        name: "Good Morning, wey",
        price: "$140",
        desc: "Coffee, milk, Nutella, syrup & a Nutella crown with walnuts & whipped cream.",
        descEs: "Café, leche, nutella, jarabe y corona de nutella, nuez y crema batida.",
        badge: "signature",
      },
      {
        name: "Perfect Smoothie",
        price: "$100",
        desc: "Make it your way: choose up to two ingredients. Base: water or milk. Options: mango, berries, orange, mint, cucumber or strawberry.",
        descEs: "Hazlo a tu gusto eligiendo hasta dos ingredientes. Base: agua o leche. Ingredientes: mango, frutos rojos, naranja, hierbabuena, pepino o fresa.",
      },
    ],
  },
  {
    id: "apapacho-am",
    label: "El Apapacho",
    labelEs: "El Apapacho",
    emoji: "🍩",
    items: [
      {
        name: "Churros",
        price: "$100",
        desc: "Crispy churros served warm with sugar & cinnamon. Pick your topping: dulce de leche or Nutella.",
        descEs: "Churros crujientes con azúcar y canela. A elegir: dulce de leche o nutella.",
        badge: "fanFav",
      },
      {
        name: "Buñuelos",
        price: "$80",
        desc: "Mexican fritters served with honey.",
        descEs: "Buñuelos servidos con miel.",
      },
      {
        name: "Pan de Elote",
        price: "$100",
        desc: "Traditional Mexican-style sweet corn cake.",
        descEs: "Pan de elote tradicional hecho en casa.",
      },
      {
        name: "Mini Delice",
        price: "$170",
        desc: "Mini passion fruit crème brûlée, mini lemon pie, and mini chocolate mousse.",
        descEs: "Mini crème brûlée de maracuyá, mini lemon pie y mini mousse de chocolate.",
        img: "/images/food-dessert.jpg",
      },
    ],
  },
];

/* ════════════════════════════════════════════════════════
   PM — DINNER MENU (15:01–23:00)
════════════════════════════════════════════════════════ */
export const PM_FOOD: MenuCategory[] = [
  {
    id: "bites",
    label: "Jungle Bites",
    labelEs: "Pa’ Picar",
    emoji: "🥑",
    items: [
      {
        name: "Guacamole",
        price: "$150",
        desc: "Avocado, tomato, onion, lime, and a pinch of salt and pepper.",
        descEs: "Aguacate, jitomate, cebolla, limón y un toque de sal y pimienta.",
      },
      {
        name: "God Save the Queen",
        price: "$220",
        desc: "Fish sticks served with french fries and tartar sauce.",
        descEs: "Fish sticks acompañados con papas a la francesa y salsa tártara.",
        badge: "fanFav",
        img: "/images/food-fish.jpg",
      },
      {
        name: "Los Anillos de la Mafia",
        price: "$190",
        desc: "Battered calamari rings served with tartar sauce.",
        descEs: "Aros de calamar capeados, acompañados con salsa tártara.",
      },
      {
        name: "Elote con Flow",
        price: "$140",
        desc: "Corn ribs marinated and served with our house dipping sauce.",
        descEs: "Costillitas de elote marinadas y servidas con salsa de la casa para chopear.",
      },
      {
        name: "Las Mamadoras",
        price: "$160",
        desc: "Home-made French fries topped with truffle mayo and parmesan cheese.",
        descEs: "Orden de papas a la francesa con mayonesa de trufas hecha en casa y queso parmesano fresco.",
        badge: "mustTry",
      },
      {
        name: "Tiradito Cuadril",
        price: "$260",
        desc: "Grilled picanha slices over ponzu sauce and avocado cream.",
        descEs: "Láminas de picaña a la parrilla en salsa ponzu y cremoso de aguacate.",
        badge: "premium",
      },
    ],
  },
  {
    id: "fit",
    label: "Ñembo Fit",
    labelEs: "Ñembo Fit",
    emoji: "🥗",
    items: [
      {
        name: "Caesar Salad",
        price: "$220",
        desc: "Grilled chicken, crispy bacon, on romaine lettuce leaves, house Caesar dressing, and shaved parmesan.",
        descEs: "Pollo a la plancha, tocino crujiente sobre hojas de lechuga orejona, aderezo césar hecho en casa y láminas de parmesano.",
      },
      {
        name: "Greek Salad",
        price: "$180",
        desc: "Mixed greens, black olives, goat cheese spheres, cucumber slices, cherry tomatoes, walnuts, and house vinaigrette.",
        descEs: "Mix de verdes, aceitunas negras, esferas de queso de cabra, láminas de pepino, tomates cherry, nueces y vinagreta de la casa.",
        extra: "Add chicken +$40",
        extraEs: "Agrégale pollo +$40",
        img: "/images/food-greek-salad.jpg",
      },
      {
        name: "Tropicool Salad",
        price: "$180",
        desc: "Mixed greens, cucumber slices, cherry tomatoes, seasonal fruit, and tzatziki.",
        descEs: "Mix de verdes, láminas de pepino, tomate cherry, fruta de temporada y tzatziki.",
        extra: "Add chicken +$40",
        extraEs: "Agrégale pollo +$40",
      },
      {
        name: "Cauli Power",
        price: "$180",
        desc: "Grilled cauliflower slices on a bed of romesco sauce.",
        descEs: "Láminas de coliflor a la parrilla en un espejo de salsa romesco.",
      },
    ],
  },
  {
    id: "rolls",
    label: "¡Qué Rollo!",
    labelEs: "¡Qué Rollo!",
    emoji: "🌀",
    items: [
      {
        name: "Rollos Vietnamitas",
        price: "$150",
        desc: "Rice paper filled with lettuce, purple cabbage, rice noodles, mint leaves, carrot, avocado, and cucumber. Served with our signature spicy orange sauce. (3 pieces)",
        descEs: "Papel de arroz relleno con lechuga, col morada, fideos de arroz, hojas de menta, zanahoria, aguacate y pepino. Con nuestra salsa especial de naranja picosita. (3 piezas)",
        extra: "Add shrimp +$30",
        extraEs: "Con camarón +$30",
        img: "/images/food-vietnamese-rolls.jpg",
      },
      {
        name: "Spring Rolls",
        price: "$160",
        desc: "Fried rolls filled with bell peppers, bean sprouts, mushrooms, onion, toasted peanuts, and purple cabbage. (3 pieces)",
        descEs: "Fritos, rellenos con pimientos, brotes de soya, champiñones, cebolla, cacahuates tostados y col morada. (3 piezas)",
        extra: "Add shrimp +$30",
        extraEs: "Con camarón +$30",
        img: "/images/food-spring-rolls.jpg",
      },
      {
        name: "Filadeli Roll",
        price: "$180",
        desc: "Philadelphia cheese, cucumber, carrot, avocado, shrimp, and chaya leaf — lovingly wrapped in rice paper.",
        descEs: "Queso philadelphia, pepino, zanahoria, aguacate, camarón y hoja de chaya, envuelto con amor en hoja de arroz.",
        badge: "signature",
        img: "/images/food-filadeli-roll.jpg",
      },
    ],
  },
  {
    id: "alfa",
    label: "Platos Alfa",
    labelEs: "Platos Alfa",
    emoji: "🔥",
    items: [
      {
        name: "El Cuadrilatero",
        price: "$399",
        desc: "Grilled picanha served over mashed potatoes, sweet potato sticks, and mushroom gravy.",
        descEs: "Picaña a la parrilla en espejo de puré de papa, bastones de camote y gravy de champiñones.",
        badge: "premium",
      },
      {
        name: "Pollo Olímpico",
        price: "$220",
        desc: "Herb-marinated grilled chicken skewers, served with tzatziki and a bed of fresh greens.",
        descEs: "Brochetas de pollo adobado a las finas hierbas, acompañadas con tzatziki y ensalada de hojas verdes.",
      },
      {
        name: "Ramen del Mar",
        price: "$240",
        desc: "Our take on ramen: rice noodles, miso paste, our magical broth, breaded shrimp, egg, corn, mushrooms, and spinach.",
        descEs: "Nuestra versión de ramen, con fideos de arroz, pasta miso, caldito mágico, camarón empanizado, huevo, elote, champiñones y espinaca.",
      },
      {
        name: "Barba-Ramen",
        price: "$260",
        desc: "Our take on ramen: rice noodles, miso paste, our magical broth, soy-marinated egg, scallions, and our famous picanha barbacoa.",
        descEs: "Nuestra versión de ramen, con fideos de arroz, pasta miso, caldito mágico, huevo encurtido en soya, cebollín y nuestra famosa barbacoa de picaña.",
        badge: "signature",
      },
      {
        name: "Las Orejonas",
        price: "$360",
        desc: "Argentinian-style milanesa, served with fries, salad and grandma’s home-made chimichurri. Recommended for two — but go for it solo if you dare!",
        descEs: "Milanesa estilo argentino, servida con papas fritas, ensalada y el chimi casero de la abuela. Si te animas solo, date. Pero lo recomendamos para 2 personas.",
        badge: "forTwo",
      },
    ],
  },
  {
    id: "burguer",
    label: "A la Burguer",
    labelEs: "A la Burguer",
    emoji: "🍔",
    items: [
      {
        name: "La Bacon",
        price: "$210",
        desc: "Homemade bun, Angus beef, crispy bacon, manchego cheese, tomato, lettuce, and red onion.",
        descEs: "Pan hecho en casa, carne angus artesanal, tocino crujiente, queso manchego, jitomate, lechuga y cebolla morada.",
      },
      {
        name: "La Trufada",
        price: "$220",
        desc: "Homemade bun, Angus beef, truffle mayo, mushrooms, manchego cheese, and crispy onion.",
        descEs: "Pan hecho en casa, carne angus artesanal, mayonesa de trufas, champiñones, queso manchego y cebolla crispy.",
        badge: "signature",
        img: "/images/food-burger.jpg",
      },
      {
        name: "La Smash",
        price: "$199",
        desc: "Homemade bun, double beef slider with cheddar and American cheese, lettuce, and pickles.",
        descEs: "Pan hecho en casa, doble slider de carne angus artesanal, queso cheddar y americano, lechuga y pepinillos.",
        extra: "All served with house fries · swap for sweet potato fries +$25",
        extraEs: "Con papas a la francesa hechas en casa · cámbialas por papas de camote +$25",
      },
    ],
  },
  {
    id: "comal",
    label: "Los del Comal",
    labelEs: "Los del Comal",
    emoji: "🌮",
    items: [
      {
        name: "Los Señores Tacos — Land",
        price: "$230",
        desc: "Wood-fired picanha barbacoa, slow-cooked for 6 hours, served on handmade blue corn tortillas. (3 pieces) · A caballo: add 2 eggs +$20",
        descEs: "De la tierra: barbacoa de picaña sellada a la leña, cocida a fuego lento por 6 horas, servida en tortillas de maíz azul hechas a mano. (3 piezas) · A caballo: agrégale 2 huevos +$20",
        badge: "signature",
      },
      {
        name: "Los Señores Tacos — Sea",
        price: "$210",
        desc: "Garlic shrimp on a bed of guacamole, served on handmade blue corn tortillas. (3 pieces)",
        descEs: "Del mar: camarones al ajillo en espejo de guacamole, servidos en tortillas de maíz azul hechas a mano. (3 piezas)",
        img: "/images/food-shrimp-tacos.jpg",
        badge: "mustTry",
      },
      {
        name: "Las Quekas",
        price: "$180",
        desc: "Blue corn quesadillas with chaya leaf, filled with ajillo shrimp (2), huitlacoche (2), or mixtas (2). Served with mini guacamole.",
        descEs: "Quesadillas de maíz azul con hoja de chaya, rellenas de camarón al ajillo (2), huitlacoche (2) o mixtas (2). Se acompañan con mini guacamole.",
      },
      {
        name: "Las Keto-Quekas",
        price: "$230",
        desc: "Mozzarella cheese crusts filled with our slow-cooked picanha barbacoa. (2 pieces)",
        descEs: "Costras de queso mozzarella rellenas de nuestra barbacoa de picaña. (2 piezas)",
        badge: "glutenFree",
      },
    ],
  },
  {
    id: "apapacho-pm",
    label: "El Apapacho",
    labelEs: "El Apapacho",
    emoji: "🍰",
    items: [
      {
        name: "Passion Fruit Crème Brûlée",
        price: "$160",
        desc: "Silky crème brûlée with tropical passion fruit.",
        descEs: "Crème brûlée de maracuyá.",
      },
      {
        name: "Lemon Pie",
        price: "$160",
        desc: "Classic lemon pie, made in-house.",
        descEs: "Lemon pie hecho en casa.",
      },
      {
        name: "Chocolate Mousse",
        price: "$130",
        desc: "Rich chocolate mousse.",
        descEs: "Mousse de chocolate.",
      },
      {
        name: "Mini Delights",
        price: "$180",
        desc: "For those cravings: mini passion fruit crème brûlée, mini lemon pie, and mini chocolate mousse.",
        descEs: "Pa’ que no te quedes con el antojo: mini crème brûlée de maracuyá, mini lemon pie y mini mousse de chocolate.",
        badge: "fanFav",
        img: "/images/food-dessert.jpg",
      },
      {
        name: "Pan de Elote",
        price: "$120",
        desc: "Mexican corn bread, made in-house.",
        descEs: "Pan de elote hecho en casa.",
      },
    ],
  },
];

/* ════════════════════════════════════════════════════════
   DRINKS — "Bebidas y otros menjurges" (Marzo 26 card)
════════════════════════════════════════════════════════ */
export const DRINKS: MenuCategory[] = [
  {
    id: "jungla",
    label: "Los de la Jungla",
    labelEs: "Los de la Jungla",
    emoji: "🍸",
    items: [
      {
        name: "El Spritz Franchute",
        price: "$200",
        desc: "St Germain, sparkling water, and prosecco.",
        descEs: "St Germain, agua mineral y prosecco.",
      },
      {
        name: "El Hipster Spritz",
        price: "$180",
        desc: "Matcha tea, sparkling water, Cointreau, and prosecco.",
        descEs: "Té de matcha, agua mineral, cointreau y prosecco.",
        img: "/images/drink-matcha-cocktail.jpg",
      },
      {
        name: "Es Five O’Clock",
        price: "$180",
        desc: "Gin, peach black tea, tonic water, dill, and cucumber.",
        descEs: "Gin, té negro de durazno, agua tónica, eneldo y pepino.",
      },
      {
        name: "Queen’s Revenge",
        price: "$180",
        desc: "Gin, guava juice, ginger syrup, and tonic water.",
        descEs: "Gin, jugo de guayaba, jarabe de jengibre y agua tónica.",
      },
      {
        name: "Pa’ Que Amarre",
        price: "$180",
        desc: "Tequila, mango, Controy, serrano chili, with fruit jelly and árbol chili.",
        descEs: "Tequila, mango, controy, chile serrano, con gelatina de frutas y chile de árbol.",
        badge: "signature",
      },
      {
        name: "Mojito de Cilantro",
        price: "$160",
        desc: "White rum, cilantro, syrup, lime juice, and sparkling water.",
        descEs: "Ron blanco, cilantro, jarabe, jugo de limón y agua mineral.",
      },
      {
        name: "Flor de Coco",
        price: "$200",
        desc: "Aged rum, St. Germain, passion fruit, lime juice, syrup, and coconut milk.",
        descEs: "Ron añejo, St. Germain, maracuyá, jugo de limón, jarabe y leche de coco.",
      },
      {
        name: "From Rusia with Love",
        price: "$170",
        desc: "Vodka, lime, sugar, and red berries.",
        descEs: "Vodka, limón, azúcar y frutos rojos.",
      },
      {
        name: "Espresso Martini",
        price: "$170",
        desc: "Espresso shot, coffee liqueur and vodka, shaken until smooth.",
        descEs: "Shot de espresso, licor de café y vodka bien shakeado.",
        badge: "fanFav",
        img: "/images/drink-espresso-martini.jpg",
      },
      {
        name: "Passion Mimosa",
        price: "$140",
        desc: "Mango juice, passion fruit juice, topped with sparkling wine.",
        descEs: "Jugo de mango, jugo de maracuyá y espumante.",
      },
    ],
  },
  {
    id: "mezcal-bar",
    label: "Mezcal Bar",
    labelEs: "Mezcal Bar",
    emoji: "🔮",
    items: [
      {
        name: "Golden Mezcal",
        price: "$180",
        desc: "Mezcal, coconut milk, turmeric, and orange juice.",
        descEs: "Mezcal, leche de coco, cúrcuma y jugo de naranja.",
      },
      {
        name: "Mezcalito Zen",
        price: "$180",
        desc: "Mezcal, matcha tea, sencha tea, lime juice, and ginger.",
        descEs: "Mezcal, té de matcha, té de sencha, jugo de limón y jengibre.",
        img: "/images/drink-mezcalito-zen.jpg",
      },
      {
        name: "Carajillo Místico",
        price: "$180",
        desc: "Mezcal, a shot of espresso, agave honey, and an orange twist.",
        descEs: "Mezcal, shot de espresso, miel de agave y twist de naranja.",
        badge: "mustTry",
      },
      {
        name: "Jamaica Brava",
        price: "$180",
        desc: "Mezcal, hibiscus syrup with chili, mint, and lime.",
        descEs: "Mezcal, jarabe de jamaica y chile, hierbabuena y limón.",
      },
      {
        name: "House Mezcal — Magic Shot",
        price: "$100",
        desc: "One shot of our house mezcal.",
        descEs: "1 shot de mezcal de la casa.",
      },
      {
        name: "Mezcal Tasting",
        price: "$240",
        desc: "Artisanal Oaxacan mezcal tasting: Jabalí, Tepeztate, Coyote, and young Espadín, served with orange and worm salt. (1 oz each)",
        descEs: "Degustación de mezcal artesanal oaxaqueño: jabalí, tepeztate, coyote y espadín joven, acompañados con sal de gusano y naranja. (1 oz c/u)",
        badge: "premium",
        img: "/images/drink-mezcal-flight.jpg",
      },
    ],
  },
  {
    id: "botanical",
    label: "Botanical Drinks",
    labelEs: "Botanical Drinks",
    emoji: "🌿",
    items: [
      {
        name: "Like a Virgin",
        price: "$90",
        desc: "Lime, passion fruit, mint, syrup, and soda.",
        descEs: "Limón, maracuyá, hierbabuena, jarabe y soda.",
        img: "/images/drink-duo-mocktails.jpg",
      },
      {
        name: "Un Suerito con Estilo",
        price: "$90",
        desc: "Pineapple, cucumber, water, syrup, salt, mint, and turmeric.",
        descEs: "Piña, pepino, agua, jarabe, sal, hierbabuena y cúrcuma.",
      },
      {
        name: "Pa’ la Calors",
        price: "$90",
        desc: "Blended red berries and oranges with mint and syrup.",
        descEs: "Frutos rojos y naranjas batidas con hierbabuena y jarabe.",
        img: "/images/drink-red-berry.jpg",
      },
      {
        name: "Pink Coco Crush",
        price: "$90",
        desc: "Coconut cream, guava juice, grenadine syrup, basil, and lime.",
        descEs: "Crema de coco, jugo de guayaba, jarabe de granadina, albahaca y limón.",
        badge: "fanFav",
        img: "/images/drink-pink-topdown.jpg",
      },
      {
        name: "Mix Tropical",
        price: "$90",
        desc: "Orange juice, lime juice, passion fruit, pineapple, grenadine syrup, basil, and mint.",
        descEs: "Jugo de naranja, jugo de limón, maracuyá, piña, jarabe de granadina, albahaca y hierbabuena.",
      },
    ],
  },
  {
    id: "normalito",
    label: "Lo Normalito",
    labelEs: "Lo Normalito",
    emoji: "🥤",
    items: [
      { name: "Soft Drinks", price: "$40", desc: "Coca-Cola, Coca-Cola Light, Fanta and Sprite.", descEs: "Coca-Cola, Coca-Cola Light, Fanta y Sprite." },
      { name: "Sparkling Water", price: "$40" },
      { name: "Natural Water", price: "$40", desc: "Rompe olas, ½ liter.", descEs: "Rompe olas, ½ litro." },
      { name: "Lemonade / Orangeade", price: "$55", desc: "Natural or sparkling.", descEs: "Natural o mineral." },
      { name: "Seasonal Fruit Water", price: "$60", desc: "Ask for our options.", descEs: "Pregunta por nuestra variedad." },
      { name: "Kombucha", price: "$90", desc: "Made in Mahahual — ask for our options.", descEs: "Made in Mahahual — pregunta por nuestra variedad." },
      { name: "Green Juice", price: "$90", desc: "Pineapple, celery, spinach, lime, ginger, and a water base.", descEs: "Piña, apio, espinaca, limón, jengibre y base de agua." },
      { name: "Perfect Frappe", price: "$90", desc: "Choose up to two ingredients: mango, mixed berries, orange, mint, cucumber, banana, passion fruit, pineapple or strawberry. Base: water or milk.", descEs: "Hazlo a tu gusto: elige hasta dos ingredientes (mango, frutos rojos, naranja, hierbabuena, pepino, plátano, piña, maracuyá o fresa). Base: agua o leche." },
    ],
  },
  {
    id: "cafe",
    label: "Técitos y Cafécitos",
    labelEs: "Técitos y Cafécitos",
    emoji: "☕",
    items: [
      { name: "Americano", price: "$55", desc: "Hot or iced.", descEs: "Frío o caliente." },
      { name: "Espresso", price: "$50" },
      { name: "Capuccino", price: "$60" },
      { name: "Latte", price: "$60", desc: "Hot or iced.", descEs: "Frío o caliente." },
      { name: "Matcha Latte", price: "$60", desc: "Matcha tea with frothed milk. Hot or iced.", descEs: "Té de matcha con leche cremada. Frío o caliente.", badge: "fanFav" },
      { name: "Té", price: "$50", desc: "Ask for our selection. Hot or iced.", descEs: "Pregunta por nuestra variedad. Frío o caliente." },
      { name: "Leche Dorada", price: "$60", desc: "Milk, turmeric, cinnamon, ginger, and black pepper. Hot or iced.", descEs: "Leche, cúrcuma, canela, jengibre y pimienta negra. Frío o caliente." },
      { name: "Extras", price: "+$15 / +$25", desc: "Plant-based milk +$15 (ask for options) · espresso shot +$25.", descEs: "Leche vegetal +$15 (pregunta por nuestra variedad) · shot de espresso +$25." },
    ],
  },
  {
    id: "chelas",
    label: "Chelas",
    labelEs: "Chelas",
    emoji: "🍺",
    items: [
      { name: "Big Bottles (Caguamas)", price: "$150", desc: "Indio, Heineken, XX Lager.", descEs: "Indio, Heineken, XX Lager." },
      { name: "Superior — Big Bottle", price: "$120" },
      { name: "Chelita", price: "$60", desc: "Amstel, Ultra, Heineken, Heineken Silver, Bohemia Cristal / Clara / Obscura, Indio, Tecate Light, XX Lager, XX Ambar, Heineken 00.", descEs: "Amstel, Ultra, Heineken, Heineken Silver, Bohemia Cristal / Clara / Obscura, Indio, Tecate Light, XX Lager, XX Ambar, Heineken 00." },
      { name: "Panteón Craft Beer", price: "$120", desc: "Made in Mahahual — ask for our options.", descEs: "Made in Mahahual — pregunta por nuestra variedad.", badge: "mustTry" },
      { name: "Michelada", price: "$35" },
      { name: "Chelada", price: "$25" },
      { name: "Ojo Rojo", price: "$50" },
      {
        name: "Levanta Muertos",
        price: "$80",
        desc: "Ojo Rojo especial: spicy broth with dark sauces, clamato, a shrimp skewer with worm salt, and pickled cucumber.",
        descEs: "Ojo Rojo especial: caldito especial, salsas negras, clamato, brocheta con camaróncitos en sal de gusano y pepino encurtido.",
        badge: "signature",
        img: "/images/drink-levanta-muertos.jpg",
      },
    ],
  },
  {
    id: "clasicos",
    label: "Los Clásicos",
    labelEs: "Los Clásicos",
    emoji: "🍹",
    items: [
      { name: "Mojito", price: "$140" },
      { name: "Margarita", price: "$160" },
      { name: "Mezcalita", price: "$160" },
      { name: "Daiquiri", price: "$140" },
      { name: "Piña Colada", price: "$140" },
      { name: "Gin Tonic", price: "$150" },
      { name: "Cuba Libre", price: "$140" },
      { name: "Negroni", price: "$200" },
      { name: "Aperol Spritz", price: "$180" },
    ],
  },
  {
    id: "vinos",
    label: "Vinos",
    labelEs: "Vinos",
    emoji: "🍷",
    items: [
      { name: "Casa Madero 3V (México) — Tinto", price: "$990" },
      { name: "Hormiga Negra (Argentina) — Malbec / Cabernet", price: "$500" },
      { name: "Casa Madero 2V (México) — Blanco", price: "$750" },
      { name: "Vino de la Casa", price: "$100 / $350", desc: "By the glass $100 · bottle $350. Ask for our selection.", descEs: "Por copa $100 · botella $350. Pregunta por nuestra variedad." },
    ],
  },
];

/* Destilados & Co. — spirits by the glass */
export const SPIRITS: MenuCategory[] = [
  {
    id: "tequila",
    label: "Tequila",
    labelEs: "Tequila",
    emoji: "🌵",
    items: [
      { name: "Don Julio 70", price: "$200" },
      { name: "Don Julio Blanco", price: "$160" },
      { name: "Don Julio Reposado", price: "$180" },
      { name: "Jose Cuervo Especial", price: "$130" },
      { name: "Jose Cuervo Tradicional Reposado", price: "$150" },
      { name: "Jose Cuervo Tradicional Blanco", price: "$150" },
      { name: "Maestro Dobel Diamante", price: "$180" },
      { name: "1800 Reposado", price: "$180" },
    ],
  },
  {
    id: "mezcal",
    label: "Mezcal",
    labelEs: "Mezcal",
    emoji: "🐛",
    items: [
      { name: "M21 Espadín Joven", price: "$130" },
      { name: "M21 Pechuga", price: "$160" },
      { name: "M21 Tóbala", price: "$195" },
      { name: "400 Conejos Joven", price: "$150" },
      { name: "400 Conejos Reposado", price: "$150" },
      { name: "Bruxo Inicial", price: "$160" },
      { name: "Ojo de Tigre", price: "$160" },
    ],
  },
  {
    id: "gin",
    label: "Gin",
    labelEs: "Gin",
    emoji: "🫒",
    items: [
      { name: "Bombay Sapphire", price: "$150" },
      { name: "Hendricks", price: "$180" },
      { name: "Tanqueray", price: "$160" },
      { name: "Diega Amarillo", price: "$130" },
    ],
  },
  {
    id: "ron",
    label: "Ron",
    labelEs: "Ron",
    emoji: "🏴‍☠️",
    items: [
      { name: "Zacapa 23 Años", price: "$200" },
      { name: "Bacardi Blanco", price: "$130" },
      { name: "Bacardi Añejo", price: "$130" },
      { name: "Havana 5 Años", price: "$160" },
      { name: "Havana 7 Años", price: "$130" },
      { name: "Kraken", price: "$130" },
    ],
  },
  {
    id: "vodka",
    label: "Vodka",
    labelEs: "Vodka",
    emoji: "❄️",
    items: [
      { name: "Titos", price: "$150" },
      { name: "Smirnoff", price: "$130" },
      { name: "Grey Goose", price: "$170" },
      { name: "Absolut", price: "$130" },
    ],
  },
  {
    id: "whisky",
    label: "Whisky",
    labelEs: "Whisky",
    emoji: "🥃",
    items: [
      { name: "Johnnie Walker Red", price: "$140" },
      { name: "Johnnie Walker Black", price: "$180" },
      { name: "Jim Beam", price: "$140" },
      { name: "Buchanans 12 Años", price: "$160" },
      { name: "Jack Daniels", price: "$150" },
    ],
  },
  {
    id: "licores",
    label: "Licores",
    labelEs: "Licores",
    emoji: "🍯",
    items: [
      { name: "Amaretto Disaronno", price: "$140" },
      { name: "Baileys", price: "$120" },
      { name: "Campari", price: "$120" },
      { name: "Cinzano", price: "$120" },
      { name: "Fernet", price: "$140" },
      { name: "Jägermeister", price: "$120" },
      { name: "Licor 43", price: "$140" },
      { name: "Vaccari Blanco", price: "$120" },
      { name: "Vaccari Negro", price: "$120" },
    ],
  },
];

export const FOOD_BY_SERVICE: Record<ServiceKey, MenuCategory[]> = {
  am: AM_FOOD,
  pm: PM_FOOD,
};
