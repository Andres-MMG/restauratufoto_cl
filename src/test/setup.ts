import '@testing-library/jest-dom';

// Mock Supabase
vi.mock('../shared/config/supabase', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      getUser: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(),
      })),
      insert: vi.fn(),
    })),
  },
}));

// Mock URL.createObjectURL
Object.defineProperty(globalThis, 'URL', {
  value: {
    createObjectURL: vi.fn(() => 'blob:mock-url'),
    revokeObjectURL: vi.fn(),
  },
  writable: true,
});

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Upload: () => 'svg',
  Download: () => 'svg',
  X: () => 'svg',
  AlertCircle: () => 'svg',
  ArrowRight: () => 'svg',
  User: () => 'svg',
  Edit2: () => 'svg',
  Github: () => 'svg',
}));
