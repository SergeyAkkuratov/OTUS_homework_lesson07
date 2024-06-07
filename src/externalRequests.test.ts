describe("External Requests", () => {
    it("should return weather data", async () => {
        jest.spyOn(global, "fetch").mockReturnValueOnce(
            Promise.resolve({
                json: () => Promise.resolve(weather["Saint Petersburg"]),
            })
        );
    });
});
