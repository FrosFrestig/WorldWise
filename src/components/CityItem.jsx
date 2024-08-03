import { Link } from "react-router-dom";
import FlagemojiToPng from "../utils/FlagemojiToPng";
import formatDate from "../utils/formatDate";
import styles from "./CityItem.module.css";

function CityItem({ city }) {
  const { emoji, cityName, date, id, position } = city;

  return (
    <li>
      <Link
        className={styles.cityItem}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.emoji}>
          <FlagemojiToPng emoji={emoji} />
        </span>
        <h3 className={styles.name}>{cityName}</h3>

        <time className={styles.date}>{formatDate(date)}</time>
        <button className={styles.deleteBtn}>&times;</button>
      </Link>
    </li>
  );
}

export default CityItem;
