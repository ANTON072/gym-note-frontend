import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { HttpError } from "./httpAuth";

interface HandleFormErrorOptions<T extends FieldValues> {
  error: Error;
  setError: UseFormSetError<T>;
  onValidationError?: () => void;
  onOtherError?: (error: Error) => void;
}

/**
 * フォーム送信時のエラーハンドリング
 * バリデーションエラーの場合は各フィールドにエラーを設定し、コールバックを実行
 * その他のエラーの場合はコールバックを実行
 */
export const handleFormError = <T extends FieldValues>({
  error,
  setError,
  onValidationError,
  onOtherError,
}: HandleFormErrorOptions<T>) => {
  // バリデーションエラーの場合、フィールドにエラーを設定
  if (error instanceof HttpError && error.validationErrors) {
    for (const [field, messages] of Object.entries(error.validationErrors)) {
      setError(field as Path<T>, {
        type: "server",
        message: messages[0], // 最初のエラーメッセージを表示
      });
    }
    onValidationError?.();
  } else {
    // その他のエラー
    onOtherError?.(error);
  }
};
