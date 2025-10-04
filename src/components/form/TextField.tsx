import styles from "./form.module.css";

interface Props {
  name?: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
}

export const TextField = ({
  name,
  type = "text",
  ...props
}: Props & Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof Props>) => {
  return <input type={type} name={name} className={styles.textField} {...props} />;
};
