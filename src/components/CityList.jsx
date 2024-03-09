import styles from "./CityList.module.css";
import Spinner from "./Spinner";
import CityItem from "./CityItem";
import useCities from "../Hooks/useCities";

export default function CityList() {
  //useCities is a custom hook
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner />;
  return (
    <div>
      <ul className={styles.cityList}>
        {cities.map((item) => (
          <CityItem city={item} key={item.id} />
        ))}
      </ul>
    </div>
  );
}
