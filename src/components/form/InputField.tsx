import { clsx } from "clsx";
import { cloneElement, isValidElement, useId } from "react";
import { type FieldError, type FieldValues, type Path, useFormContext } from "react-hook-form";
import styles from "./form.module.css";

interface InputProps {
  id?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  required?: boolean;
}

interface Props<T extends FieldValues = FieldValues> {
  label?: string;
  children?: React.ReactNode;
  name?: Path<T>;
  error?: boolean | string;
  helperText?: string;
  fullWidth?: boolean;
  required?: boolean;
  style?: React.CSSProperties;
}

export const InputField = <T extends FieldValues = FieldValues>({
  label,
  children,
  name,
  error: errorProp,
  helperText,
  fullWidth,
  required = false,
  style,
}: Props<T>) => {
  const fieldId = useId();
  const helperTextId = useId();

  // react-hook-formのコンテキストからエラーとregisterを取得（存在する場合）
  let fieldError: FieldError | undefined;
  let registerProps = {};

  try {
    const { getFieldState, register } = useFormContext<T>();
    if (name) {
      fieldError = getFieldState(name).error;
      registerProps = register(name);
    }
  } catch {
    // useFormContextが使えない場合は無視
  }

  // errorPropが優先、次にfieldError、最後にfalse
  const error = errorProp ?? fieldError?.message;
  const hasError = Boolean(error);
  const errorMessage = typeof error === "string" ? error : undefined;
  const displayHelperText = errorMessage || helperText;

  // childrenが単一のReact要素の場合、idとregisterPropsを付与
  const enhancedChildren = isValidElement(children)
    ? cloneElement(children as React.ReactElement<InputProps>, {
        id: fieldId,
        "aria-invalid": hasError,
        "aria-describedby": displayHelperText ? helperTextId : undefined,
        required,
        ...registerProps,
      })
    : children;

  return (
    <div className={clsx(styles.inputField, fullWidth && styles.fullWidth)} style={style}>
      {label && (
        <label htmlFor={fieldId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      {enhancedChildren}
      {displayHelperText && (
        <p id={helperTextId} className={clsx(styles.helperText, hasError && styles.errorText)}>
          {displayHelperText}
        </p>
      )}
    </div>
  );
};
