export const CATEGORIES = [
  { slug: 'collections',       label: 'Collections'       },
  { slug: 'couture-lab',       label: 'Couture Lab'       },
  { slug: 'material-studies',  label: 'Material Studies'  },
  { slug: 'archive',           label: 'Archive'           },
] as const;

export type CategorySlug = typeof CATEGORIES[number]['slug'];
