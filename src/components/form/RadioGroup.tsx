import { Children, cloneElement, forwardRef, isValidElement } from "react";
import styles from "./form.module.css";

interface Props {
  children: React.ReactNode;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  defaultValue?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

export const RadioGroup = forwardRef<HTMLInputElement, Props>(
  ({ children, name, onChange, onBlur, defaultValue, ...ariaProps }, ref) => {
    const enhancedChildren = Children.map(children, (child) => {
      if (isValidElement(child)) {
        return cloneElement(child as React.ReactElement<any>, {
          name,
          onChange,
          onBlur,
          ref,
        });
      }
      return child;
    });

    return (
      <div className={styles.radioGroup} {...ariaProps}>
        {enhancedChildren}
      </div>
    );
  },
);
