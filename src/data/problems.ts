import { Problem } from '../types';
import { PROBLEMS_PART1 } from './problemsPart1';
import { PROBLEMS_PART2 } from './problemsPart2';
import { PROBLEMS_PART3 } from './problemsPart3';

export const ALL_PROBLEMS: Problem[] = [
  ...PROBLEMS_PART1,
  ...PROBLEMS_PART2,
  ...PROBLEMS_PART3
];

export function getProblemById(id: string): Problem | undefined {
  return ALL_PROBLEMS.find(p => p.id === id);
}

export function getProblemBySlug(slug: string): Problem | undefined {
  return ALL_PROBLEMS.find(p => p.slug === slug);
}
