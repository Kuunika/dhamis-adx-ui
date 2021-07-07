import axios from "axios";
import { IDhamisResponse, Quarter } from "../interfaces";

const { REACT_APP_DHAMIS_API_URL } = process.env;

const getDhamisData = async function (
  quarter: number,
  dataset: string | undefined
) {
  try {
    return (await (
      await axios(`${REACT_APP_DHAMIS_API_URL}/${dataset}/${quarter}`)
    ).data) as IDhamisResponse;
  } catch (error) {}
};

const getDhamisQuarters = async function () {
  try {
    return (await (
      await axios(`${REACT_APP_DHAMIS_API_URL}/quarters`)
    ).data) as Quarter[];
  } catch (error) {}
};

export default {
  getDhamisData,
  getDhamisQuarters,
};
