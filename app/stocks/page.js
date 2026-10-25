'use client';
import { getStocks } from "../../src/apis/stocks";
import Collection from "../../src/components/Collection";
import { StatCard } from "../../src/components/Cards";
import { Badge } from "../../src/components/ui";
import { signTone } from "../../src/lib/format";

const TONE_TEXT = {
  positive: 'text-emerald-600 dark:text-emerald-400',
  negative: 'text-rose-600 dark:text-rose-400',
};

const Ticker = ({ stock }) => (
  <Badge tone="rose" className="font-mono">
    {stock.Symbol}
  </Badge>
);

const columns = [
  {
    key: 'company',
    label: 'Company',
    skeleton: 'lines',
    render: (s) => (
      <div className="min-w-0">
        <p className="max-w-64 truncate font-medium text-fg">{s.Name || 'Unknown company'}</p>
        <p className="font-mono text-xs text-subtle">{s.Symbol}</p>
      </div>
    ),
  },
  { key: 'price', label: 'Price', align: 'right', render: (s) => <span className="font-medium tabular-nums text-fg">{s.CurrentPrice || '—'}</span> },
  { key: 'cap', label: 'Market cap', align: 'right', render: (s) => <span className="whitespace-nowrap tabular-nums text-muted">{s.MarketCap || '—'}</span> },
  { key: 'range', label: '52w high / low', align: 'right', render: (s) => <span className="whitespace-nowrap tabular-nums text-muted">{s.HighLow || '—'}</span> },
  { key: 'pe', label: 'P/E', align: 'right', render: (s) => <span className="tabular-nums text-muted">{s.StockPE || '—'}</span> },
  {
    key: 'roe',
    label: 'ROE',
    align: 'right',
    render: (s) => <span className={`tabular-nums ${TONE_TEXT[signTone(s.ROE)] || 'text-muted'}`}>{s.ROE || '—'}</span>,
  },
  { key: 'yield', label: 'Div. yield', align: 'right', render: (s) => <span className="tabular-nums text-muted">{s.DividendYield || '—'}</span> },
];

const renderCard = (s) => (
  <StatCard
    badge={<Ticker stock={s} />}
    caption={s.ListingDate ? `Listed ${s.ListingDate}` : ''}
    title={s.Name || 'Unknown company'}
    value={s.CurrentPrice || '—'}
    stats={[
      { label: 'Mkt cap', value: s.MarketCap?.replace(' Cr.', ' Cr') },
      { label: 'P/E', value: s.StockPE },
      { label: 'ROE', value: s.ROE, className: TONE_TEXT[signTone(s.ROE)] },
    ]}
  />
);

export default function StocksPage() {
  return (
    <Collection
      slug="stocks"
      fetchPage={getStocks}
      getKey={(s) => s.Symbol}
      getHref={(s) => `/stocks/${encodeURIComponent(s.Symbol)}`}
      renderCard={renderCard}
      columns={columns}
    />
  );
}
