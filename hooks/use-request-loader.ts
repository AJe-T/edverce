"use client";

import { create } from "zustand";

interface RequestLoaderState {
  pendingCount: number;
  start: () => void;
  stop: () => void;
}

export const useRequestLoader = create<RequestLoaderState>((set) => ({
  pendingCount: 0,
  start: () =>
    set((state) => ({
      pendingCount: state.pendingCount + 1,
    })),
  stop: () =>
    set((state) => ({
      pendingCount: Math.max(0, state.pendingCount - 1),
    })),
}));
