import { enableFetchMocks } from 'jest-fetch-mock'
import { IWeatherData } from "./WeatherRedux/Types";
import { getCityName, getWeatherExternal } from "./externalRequests";

enableFetchMocks()
describe("External Requests", () => {
    const testWeather = {
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
    };

    const errorWeather = {
        cood: 400,
        message: "TEST ERROR"
    }

    const testCity = {
        city: "Moscow"
    }

    beforeEach(() => {
        fetchMock.doMock()
    })

    it("should return weather data", async () => {
        fetchMock.mockOnce(JSON.stringify(testWeather));

        const weatherData: IWeatherData = {
            lon: 37.6156,
            lat: 55.7522,
            icon: "04d",
            temp: 2,
            name: "Moscow",
        };

        const recivied = await getWeatherExternal("Moscow");

        expect(recivied).toStrictEqual(weatherData);
    });

    it("should return weather data with error", async () => {
        fetchMock.mockOnce(JSON.stringify(errorWeather));

        await expect(getWeatherExternal("Moscow")).rejects.toStrictEqual(Error("Во время получения информации вожникла ошибка: TEST ERROR"));
    });

    it("should return right name", async () => {
        fetchMock.mockOnce(JSON.stringify(testCity));

        const cityRecivied = await getCityName();
        expect(cityRecivied).toStrictEqual("Moscow");
    })
});
