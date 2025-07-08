import { create } from 'zustand';
import { useAuthStore } from '../../authentication/stores/authStore';
import { generateProcessedImageUrl } from '../services/imageProcessing';
import { delay } from '../../../shared/utils/helpers';

interface RestorationJob {
  id: string;
  originalImage: string;
  processedImage?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
}

interface PhotoRestorationState {
  // Current state
  originalImage: string | null;
  processedImage: string | null;
  isProcessing: boolean;
  error: string | null;
  
  // History
  jobs: RestorationJob[];
  
  // Actions
  setImage: (imageUrl: string) => void;
  processImage: (imageUrl: string) => Promise<void>;
  uploadImage: (file: File) => Promise<void>;
  reset: () => void;
  clearError: () => void;
  
  // Job management
  addJob: (job: RestorationJob) => void;
  updateJob: (id: string, updates: Partial<RestorationJob>) => void;
  getJob: (id: string) => RestorationJob | undefined;
  clearHistory: () => void;
}

export const usePhotoRestorationStore = create<PhotoRestorationState>(
  (set, get) => ({
    // Initial state
    originalImage: null,
    processedImage: null,
    isProcessing: false,
    error: null,
    jobs: [],

    // Actions
    setImage: (imageUrl: string) => {
      set({
        originalImage: imageUrl,
        processedImage: null,
        error: null,
      });
    },

    processImage: async (imageUrl: string) => {
      set({ isProcessing: true, error: null });

      try {
        // Check if user can consume a credit
        const success = useAuthStore.getState().consumeCredit();
        
        if (!success) {
          set({
            error: 'Insufficient credits to process image.',
            isProcessing: false,
          });
          return;
        }

        // Create a job entry
        const job: RestorationJob = {
          id: `job-${Date.now()}`,
          originalImage: imageUrl,
          status: 'processing',
          createdAt: new Date(),
        };

        get().addJob(job);

        // Simulate processing delay
        await delay(3000);

        // Generate processed image
        const processedUrl = generateProcessedImageUrl(imageUrl);
        
        // Update state
        set({
          processedImage: processedUrl,
          isProcessing: false,
        });

        // Update job
        get().updateJob(job.id, {
          processedImage: processedUrl,
          status: 'completed',
        });

      } catch {
        set({
          error: 'Error al procesar la imagen. Por favor, intenta de nuevo.',
          isProcessing: false,
        });
      }
    },

    uploadImage: async (file: File) => {
      try {
        // In a real implementation, you would upload to a service like Supabase Storage
        // For demo, just use a local object URL
        const imageUrl = URL.createObjectURL(file);
        get().setImage(imageUrl);
      } catch {
        set({
          error: 'Error al subir la imagen. Por favor, intenta de nuevo.',
        });
      }
    },

    reset: () => {
      set({
        originalImage: null,
        processedImage: null,
        isProcessing: false,
        error: null,
      });
    },

    clearError: () => {
      set({ error: null });
    },

    // Job management
    addJob: (job: RestorationJob) => {
      set((state) => ({
        jobs: [job, ...state.jobs],
      }));
    },

    updateJob: (id: string, updates: Partial<RestorationJob>) => {
      set((state) => ({
        jobs: state.jobs.map((job) =>
          job.id === id ? { ...job, ...updates } : job
        ),
      }));
    },

    getJob: (id: string) => {
      return get().jobs.find((job) => job.id === id);
    },

    clearHistory: () => {
      set({ jobs: [] });
    },
  })
);