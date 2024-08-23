import { Link } from "react-router-dom";
import FlagemojiToPng from "../utils/FlagemojiToPng";
import formatDate from "../utils/formatDate";
import styles from "./CityItem.module.css";
import useCities from "../contexts/CitiesContext";

function CityItem({ city }) {
  const { emoji, cityName, date, id, lat, lng } = city;
  const { currentCity, deleteCity } = useCities();

  function handleDelete(e) {
    e.preventDefault();
    deleteCity(id);
  }

  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          city.id === currentCity.id ? styles["cityItem--active"] : ""
        }`}
        to={`${id}?lat=${lat}&lng=${lng}`}
      >
        <span className={styles.emoji}>
          <FlagemojiToPng emoji={emoji} />
        </span>
        <h3 className={styles.name}>{cityName}</h3>

        <time className={styles.date}>{formatDate(date)}</time>
        <button className={styles.deleteBtn} onClick={handleDelete}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
