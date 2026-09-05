import { Contest } from '../types';

export const SAMPLE_CONTESTS: Contest[] = [
  {
    id: 'contest-48',
    title: 'CodeLumen Biweekly Sprint #48',
    description: '4 algorithmic problems of ascending difficulty. 90 minutes. Test your speed and edge-case resilience.',
    startTime: 'Tomorrow, 14:00 UTC',
    durationMinutes: 90,
    status: 'upcoming',
    problemIds: ['p-1', 'p-7', 'p-18', 'p-46'],
    participantsCount: 1420
  },
  {
    id: 'contest-47',
    title: 'CodeLumen Weekly Championship #47',
    description: 'High-focus weekly contest featuring sliding window and graph traversal challenges.',
    startTime: 'Live Now',
    durationMinutes: 90,
    status: 'active',
    problemIds: ['p-2', 'p-11', 'p-38', 'p-19'],
    participantsCount: 2890
  },
  {
    id: 'contest-46',
    title: 'CodeLumen Sprint #46: Dynamic Programming Focus',
    description: 'A curated contest exploring optimal substructure and state memoization.',
    startTime: 'Completed 5 days ago',
    durationMinutes: 90,
    status: 'completed',
    problemIds: ['p-41', 'p-42', 'p-43', 'p-44'],
    participantsCount: 3105
  }
];
