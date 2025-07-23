import { useConfigStore } from '@/store';

export function getConfig() {
  return useConfigStore.getState().config;
}
