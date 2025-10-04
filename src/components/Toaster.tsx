import { useRootStore } from "@/store/rootStore";
import clsx from "clsx";
import gsap from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";
import { GoXCircleFill } from "react-icons/go";
import styles from "./Toaster.module.css";

export interface ToastType {
  id: string;
  message: string;
  type: "normal" | "error";
}

type ToasterItemProps = ToastType & {
  onHeightUpdate: (id: string, height: number) => void;
  yPosition?: number;
};

const ToasterItem = ({ message, type, id, onHeightUpdate, yPosition }: ToasterItemProps) => {
  const { toast } = useRootStore();
  const listRef = useRef<HTMLLIElement>(null);

  // 高さ測定用
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (listRef.current) {
      const height = listRef.current.offsetHeight;
      onHeightUpdate(id, height);
    }
  }, [id]);

  useEffect(() => {
    const removeTimerId = setTimeout(() => {
      handleRemove();
    }, 5000);
    return () => clearTimeout(removeTimerId);
  }, []);

  const handleRemove = () => {
    gsap.to(listRef.current, {
      autoAlpha: 0,
      duration: 0.2,
      ease: "linear",
      onComplete: () => toast.remove(id),
    });
  };

  return (
    <li
      ref={listRef}
      className={clsx(styles.toasterList, styles.toasterTransition)}
      data-type={type}
      style={
        {
          "--y-position": yPosition !== undefined ? `${yPosition}px` : "-9999px",
        } as React.CSSProperties
      }
    >
      <button
        type="button"
        className={styles.closeButton}
        aria-label="閉じる"
        onClick={handleRemove}
      >
        <GoXCircleFill />
      </button>
      {message}
    </li>
  );
};

export const Toaster = () => {
  const { toast } = useRootStore();
  const [itemHeights, setItemHeights] = useState<Record<string, number>>({});

  const handleHeightUpdate = (id: string, height: number) => {
    setItemHeights((prev) => ({ ...prev, [id]: height }));
  };

  const { itemPositions, totalHeight } = useMemo(() => {
    const positions: Record<string, number> = {};
    let currentY = 0;

    for (const t of toast.toastList) {
      positions[t.id] = currentY;
      const height = itemHeights[t.id];
      if (height) {
        currentY += height + 8;
      }
    }
    return {
      itemPositions: positions,
      totalHeight: Math.max(0, currentY - 8),
    };
  }, [toast.toastList, itemHeights]);

  return (
    <section>
      <ol
        className={clsx(styles.toaster, styles.toasterTransition)}
        style={
          {
            "--total-height": `${totalHeight}px`,
          } as React.CSSProperties
        }
      >
        {toast.toastList.map((t) => (
          <ToasterItem
            key={t.id}
            {...t}
            onHeightUpdate={handleHeightUpdate}
            yPosition={itemPositions[t.id]}
          />
        ))}
      </ol>
    </section>
  );
};
