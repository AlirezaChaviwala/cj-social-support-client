import { Country, State, City } from "country-state-city";

export interface ICountry {
  isoCode: string;
  name: string;
  phonecode: string;
  flag: string;
}

export interface IState {
  isoCode: string;
  name: string;
  countryCode: string;
}

export interface ICity {
  name: string;
  countryCode: string;
  stateCode: string;
}

export function getAllCountries(): ICountry[] {
  return Country.getAllCountries().sort((a: ICountry, b: ICountry) =>
    a.name.localeCompare(b.name)
  );
}

export function getStatesByCountryCode(countryIsoCode: string): IState[] {
  if (!countryIsoCode) return [];
  return State.getStatesOfCountry(countryIsoCode).sort((a: IState, b: IState) =>
    a.name.localeCompare(b.name)
  );
}

export function getCitiesByStateAndCountry(
  countryIsoCode: string,
  stateIsoCode: string
): ICity[] {
  if (!countryIsoCode || !stateIsoCode) return [];
  return City.getCitiesOfState(countryIsoCode, stateIsoCode).sort(
    (a: ICity, b: ICity) => a.name.localeCompare(b.name)
  );
}

export function findCountryByName(name: string): ICountry | undefined {
  const countries = getAllCountries();
  return countries.find(
    (country) =>
      country.name.toLowerCase() === name.toLowerCase() ||
      country.isoCode === name
  );
}

export function findStateByName(
  stateName: string,
  countryIsoCode: string
): IState | undefined {
  const states = getStatesByCountryCode(countryIsoCode);
  return states.find(
    (state) =>
      state.name.toLowerCase() === stateName.toLowerCase() ||
      state.isoCode === stateName
  );
}
