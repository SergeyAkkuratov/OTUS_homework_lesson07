import fs from "fs";
import { Blob } from "buffer";

// Данные для мокирования
export const weather = {
  Moscow: {
    coord: {
      lon: 37.6156,
      lat: 55.7522,
    },
    weather: [
      {
        icon: "04d",
      },
    ],
    main: {
      temp: 2,
    },
    id: 524901,
    name: "Moscow",
    cod: 200,
  },
  "Saint Petersburg": {
    coord: {
      lat: 59.8944,
      lon: 30.2642,
    },
    weather: [
      {
        icon: "04n",
      },
    ],
    main: {
      temp: 1,
    },
    id: 498817,
    name: "Saint Petersburg",
    cod: 200,
  },
  Error_city: {
    cod: 404,
    message: "city not found",
  },
};

export const ipInfo = {
  region: "Moscow",
};

export const testBlob = new Blob([
  fs.readFileSync("./src/assets/test_blob_map.png"),
]);
