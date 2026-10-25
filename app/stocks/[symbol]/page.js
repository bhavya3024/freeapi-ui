'use client';
import { useParams } from 'next/navigation';
import { getStockBySymbol } from "../../../src/apis/stocks";
import { DetailBody, DetailLayout, HeroTitle, StatTile, heroStyles } from "../../../src/components/Detail";
import { Badge } from "../../../src/components/ui";
import { useResource } from "../../../src/hooks/useFetch";
import { signTone } from "../../../src/lib/format";
import StockSkeleton from "./skeleton";

// "₹ 1,234.5 Cr." -> 1234.5
const toNumber = (value) => {
  const n = Number.parseFloat(String(value ?? '').replace(/[^\d.-]/g, ''));
  return Number.isFinite(n) ? n : null;
};

function RangeBar({ stock }) {
  const [high, low] = String(stock.HighLow || '').split('/').map(toNumber);
  const price = toNumber(stock.CurrentPrice);
  if (high === null || low === null || price === null || high <= low) return null;
  const position = Math.min(100, Math.max(0, ((price - low) / (high - low)) * 100));

  return (
    <div className="mt-6 border-t border-line pt-5">
      <div className="flex justify-between text-xs text-muted">
        <span>
          52w low <span className="font-medium tabular-nums text-fg">{low}</span>
        </span>
        <span>
          52w high <span className="font-medium tabular-nums text-fg">{high}</span>
        </span>
      </div>
      <div className="relative mt-2 h-2 rounded-full bg-surface-3">
        <div className="absolute inset-y-0 left-0 rounded-full bg-rose-500/30" style={{ width: `${position}%` }} />
        <div
          className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-rose-500 shadow"
          style={{ left: `${position}%` }}
          title={`Current price is ${Math.round(position)}% of the way from the 52-week low to the high`}
        />
      </div>
    </div>
  );
}

function StockDetail({ stock }) {
  const price = toNumber(stock.CurrentPrice);
  const book = toNumber(stock.BookValue);
  const priceToBook = price && book ? (price / book).toFixed(2) : null;

  return (
    <>
      <section className={`${heroStyles} animate-fade-in`}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <HeroTitle
              badges={
                <>
                  <Badge tone="rose" className="font-mono">
                    {stock.Symbol}
                  </Badge>
                  {stock.ISIN && <Badge className="font-mono">{stock.ISIN}</Badge>}
                </>
              }
              title={stock.Name}
              subtitle={stock.ListingDate && `Listed ${stock.ListingDate}`}
            />
          </div>
          <div className="shrink-0 sm:w-56 sm:text-right">
            <p className="text-xs font-medium text-muted">Current price</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums text-fg">{stock.CurrentPrice || '—'}</p>
          </div>
        </div>
        <RangeBar stock={stock} />
      </section>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatTile label="Market cap" value={stock.MarketCap} />
        <StatTile label="Stock P/E" value={stock.StockPE} />
        <StatTile label="Book value" value={stock.BookValue} />
        <StatTile label="Price / book" value={priceToBook} />
        <StatTile label="ROCE" value={stock.ROCE} tone={signTone(stock.ROCE)} />
        <StatTile label="ROE" value={stock.ROE} tone={signTone(stock.ROE)} />
        <StatTile label="Dividend yield" value={stock.DividendYield} />
        <StatTile label="Face value" value={stock.FaceValue} />
      </div>
    </>
  );
}

export default function StockDetailPage() {
  const { symbol } = useParams();
  const resource = useResource(getStockBySymbol, symbol);

  return (
    <DetailLayout slug="stocks" label="All stocks">
      <DetailBody resource={resource} noun="stock" skeleton={<StockSkeleton />}>
        {(stock) => <StockDetail stock={stock} />}
      </DetailBody>
    </DetailLayout>
  );
}
