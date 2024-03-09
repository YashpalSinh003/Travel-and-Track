import { NavLink } from "react-router-dom";
import styles from "./CityItem.module.css";
import useCities from "../Hooks/useCities";

export default function CityItem({ city }) {
  const { deleteCity, currentCity } = useCities();

  const date = new Intl.DateTimeFormat("us-en", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(city.date));

  const { id, position } = city;

  const visitDate = date.split(",").slice(1).join("");

  return (
    <li>
      <NavLink
        className={`${styles.cityItem} ${
          id === currentCity.id ? styles["cityItem--active"] : ""
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <div className={styles.emoji}>{city.emoji}</div>
        <h3 className={styles.name}>{city.cityName}</h3>
        <time className={styles.date}>{visitDate}</time>
        <button
          className={styles.deleteBtn}
          onClick={(e) => {
            e.preventDefault();
            deleteCity(id);
          }}
        >
          &times;
        </button>
      </NavLink>
    </li>
  );
}
