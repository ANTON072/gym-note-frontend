import { useRootStore } from "@/store/rootStore";

export const useToast = () => {
  return useRootStore((state) => state.toast);
};
