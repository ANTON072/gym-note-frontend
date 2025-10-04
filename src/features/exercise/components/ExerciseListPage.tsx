import { Button, PageTitle, Table } from "@/components";
import { InputField, Select } from "@/components/form";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";

import { BottomSheet, useBottomSheet } from "@/components/BottomSheet";
import { BODY_PART_OPTIONS } from "@/constants/bodyParts";
import { useStoreApi } from "@/hooks";
import { useGetExercises } from "../hooks/useExerciseApi";
import type { Exercise } from "../schema";
import { DeleteExerciseButton } from "./DeleteExerciseButton";
import { ExerciseForm } from "./ExerciseForm";
import styles from "./exercises.module.css";

export function ExerciseListPage() {
  const { data, isLoading, isFetched } = useGetExercises();
  const { ref, isOpen, onOpen, onClose: onCloseBottomSheet } = useBottomSheet();
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);
  const exercises: Exercise[] = Array.isArray(data) ? data : [];
  const storeApi = useStoreApi();

  const handleExerciseClick = (exerciseId: number) => {
    setSelectedExerciseId(exerciseId);
    onOpen();
  };

  const handleClose = () => {
    setSelectedExerciseId(null);
    onCloseBottomSheet();
  };

  return (
    <>
      <PageTitle title="種目一覧" />
      <div className={styles.wrapper}>
        <div className={styles.indexForm}>
          <form>
            <InputField
              label="種目名で絞り込み"
              style={{
                position: "relative",
                top: " calc(-1 * var(--form-font-size))",
              }}
            >
              <Select name="body_part" disabled={storeApi.isAnyLoading}>
                {Array.isArray(BODY_PART_OPTIONS)
                  ? BODY_PART_OPTIONS.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))
                  : null}
                <option value="">すべて</option>
              </Select>
            </InputField>
          </form>
          <Button type="button" onClick={onOpen}>
            新規登録
          </Button>
        </div>
        {isLoading && !isFetched && <Skeleton count={5} height={40} style={{ marginBottom: 10 }} />}
        {isFetched && (
          <Table
            data={exercises}
            columns={[
              {
                key: "name",
                header: "種目名",
                render: (exercise) => (
                  <button
                    type="button"
                    onClick={() => handleExerciseClick(exercise.id)}
                    className={styles.exerciseLink}
                    disabled={storeApi.isAnyLoading}
                  >
                    {exercise.name}
                  </button>
                ),
                width: "55%",
              },
              {
                key: "body_part",
                header: "部位",
                render: (exercise) => exercise.body_part,
              },
              {
                key: "edit",
                header: "",
                render: (exercise) => <DeleteExerciseButton exerciseId={exercise.id} />,
              },
            ]}
            keyExtractor={(exercise) => exercise.id}
          />
        )}
      </div>
      {/* フォーム */}
      <BottomSheet ref={ref} isOpen={isOpen} closeOnBackdropTap={false} disableDismiss disableDrag>
        <ExerciseForm exerciseId={selectedExerciseId} onClose={handleClose} />
      </BottomSheet>
    </>
  );
}
