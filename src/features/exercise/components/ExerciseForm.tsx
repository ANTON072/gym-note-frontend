import {
  InputField,
  RadioButton,
  RadioGroup,
  Select,
  TextArea,
  TextField,
} from "@/components/form";
import { BODY_PART_OPTIONS } from "@/constants/bodyParts";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import styles from "./exercises.module.css";

import { Button } from "@/components";
import { useStoreApi, useToast } from "@/hooks";
import { handleFormError } from "@/lib/formError";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { QUERY_KEY_EXERCISES } from "../constants/queryKeys";
import { useCreateExercise, useGetExercise, useUpdateExercise } from "../hooks/useExerciseApi";
import type { ExerciseFormData } from "../schema";
import { exerciseFormSchema } from "../schema";
import { DeleteExerciseButton } from "./DeleteExerciseButton";

interface Props {
  exerciseId?: number | null;
  onClose: () => void;
}

export const ExerciseForm = ({ exerciseId, onClose }: Props) => {
  const toast = useToast();
  const query = useQueryClient();
  const storeApi = useStoreApi();

  const isEdit = typeof exerciseId === "number" && exerciseId !== null;

  const { data } = useGetExercise(exerciseId, {
    enabled: isEdit,
  });

  const defaultValues = {
    laterality: "bilateral" as const,
  };

  const form = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseFormSchema),
    defaultValues,
  });

  const handleMutationSuccess = (message: string) => {
    query.invalidateQueries({ queryKey: [QUERY_KEY_EXERCISES] });
    toast.add({ message });
    onClose();
  };

  const handleMutationError = (error: Error, action: string) => {
    toast.add({
      message: `${action}に失敗しました: ${error.message}`,
      type: "error",
    });
  };

  const handleFormMutationError = (error: Error, action: string) => {
    handleFormError({
      error,
      setError: form.setError,
      onValidationError: () => {
        toast.add({
          message: "入力内容を確認してください",
          type: "error",
        });
      },
      onOtherError: (error) => handleMutationError(error, action),
    });
  };

  const createMutation = useCreateExercise({
    onSuccess: () => handleMutationSuccess("種目を登録しました"),
    onError: (error: Error) => handleFormMutationError(error, "種目の登録"),
  });

  const updateMutation = useUpdateExercise({
    onSuccess: () => handleMutationSuccess("種目を更新しました"),
    onError: (error: Error) => handleFormMutationError(error, "種目の更新"),
  });

  const isPending = createMutation.isPending || updateMutation.isPending || storeApi.isAnyLoading;

  const onSubmit = (values: ExerciseFormData) => {
    if (isEdit && exerciseId) {
      updateMutation.mutate({ id: exerciseId, data: values });
      return;
    }
    createMutation.mutate(values);
  };

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form.reset]);

  return (
    <FormProvider {...form}>
      <form id="exercise-form" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div className={styles.formGrid}>
          <InputField label="部位" name="body_part" required>
            <Select>
              <option value="">選択してください</option>
              {BODY_PART_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </InputField>
          <InputField label="種目名" name="name" required>
            <TextField placeholder="ベンチプレス" />
          </InputField>
          <InputField label="動作パターン" name="laterality" required>
            <RadioGroup>
              <RadioButton value="bilateral">バイラテラル(両側同時)</RadioButton>
              <RadioButton value="unilateral">ユニラテラル(片側ずつ)</RadioButton>
            </RadioGroup>
          </InputField>
          <InputField label="メモ" name="memo">
            <TextArea rows={4} />
          </InputField>
        </div>
        {isEdit ? (
          <div className={styles.formActions}>
            <Button type="button" variant="outlined" onClick={onClose} disabled={isPending}>
              キャンセル
            </Button>
            <Button type="submit" form="exercise-form" disabled={isPending}>
              更新
            </Button>
            <div />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                padding: "var(--container-padding)",
              }}
            >
              <DeleteExerciseButton
                exerciseId={exerciseId}
                disabled={isPending}
                onDeleted={() => {
                  onClose();
                }}
              />
            </div>
          </div>
        ) : (
          <div className={styles.formActions}>
            <Button type="button" variant="outlined" onClick={onClose} disabled={isPending}>
              キャンセル
            </Button>
            <Button type="submit" form="exercise-form" disabled={isPending}>
              登録
            </Button>
          </div>
        )}
      </form>
    </FormProvider>
  );
};
