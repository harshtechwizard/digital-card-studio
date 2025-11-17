/**
 * Generate a URL-friendly slug from a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate a unique slug by appending a random string
 */
export function generateUniqueSlug(baseName: string): string {
  const slug = slugify(baseName);
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${slug}-${randomSuffix}`;
}

/**
 * Validate if a slug is valid (alphanumeric and hyphens only)
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}
