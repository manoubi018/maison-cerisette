export interface Product {
  id: string
  name: string
  category: string
  price: number
  image: string
  rating: number
  reviews: number
  freshness: "arrived-today" | "arrived-yesterday" | "caught-24h"
  origin: string
  description: string
  taste: string
  recipes: string[]
  cutOptions: string[]
  storageAdvice: string
}

export interface Category {
  id: string
  name: string
  icon: string
  description: string
}

export const categories: Category[] = [
  {
    id: "confitures",
    name: "Confitures & Compotes",
    icon: "CO",
    description: "Preparations artisanales aux cerises de saison",
  },
  {
    id: "liqueurs",
    name: "Liqueurs & Spiritueux",
    icon: "LI",
    description: "Liqueurs de griotte et creations de degustation",
  },
  {
    id: "chocolats",
    name: "Chocolats & Confiseries",
    icon: "CH",
    description: "Chocolats noirs, cerises confites et douceurs",
  },
  {
    id: "sirops",
    name: "Sirops & Boissons",
    icon: "SI",
    description: "Sirops naturels et boissons gourmandes",
  },
]

export const products: Product[] = [
  {
    id: "1",
    name: "Confiture de Cerise Noire",
    category: "confitures",
    price: 12,
    image: "/product-confiture.jpg",
    rating: 4.9,
    reviews: 128,
    freshness: "arrived-today",
    origin: "Cerises noires du Ventoux",
    description: "Confiture mijotee lentement au cuivre, riche en fruit et peu sucree.",
    taste: "Intense, veloutee, legerement acidulee",
    recipes: ["Tartines du matin", "Fromage blanc", "Plateau de fromages"],
    cutOptions: ["Pot 220g", "Coffret cadeau", "Lot de 3"],
    storageAdvice: "A conserver au frais apres ouverture.",
  },
  {
    id: "2",
    name: "Liqueur de Griotte",
    category: "liqueurs",
    price: 38,
    image: "/product-liqueur.jpg",
    rating: 4.8,
    reviews: 214,
    freshness: "caught-24h",
    origin: "Griottes de Provence",
    description: "Liqueur artisanale vieillie 24 mois en fut pour une finale ronde.",
    taste: "Fruitee, chaude, persistante",
    recipes: ["Digestif frais", "Cocktail signature", "Dessert chocolat"],
    cutOptions: ["Bouteille 50cl", "Coffret degustation", "Emballage cadeau"],
    storageAdvice: "Servir frais et conserver a l'abri de la lumiere.",
  },
  {
    id: "3",
    name: "Truffes Coeur Cerise",
    category: "chocolats",
    price: 24,
    image: "/product-chocolat.jpg",
    rating: 4.7,
    reviews: 76,
    freshness: "arrived-today",
    origin: "Chocolat noir 70%",
    description: "Truffes fondantes au chocolat noir avec coeur de cerise confite.",
    taste: "Cacao profond, fruit confit, texture fondante",
    recipes: ["Cafe gourmand", "Cadeau invite", "Fin de repas"],
    cutOptions: ["Boite 12 pieces", "Boite 24 pieces", "Coffret cadeau"],
    storageAdvice: "Conserver au sec entre 16 et 18 degres.",
  },
  {
    id: "4",
    name: "Sirop de Cerise Sauvage",
    category: "sirops",
    price: 16,
    image: "/product-sirop.jpg",
    rating: 4.6,
    reviews: 58,
    freshness: "arrived-yesterday",
    origin: "Recolte de juin",
    description: "Sirop naturel de cerise sauvage, sans colorant ni conservateur.",
    taste: "Frais, floral, tres aromatique",
    recipes: ["Eau petillante", "Limonade maison", "Cocktail sans alcool"],
    cutOptions: ["Bouteille 50cl", "Lot de 2", "Coffret aperitif"],
    storageAdvice: "A conserver au frais apres ouverture.",
  },
  {
    id: "5",
    name: "Coffret Decouverte Cerisette",
    category: "confitures",
    price: 58,
    image: "/hero-cherries.jpg",
    rating: 4.8,
    reviews: 143,
    freshness: "arrived-today",
    origin: "Assortiment maison",
    description: "Selection de quatre saveurs pour decouvrir les signatures Maison Cerisette.",
    taste: "Gourmand, equilibre, genereux",
    recipes: ["Cadeau gourmand", "Degustation familiale", "Table de fete"],
    cutOptions: ["Coffret 4 produits", "Message cadeau", "Ruban premium"],
    storageAdvice: "Conserver dans un endroit sec et frais.",
  },
  {
    id: "6",
    name: "Tarte Rustique aux Griottes",
    category: "chocolats",
    price: 18,
    image: "/blog-tarte.jpg",
    rating: 4.5,
    reviews: 49,
    freshness: "caught-24h",
    origin: "Patisserie de saison",
    description: "Tarte artisanale aux griottes, preparee en petite serie.",
    taste: "Beurree, acidulee, croustillante",
    recipes: ["Dessert du dimanche", "Gouter", "Cafe gourmand"],
    cutOptions: ["Piece", "Demi-tarte", "Tarte entiere"],
    storageAdvice: "A consommer sous 48h, conserver au frais.",
  },
]
