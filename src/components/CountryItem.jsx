import styles from "./CountryItem.module.css";
import FlagemojiToPng from "../utils/FlagemojiToPng";

function CountryItem({ country }) {
  return (
    <li className={styles.countryItem}>
      <span>
        <FlagemojiToPng emoji={country.emoji} />
      </span>
      <span>{country.name}</span>
    </li>
  );
}

export default CountryItem;
