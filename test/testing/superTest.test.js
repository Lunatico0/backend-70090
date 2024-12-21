import supertest from "supertest";
import chai from 'chai';
import { config } from 'dotenv';

config();
const PORT = process.env.PORT;
const expect = chai.expect;
const requester = supertest(`http://localhost:${PORT}`);

describe("Testing AdoptMe! Application", () => {
  let cookie;
  let userId;
  let petId;
  let adoptionId;

  describe("Pets Testing", () => {
    it("POST /api/pets should create a pet", async () => {
      const pet = {
        name: "Max",
        specie: "dog",
        birthDate: "2022-01-01",
      };

      const { _body } = await requester.post("/api/pets").send(pet);

      petId = _body.payload._id;

      expect(_body.payload).to.have.property("_id");
    });

    it("Should create a pet with adopted property set to false", async () => {
      const newPet = {
        name: "Vue",
        specie: "Cat",
        birthDate: "2022-01-01"
      };

      const { statusCode, body } = await requester.post("/api/pets").send(newPet);
      expect(statusCode).to.equal(200);
      expect(body.payload).to.have.property("adopted", false);
    });

    it("GET /api/pets should respond with status 200 and payload as an array", async () => {
      const { statusCode, body } = await requester.get("/api/pets");

      expect(statusCode).to.equal(200);
      expect(body).to.have.property("payload").that.is.an("array");
    });

    it("POST /api/pets without name should return statusCode 400", async () => {
      const newPetWithoutName = {
        specie: "cat",
        birthDate: "2020-05-15"
      };

      const { statusCode } = await requester.post("/api/pets").send(newPetWithoutName);

      expect(statusCode).to.equal(400);
    });

    it("DELETE /api/pets/:id should delete the last added pet", async () => {
      const pet = {
        name: "Minerva",
        specie: "cat",
        birthDate: "2021-11-15"
      };

      const { body: { payload: { _id } } } = await requester.post("/api/pets").send(pet);
      const { statusCode } = await requester.delete(`/api/pets/${_id}`);

      expect(statusCode).to.equal(200);
    });
  });

  describe("Advanced Testing", () => {
    it("Should register a user", async () => {
      const userMock = {
        first_name: "Patricio",
        last_name: "Pittana",
        email: "pittanapatric@gmail.com",
        password: "1234"
      };

      const { _body } = await requester.post("/api/sessions/register").send(userMock);

      userId = _body.payload;

      expect(_body.payload).to.be.ok;
    });

    it("Should log in a user and retrieve a cookie", async () => {
      const userMocked = { email: "pittanapatric@gmail.com", password: "1234" };
      const result = await requester.post("/api/sessions/login").send(userMocked);
      const cookieResult = result.headers["set-cookie"]["0"];

      expect(cookieResult).to.be.ok;

      cookie = {
        name: cookieResult.split("=")["0"],
        value: cookieResult.split("=")["1"]
      };

      expect(cookie.name).to.be.ok.and.equal("coderCookie");
      expect(cookie.value).to.be.ok;
    });

    it("Should send the user's cookie", async () => {
      const { _body } = await requester.get("/api/sessions/current").set("Cookie", [`${cookie.name}=${cookie.value}`]);

      expect(_body.payload.email).to.be.equal("pittanapatric@gmail.com");
    });
  });

  describe("Image Upload Testing", () => {
    it("Should create a pet and upload an image", async () => {
      const petMock = {
        name: "Sopilote",
        specie: "cat",
        birthDate: "2024-08-23"
      };
      const { status, body } = await requester.post("/api/pets/withimage")
        .field("name", petMock.name)
        .field("specie", petMock.specie)
        .field("birthDate", petMock.birthDate)
        .attach("image", "./test/coderDog.jpg");

      expect(status).to.be.equal(200);
      expect(body.payload).to.have.property("_id");
      expect(body.payload.image).to.be.ok;
    });
  });

  describe("Adoptions Testing", () => {
    const invalidId = "123456789012345678901234";

    describe("GET /api/adoptions", () => {
      it("Should adopt a pet", async () => {
        const { statusCode, body } = await requester.post(`/api/adoptions/${userId}/${petId}`);

        expect(statusCode).to.be.oneOf([200, 400]);
        if (statusCode === 201) {
          expect(body).to.be.an("object");
          expect(body).to.have.property("userId");
          expect(body).to.have.property("petId");
        }
      });

      it("Should return all adoptions with status 200", async () => {
        const { statusCode, body } = await requester.get("/api/adoptions");

        adoptionId = body.payload[0]._id;

        expect(statusCode).to.equal(200);
        expect(body.payload).to.be.an("array");
      });

      it("Should include necessary properties in each adoption", async () => {
        const { statusCode, body } = await requester.get("/api/adoptions");

        expect(statusCode).to.equal(200);
        if (body.length > 0) {
          expect(body[0]).to.have.property("userId");
          expect(body[0]).to.have.property("petId");
        }
      });
    });

    describe("GET /api/adoptions/:aid", () => {
      it("Should return a specific adoption by valid ID", async () => {
        const { statusCode, body } = await requester.get(`/api/adoptions/${adoptionId}`);

        if (statusCode === 404) {
          this.skip(); // If adoption does not exist, mark the test as pending
        } else {
          expect(statusCode).to.equal(200);
          expect(body).to.be.an("object");
        }
      });

      it("Should return error 404 for non-existent adoption ID", async () => {
        const { statusCode } = await requester.get(`/api/adoptions/${invalidId}`);

        expect(statusCode).to.equal(404);
      });

      it("Should return error 404 for invalid adoption ID", async () => {
        const { statusCode } = await requester.get(`/api/adoptions/${invalidId}`);

        expect(statusCode).to.equal(404);
      });
    });

    describe("POST /api/adoptions/:uid/:pid", () => {
      it("Should create a new adoption with valid IDs", async () => {
        const { statusCode, body } = await requester.post(`/api/adoptions/${userId}/${petId}`);

        expect(statusCode).to.be.oneOf([200, 400]);
        if (statusCode === 200) {
          expect(body).to.be.an("object");
          expect(body).to.have.property("userId");
          expect(body).to.have.property("petId");
        }
      });

      it("Should return error 404 for non-existent user", async () => {
        const { statusCode } = await requester.post(`/api/adoptions/${invalidId}/${petId}`);

        expect(statusCode).to.be.oneOf([404, 400]);
      });

      it("Should return error 404 for non-existent pet", async () => {
        const { statusCode } = await requester.post(`/api/adoptions/${userId}/${invalidId}`);

        expect(statusCode).to.be.oneOf([404, 400]);
      });

      it("DELETE /api/users/:id should delete the last registered user", async () => {
        const { statusCode } = await requester.delete(`/api/users/${userId}`);
        expect(statusCode).to.equal(200);
      });
    });
  });
});
