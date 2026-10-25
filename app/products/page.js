'use client';
import { getProducts } from "../../src/apis/products";
import Collection from "../../src/components/Collection";
import { MediaCard } from "../../src/components/Cards";
import Icon from "../../src/components/Icon";
import ShimmerImage from "../../src/components/ShimmerImage";
import { Badge } from "../../src/components/ui";
import { stockTone } from "../../src/lib/format";

const Price = ({ product }) => (
  <span className="flex items-center gap-1.5">
    <span className="font-semibold tabular-nums text-fg">${product.price}</span>
    {product.discountPercentage > 0 && (
      <span className="text-xs font-medium tabular-nums text-emerald-600 dark:text-emerald-400">
        −{Math.round(product.discountPercentage)}%
      </span>
    )}
  </span>
);

const Rating = ({ value }) => (
  <span className="inline-flex items-center gap-1 text-sm tabular-nums text-muted">
    <Icon name="star" className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
    {value ?? '—'}
  </span>
);

const columns = [
  {
    key: 'product',
    label: 'Product',
    skeleton: 'media',
    render: (p) => (
      <div className="flex items-center gap-3">
        <ShimmerImage src={p.thumbnail} alt="" fallbackIcon="bag" checkStatus className="h-10 w-10 shrink-0 rounded-lg border border-line" />
        <div className="min-w-0">
          <p className="max-w-60 truncate font-medium text-fg">{p.title}</p>
          <p className="truncate text-xs text-subtle">{p.brand || 'Generic'}</p>
        </div>
      </div>
    ),
  },
  { key: 'category', label: 'Category', skeleton: 'badge', render: (p) => <Badge className="capitalize">{p.category}</Badge> },
  { key: 'price', label: 'Price', render: (p) => <Price product={p} /> },
  { key: 'rating', label: 'Rating', render: (p) => <Rating value={p.rating} /> },
  {
    key: 'stock',
    label: 'Stock',
    align: 'right',
    skeleton: 'badge',
    render: (p) => <Badge tone={stockTone(p.stock)}>{p.stock > 0 ? `${p.stock} in stock` : 'Sold out'}</Badge>,
  },
];

const renderCard = (p) => (
  <MediaCard
    image={p.thumbnail}
    alt={p.title}
    fallbackIcon="bag"
    checkStatus
    overlay={
      p.stock <= 10 && (
        <span className="absolute left-3 top-3 rounded-md bg-black/65 px-2 py-0.5 text-xs font-medium text-white backdrop-blur">
          {p.stock > 0 ? `Only ${p.stock} left` : 'Sold out'}
        </span>
      )
    }
    title={p.title}
    subtitle={<span className="capitalize">{[p.brand, p.category].filter(Boolean).join(' · ')}</span>}
    meta={
      <>
        <Price product={p} />
        <Rating value={p.rating} />
      </>
    }
  />
);

export default function ProductsPage() {
  return (
    <Collection
      slug="products"
      fetchPage={getProducts}
      getKey={(p) => p.id}
      getHref={(p) => `/products/${p.id}`}
      renderCard={renderCard}
      columns={columns}
    />
  );
}
