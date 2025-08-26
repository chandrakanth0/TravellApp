import { useState } from 'react';

/**
 * Props:
 *  item: { id, title, location, image, visitors, rating, liked? }
 *  onLike?: (id: string, liked: boolean) => void
 */
export default function TemplateCard({ item, onLike }) {
  const [liked, setLiked] = useState(Boolean(item?.liked));

  const toggleLike = () => {
    const next = !liked;
    setLiked(next);
    onLike?.(item.id, next);
  };

  return (
    <article
      className="group overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-lg"
      aria-label={item.title}
    >
      <div className="relative aspect-[16/10] bg-slate-100">
        <img
          src={item.image}
          alt={`${item.title} photo`}
          loading="lazy"
          className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.02]"
        />
        <button
          onClick={toggleLike}
          aria-pressed={liked}
          aria-label={liked ? 'Unlike' : 'Like'}
          title={liked ? 'Unlike' : 'Like'}
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-lg shadow-sm backdrop-blur
            transition ${liked ? 'bg-rose-100 text-rose-600' : 'bg-white/80 text-slate-700 hover:bg-white'}`}
        >
          ♥
        </button>
      </div>

      <div className="p-4">
        <h3 className="mb-1 line-clamp-1 text-base font-semibold text-slate-900">{item.title}</h3>
        <p className="mb-3 line-clamp-1 text-sm text-slate-600">{item.location}</p>

        <div className="flex items-center justify-between text-sm font-medium text-slate-800">
          <span className="text-slate-700">{formatVisitors(item.visitors)} visitors</span>
          <span className="flex items-center gap-1 whitespace-nowrap">
            <span className="text-amber-500">{renderStars(item.rating)}</span>
            <span className="text-slate-600">{item.rating.toFixed(1)}</span>
          </span>
        </div>
      </div>
    </article>
  );
}

function formatVisitors(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}

function renderStars(rating) {
  const full = Math.round(rating); // simple rounding to nearest whole star
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}
