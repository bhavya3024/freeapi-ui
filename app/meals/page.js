'use client';
import { getMeals } from "../../src/apis/meals";
import Collection from "../../src/components/Collection";
import { MediaCard } from "../../src/components/Cards";
import ShimmerImage from "../../src/components/ShimmerImage";
import { Badge } from "../../src/components/ui";

const firstTag = (meal) => meal.strTags?.split(',')[0]?.trim();

const columns = [
  {
    key: 'dish',
    label: 'Dish',
    skeleton: 'media',
    render: (meal) => (
      <div className="flex items-center gap-3">
        <ShimmerImage src={meal.strMealThumb} alt="" fallbackIcon="utensils" className="h-10 w-10 shrink-0 rounded-lg" />
        <p className="max-w-72 truncate font-medium text-fg">{meal.strMeal || 'Untitled dish'}</p>
      </div>
    ),
  },
  {
    key: 'category',
    label: 'Category',
    skeleton: 'badge',
    render: (meal) => <Badge tone="teal">{meal.strCategory || 'General'}</Badge>,
  },
  { key: 'area', label: 'Cuisine', render: (meal) => <span className="text-muted">{meal.strArea || '—'}</span> },
  {
    key: 'instructions',
    label: 'Instructions',
    render: (meal) => <span className="block max-w-80 truncate text-muted">{meal.strInstructions || '—'}</span>,
  },
];

const renderCard = (meal) => (
  <MediaCard
    image={meal.strMealThumb}
    alt={meal.strMeal}
    fallbackIcon="utensils"
    title={meal.strMeal || 'Untitled dish'}
    subtitle={meal.strArea ? `${meal.strArea} cuisine` : '—'}
    meta={
      <>
        <Badge tone="teal">{meal.strCategory || 'General'}</Badge>
        {firstTag(meal) && <span className="truncate text-xs text-subtle">#{firstTag(meal)}</span>}
      </>
    }
  />
);

export default function MealsPage() {
  return (
    <Collection
      slug="meals"
      fetchPage={getMeals}
      getKey={(meal) => meal.id}
      getHref={(meal) => `/meals/${meal.id}`}
      renderCard={renderCard}
      columns={columns}
    />
  );
}
