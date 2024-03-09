import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import CountryItem from "./CountryItem.jsx";
import useCities from "../Hooks/useCities";

export default function CountryList() {
  const { cities, isLoading } = useCities();

  if (isLoading) return <Spinner />;
  let x = [];
  const countries = [];
  cities.forEach((item) =>
    x.includes(item.country) ? "" : x.push(item.country) && countries.push(item)
  );

  return (
    <div>
      <ul className={styles.countryList}>
        {countries.map((item) => (
          <CountryItem country={item} key={item.id} />
        ))}
      </ul>
    </div>
  );
}
