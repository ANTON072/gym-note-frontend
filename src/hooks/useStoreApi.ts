import { useRootStore } from "@/store/rootStore";

export const useStoreApi = () => {
  return useRootStore((state) => state.api);
};
