import { useState, useEffect } from 'react';
import axios from 'axios';

const CountryList = ({ countries, showCountry }) => {
  return (
    <div>
      {countries.map((country) => (
        <div key={country.name.common}>
          {country.name.common}
          <button onClick={() => showCountry(country)}>Show</button>
        </div>
      ))}
    </div>
  );
};

const CountryDetail = ({ country }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          `http://api.weatherstack.com/current?access_key=e09ba09c6f1dcd7518443346598ad9b7&query=${country.capital[0]}`
        );
        setWeather(response.data.current);
      } catch (error) {
        console.log(error);
      }
    };

    fetchWeather();
  }, [country]);

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital[0]}</p>
      <p>Area: {country.area} km²</p>
      <h3>Languages:</h3>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt="Flag" width="200" height="150" />

      {weather && (
        <div>
          <h3>Weather in {country.capital[0]}</h3>
          <p>Temperature: {weather.temperature}°C</p>
          <p>Wind: {weather.wind_speed} km/h</p>
          <p>Weather description: {weather.weather_descriptions[0]}</p>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [search, setSearch] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        setCountries(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCountries();
  }, []);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setSelectedCountry(null);
  };

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  );

  const showCountry = (country) => {
    setSelectedCountry(country);
  };

  let countryView = null;

  if (filteredCountries.length > 10) {
    countryView = <p>Too many matches, specify another filter</p>;
  } else if (filteredCountries.length > 1) {
    countryView = (
      <CountryList countries={filteredCountries} showCountry={showCountry} />
    );
  } else if (filteredCountries.length === 1) {
    countryView = <CountryDetail country={filteredCountries[0]} />;
  }

  return (
    <div>
      <h1>Country Information</h1>
      <form>
        <label>Search:</label>
        <input type="text" value={search} onChange={handleSearchChange} />
      </form>

      {countryView}
    </div>
  );
};

export default App;

