import { describe, it, expect } from 'vitest';
import type { User, PaymentPlan, RestorationJob } from '@/types';

describe('Domain Types', () => {
  it('should define User type correctly', () => {
    const user: User = {
      id: '123',
      email: 'test@example.com',
      full_name: 'Test User',
      credits: 5,
      trial_used: false,
    };

    expect(user.id).toBe('123');
    expect(user.email).toBe('test@example.com');
    expect(user.credits).toBe(5);
  });

  it('should define PaymentPlan type correctly', () => {
    const plan: PaymentPlan = {
      id: 'pro',
      name: 'Pro Plan',
      price: 9.99,
      interval: 'month',
      features: ['Unlimited uploads', 'Priority support'],
      popular: true,
    };

    expect(plan.name).toBe('Pro Plan');
    expect(plan.interval).toBe('month');
    expect(plan.features).toHaveLength(2);
  });

  it('should define RestorationJob type correctly', () => {
    const job: RestorationJob = {
      id: 'job-123',
      user_id: 'user-456',
      status: 'pending',
      input_url: 'https://example.com/input.jpg',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    expect(job.status).toBe('pending');
    expect(job.input_url).toContain('input.jpg');
  });
});