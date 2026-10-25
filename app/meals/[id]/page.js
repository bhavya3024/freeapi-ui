'use client';
import { useParams } from 'next/navigation';
import { getMealById } from "../../../src/apis/meals";
import { DetailBody, DetailLayout, Hero, HeroTitle, InfoList, InfoRow, Panel } from "../../../src/components/Detail";
import Icon from "../../../src/components/Icon";
import ShimmerImage from "../../../src/components/ShimmerImage";
import { Badge, Chip, buttonStyles } from "../../../src/components/ui";
import { useResource } from "../../../src/hooks/useFetch";
import MealSkeleton from "./skeleton";

// TheMealDB stores ingredients as strIngredient1..20 / strMeasure1..20
function ingredientsOf(meal) {
  const list = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`]?.trim();
    if (ingredient) list.push({ ingredient, measure: meal[`strMeasure${i}`]?.trim() });
  }
  return list;
}

// One step per non-empty line, without "STEP 3" style prefixes or bare step numbers
function stepsOf(instructions = '') {
  return instructions
    .split(/\r?\n+/)
    .map((line) => line.replace(/^\s*(step\s*)?\d+[.):-]?\s*/i, '').trim())
    .filter((line) => line.length > 0);
}

function MealDetail({ meal }) {
  const ingredients = ingredientsOf(meal);
  const steps = stepsOf(meal.strInstructions);
  const tags = meal.strTags?.split(',').map((t) => t.trim()).filter(Boolean) || [];

  return (
    <>
      <Hero
        mediaClassName="w-full md:w-72"
        media={
          <ShimmerImage src={meal.strMealThumb} alt={meal.strMeal} fallbackIcon="utensils" className="aspect-square w-full rounded-xl" />
        }
      >
        <HeroTitle
          badges={
            <>
              {meal.strCategory && <Badge tone="teal">{meal.strCategory}</Badge>}
              {meal.strArea && <Badge icon="globe">{meal.strArea}</Badge>}
            </>
          }
          title={meal.strMeal}
          subtitle={`${ingredients.length} ingredients · ${steps.length} steps`}
        />
        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {tags.map((t, i) => (
              <Chip key={`${i}-${t}`}>#{t}</Chip>
            ))}
          </div>
        )}
        <div className="mt-5 flex flex-wrap gap-2">
          {meal.strYoutube && (
            <a href={meal.strYoutube} target="_blank" rel="noopener noreferrer" className={buttonStyles({ variant: 'primary' })}>
              <Icon name="play" className="w-3.5 h-3.5 fill-current" />
              Watch video
            </a>
          )}
          {meal.strSource && (
            <a href={meal.strSource} target="_blank" rel="noopener noreferrer" className={buttonStyles()}>
              Original recipe
              <Icon name="external" />
            </a>
          )}
        </div>
      </Hero>

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <Panel title="Ingredients" icon="utensils">
          <InfoList>
            {ingredients.map(({ ingredient, measure }, i) => (
              // Recipes can list the same ingredient twice (e.g. salt for two steps)
              <InfoRow key={`${i}-${ingredient}`} label={ingredient}>
                {measure}
              </InfoRow>
            ))}
          </InfoList>
        </Panel>
        <Panel title="Method" icon="clock" className="lg:col-span-2">
          <ol className="space-y-4">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-500/10 text-xs font-semibold tabular-nums text-teal-700 dark:text-teal-300">
                  {i + 1}
                </span>
                <p className="text-sm leading-6 text-muted">{step}</p>
              </li>
            ))}
          </ol>
        </Panel>
      </div>
    </>
  );
}

export default function MealDetailPage() {
  const { id } = useParams();
  const resource = useResource(getMealById, id);

  return (
    <DetailLayout slug="meals" label="All meals">
      <DetailBody resource={resource} noun="recipe" skeleton={<MealSkeleton />}>
        {(meal) => <MealDetail meal={meal} />}
      </DetailBody>
    </DetailLayout>
  );
}
