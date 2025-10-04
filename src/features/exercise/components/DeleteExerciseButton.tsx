import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useStoreApi, useToast } from "@/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { GoTrash } from "react-icons/go";
import { QUERY_KEY_EXERCISES } from "../constants/queryKeys";
import { useDeleteExercise } from "../hooks/useExerciseApi";
import styles from "./exercises.module.css";

interface Props {
  exerciseId: number;
  onDeleted?: () => void;
  disabled?: boolean;
}

export const DeleteExerciseButton = ({ exerciseId, onDeleted, disabled }: Props) => {
  const query = useQueryClient();
  const toast = useToast();
  const storeApi = useStoreApi();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const deleteMutation = useDeleteExercise({
    onMutate: () => {
      storeApi.setIsAnyLoading(true);
    },
    onSuccess: () => {
      query.invalidateQueries({ queryKey: [QUERY_KEY_EXERCISES] });
      toast.add({ message: "種目を削除しました" });
      onDeleted?.();
    },
    onError: (error: Error) => {
      toast.add({
        message: `種目の削除に失敗しました: ${error.message}`,
        type: "error",
      });
    },
    onSettled: () => {
      storeApi.setIsAnyLoading(false);
    },
  });

  const handleClick = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirm = () => {
    deleteMutation.mutate(exerciseId);
    setIsConfirmOpen(false);
  };

  const handleCancel = () => {
    setIsConfirmOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={styles.listDeleteButton}
        disabled={deleteMutation.isPending || disabled}
      >
        <GoTrash />
      </button>
      <ConfirmDialog
        isOpen={isConfirmOpen}
        message="本当に削除しますか？"
        confirmLabel="削除"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
};
