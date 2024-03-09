// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useReducer } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import styles from "./Form.module.css";
import Button from "./Button";
import { useSearchParams, useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import useCities from "../Hooks/useCities";
import Spinner from "./Spinner";
import Message from "./Message";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

// function convertDecimalNum(number) {
//   const str = number.toString();
//   const index = str.indexOf(".");
//   const result = str.slice(index + 1, index + 5);
//   return Number(result);
// }

// function convertToEmoji(countryCode) {
//   const regionalIndicatorSymbols = countryCode.split("").map((char) => {
//     const codePoint = char.charCodeAt(0);
//     return String.fromCodePoint(codePoint + 0x1f1e6 - 0x61);
//   });
//   return regionalIndicatorSymbols.join("");
// }

const cityObj = {
  cityName: "",
  date: new Date(),
  notes: "",
  geoLocationLoading: false,
  emoji: "",
  position: {},
  country: "",
  countryCode: "",
};

function reduce(state, action) {
  switch (action.type) {
    case "cityFetch":
      return {
        ...state,
        cityName: action.payload.city || action.payload.locality,
        country: action.payload.countryName,
        countryCode: action.payload.countryCode,
        position: {
          lat: action.payload.latitude,
          lng: action.payload.longitude,
        },
      };
    case "setDate":
      return { ...state, date: action.payload };
    case "setNotes":
      return { ...state, notes: action.payload };
    case "loadingLocation":
      return { ...state, geoLocationLoading: action.payload };
    case "setEmoji":
      return { ...state, emoji: action.payload };
    default:
      throw new Error("Unknown action registered");
  }
}

function Form() {
  const [currentState, dispatch] = useReducer(reduce, cityObj);
  const {
    cityName,
    date,
    notes,
    geoLocationLoading,
    emoji,
    country,
    position,
    countryCode,
  } = currentState;

  const { createCity } = useCities();
  const [cords] = useSearchParams();
  const navigate = useNavigate();
  const lat = cords.get("lat");
  const lng = cords.get("lng");

  useEffect(
    function () {
      async function fetchGeolocationData() {
        try {
          dispatch({ type: "loadingLocation", payload: true });
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();
          dispatch({
            type: "cityFetch",
            payload: data,
          });
          dispatch({
            type: "setEmoji",
            payload: convertToEmoji(data.countryCode),
          });
        } catch (err) {
          throw new Error(err.message);
        } finally {
          dispatch({ type: "loadingLocation", payload: false });
        }
      }
      fetchGeolocationData();
    },
    [lat, lng]
  );

  async function addNewCity(e) {
    e.preventDefault();
    await createCity({ cityName, country, date, emoji, notes, position });
    navigate("/applayout/cities");
  }

  if (geoLocationLoading) return <Spinner />;
  if (!countryCode)
    return (
      <Message message="This seems to be not a city.Click somewhere else on map" />
    );

  return (
    <form className={styles.form} onSubmit={(e) => addNewCity(e)}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) =>
            dispatch({ type: "cityFetch", payload: e.target.value })
          }
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          onChange={(date) => dispatch({ type: "setDate", payload: date })}
          selected={date}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) =>
            dispatch({ type: "setNotes", payload: e.target.value })
          }
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
