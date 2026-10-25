'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { getProductById } from "../../../src/apis/products";
import { DetailBody, DetailLayout, Hero, HeroTitle, InfoList, InfoRow, Panel } from "../../../src/components/Detail";
import Icon from "../../../src/components/Icon";
import ShimmerImage from "../../../src/components/ShimmerImage";
import { Badge } from "../../../src/components/ui";
import { useResource } from "../../../src/hooks/useFetch";
import { stockTone } from "../../../src/lib/format";
import ProductSkeleton from "./skeleton";

function Gallery({ product }) {
  const images = [...new Set([product.thumbnail, ...(product.images || [])].filter(Boolean))];
  const [selected, setSelected] = useState(images[0]);
  // FreeAPI's product images live on a CDN that now 404s; hide thumbnails that fail
  const [failed, setFailed] = useState(() => new Set());
  const markFailed = (src) => setFailed((prev) => new Set(prev).add(src));
  const thumbs = images.filter((src) => !failed.has(src));

  return (
    <div className="space-y-3">
      <ShimmerImage
        src={selected}
        alt={product.title}
        checkStatus
        onFailed={markFailed}
        fallbackIcon="bag"
        fit="contain"
        className="aspect-square w-full rounded-xl border border-line"
      />
      {thumbs.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {thumbs.map((src) => (
            <button
              key={src}
              type="button"
              onClick={() => setSelected(src)}
              aria-label="Show image"
              aria-pressed={src === selected}
              className={`shrink-0 cursor-pointer rounded-lg border-2 p-0.5 transition-colors ${
                src === selected ? 'border-accent' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <ShimmerImage src={src} checkStatus onFailed={markFailed} className="h-14 w-14 rounded-md" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Stars({ rating = 0 }) {
  return (
    <span className="flex items-center" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <Icon
          key={n}
          name="star"
          className={`w-4 h-4 ${n <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-surface-3 text-surface-3'}`}
        />
      ))}
    </span>
  );
}

function ProductDetail({ product }) {
  const discount = product.discountPercentage || 0;
  const finalPrice = product.price * (1 - discount / 100);

  return (
    <>
      <Hero mediaClassName="w-full md:w-80" media={<Gallery product={product} />}>
        <HeroTitle
          badges={
            <>
              <Badge tone="emerald" className="capitalize">
                {product.category}
              </Badge>
              <Badge className="font-mono">SKU {product.id}</Badge>
            </>
          }
          title={product.title}
          subtitle={product.brand}
        />
        <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-3xl font-semibold tabular-nums text-fg">${finalPrice.toFixed(2)}</span>
          {discount > 0 && (
            <>
              <span className="text-base tabular-nums text-subtle line-through">${product.price}</span>
              <Badge tone="emerald">Save {Math.round(discount)}%</Badge>
            </>
          )}
        </div>
        <div className="mt-2 flex h-5 items-center gap-2 text-sm text-muted">
          <Stars rating={product.rating} />
          <span className="tabular-nums">{product.rating} out of 5</span>
        </div>
        <p className="mt-4 text-sm leading-6 text-muted">{product.description}</p>
        <div className="mt-5">
          <Badge tone={stockTone(product.stock)}>
            {product.stock > 10 ? 'In stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Sold out'}
          </Badge>
        </div>
      </Hero>

      <Panel title="Specifications" icon="tag">
        <InfoList>
          <InfoRow label="Brand">{product.brand}</InfoRow>
          <InfoRow label="Category">
            <span className="capitalize">{product.category}</span>
          </InfoRow>
          <InfoRow label="List price">{`$${product.price}`}</InfoRow>
          <InfoRow label="Discount">{discount ? `${discount}%` : 'None'}</InfoRow>
          <InfoRow label="Rating">{product.rating && `${product.rating} / 5`}</InfoRow>
          <InfoRow label="Units in stock">{product.stock}</InfoRow>
        </InfoList>
      </Panel>
    </>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const resource = useResource(getProductById, id);

  return (
    <DetailLayout slug="products" label="All products">
      <DetailBody resource={resource} noun="product" skeleton={<ProductSkeleton />}>
        {(product) => <ProductDetail product={product} />}
      </DetailBody>
    </DetailLayout>
  );
}
