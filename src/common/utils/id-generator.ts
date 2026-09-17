import { randomUUID } from 'node:crypto';

export function generateId(prefix: string): string {
  const uniquePart = randomUUID().replace(/-/g, '');
  return `${prefix}_${uniquePart}`;
}