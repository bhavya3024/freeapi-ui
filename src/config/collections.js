// Single source of truth for the public collections shown in the sidebar, home page and page headers.
// `card` picks the grid layout (and its matching skeleton) from Cards.js.
export const COLLECTIONS = [
  {
    slug: 'users',
    name: 'Users',
    icon: 'users',
    tone: 'blue',
    description: 'Random profiles with contact details, location and portraits.',
    card: 'profile',
  },
  {
    slug: 'products',
    name: 'Products',
    icon: 'bag',
    tone: 'emerald',
    description: 'A store catalog with prices, discounts, ratings and stock levels.',
    card: 'media',
  },
  {
    slug: 'books',
    name: 'Books',
    icon: 'book',
    tone: 'violet',
    description: 'Titles, authors, publishers and descriptions from Google Books.',
    card: 'horizontal',
  },
  {
    slug: 'stocks',
    name: 'Stocks',
    icon: 'trending',
    tone: 'rose',
    description: 'Indian listed companies with price, valuation and return ratios.',
    card: 'stat',
  },
  {
    slug: 'jokes',
    name: 'Jokes',
    icon: 'smile',
    tone: 'amber',
    description: 'A large collection of one-liners, tagged by category.',
    card: 'text',
  },
  {
    slug: 'quotes',
    name: 'Quotes',
    icon: 'quote',
    tone: 'indigo',
    description: 'Famous quotes with authors and topic tags.',
    card: 'text',
  },
  {
    slug: 'cats',
    name: 'Cats',
    icon: 'cat',
    tone: 'pink',
    description: 'Cat breeds with temperament scores, origin and lifespan.',
    card: 'media',
  },
  {
    slug: 'dogs',
    name: 'Dogs',
    icon: 'dog',
    tone: 'orange',
    description: 'Dog breeds with size, temperament and breed group.',
    card: 'media',
  },
  {
    slug: 'meals',
    name: 'Meals',
    icon: 'utensils',
    tone: 'teal',
    description: 'Recipes with ingredients, instructions and cuisine.',
    card: 'media',
  },
  {
    slug: 'videos',
    name: 'Videos',
    icon: 'video',
    tone: 'red',
    description: 'YouTube videos with view, like and comment counts.',
    card: 'media',
    cardAspect: 'aspect-video',
    titleLines: 2,
  },
];

export const CHAT_APP = {
  slug: 'chat',
  name: 'Chat',
  icon: 'chat',
  tone: 'fuchsia',
  description: 'Authenticated one-to-one and group messaging.',
};

export function getCollection(slug) {
  return COLLECTIONS.find((c) => c.slug === slug);
}
