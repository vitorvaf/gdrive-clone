import { describe, test, expect, jest } from "@jest/globals";
import Routes from "./../../src/routes";

describe("#Routes test suite", () => {
  const defaultParams = {
    request: {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      method: "",
      body: "",
    },
    response: {
      setHeader: jest.fn(),
      writeHead: jest.fn(),
      end: jest.fn(),
    },
    values: () => Object.values(defaultParams),
  };

  describe("#setSocketInstance", () => {
    test("setSocket shold store io instance ", () => {
      const routes = new Routes();
      const iObj = {
        to: (id) => iObj,
        emit: (event, message) => {},
      };

      routes.setSocketInstance(iObj);
      expect(routes.io).toStrictEqual(iObj);
    });

    describe("#handler", () => {
      test("given an inexist rout it should choose default route", async () => {
        const routes = new Routes();
        const params = {
          ...defaultParams,
        };

        params.request.method = "inexistent";
        await routes.handler(...params.values());
        expect(params.response.end).toHaveBeenCalledWith("hello word");
      });
      test("it should set any cors enable", async () => {
        const routes = new Routes();
        const params = {
          ...defaultParams,
        };

        params.request.method = "inexistent";
        await routes.handler(...params.values());
        expect(params.response.setHeader).toHaveBeenCalledWith(
          "Acess-Control-Allow-Origin",
          "*"
        );
      });
      test("given method Options it should choose options route", () => {
        const routes = new Routes();
        const params = {
          ...defaultParams,
        };

        params.request.method = "OPTIONS";
        routes.handler(...params.values());
        expect(params.response.writeHead).toHaveBeenCalledWith(204);
        expect(params.response.end).toHaveBeenCalled();
      });
      test("given method Get it should choose post route", async () => {
        const routes = new Routes();
        const params = {
          ...defaultParams,
        };

        params.request.method = "POST";
        jest.spyOn(routes, routes.post.name).mockResolvedValue();
        await routes.handler(...params.values());
        expect(routes.post).toHaveBeenCalled();
      });
      test("given method Post it should choose get route", async () => {
        const routes = new Routes();
        const params = {
          ...defaultParams,
        };

        params.request.method = "GET";
        jest.spyOn(routes, routes.get.name).mockResolvedValue();
        routes.handler(...params.values());
        expect(routes.get).toHaveBeenCalled();
      });
    });

    describe("#get", () => {
      test("given method GET it shouds list all files downloaded", async () => {
        const route = new Routes();
        const params = { ...defaultParams};
        const filesStatusesMock = [
          {
            size: "188 kB",
            lastModified: "2021-09-03T20:56:28.443Z",
            owner: "vitorAbreu",
            file: "file.txt",
          },
        ];

        jest.spyOn(route.fileHelper, route.fileHelper.getFilesStatus.name)
            .mockResolvedValue(filesStatusesMock);
        
            params.request.method = 'GET'
            await route.handler(...params.values());
        
            expect(params.response.writeHead).toBeCalledWith(200);
            expect(params.response.end).toBeCalledWith(JSON.stringify(filesStatusesMock));

      });
    });
  });
});
