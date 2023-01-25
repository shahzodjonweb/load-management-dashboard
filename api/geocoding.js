import axios from "axios";
import { GOOGLE_GEOCODING_API_KEY } from "~/core/constants";

export const getLatLong = async (address) => {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&region=us&key=${GOOGLE_GEOCODING_API_KEY}`
  );
  return response.data;
};
