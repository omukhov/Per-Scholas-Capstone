import type { IStatCardProps } from "../../../types/components";
import styles from "./StatCard.module.css";

const StatCard = ({
  title,
  value,
  description,
}: IStatCardProps): React.JSX.Element => {
  return (
    <article className={styles.card}>
      <p className={styles.title}>{title}</p>

      <strong className={styles.value}>{value.toLocaleString("en-US")}</strong>

      {description && <p className={styles.description}>{description}</p>}
    </article>
  );
};

export default StatCard;
