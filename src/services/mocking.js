import { faker } from "@faker-js/faker";
import { createHash } from "../utils/index.js";
import User from "../dao/models/User.js";
import Pet from "../dao/models/Pet.js";
import UserRepository from "../repository/UserRepository.js";
import PetRepository from "../repository/PetRepository.js";

const userRepository = new UserRepository(User);
const petRepository = new PetRepository(Pet);

class MockingService {
    async generateMockingUsers(num) {

    }

    static async generateMockingPets(num) {
        const pets = [];

        for (let i = 0; i < num; i++) {
            pets.push({
                name: faker.animal.dog(),
                specie: faker.animal.type(),
                adopted: false
            })
        }
        return pets;
    }

    static async generateMockingUsers(num) {
        const users = [];
        for (let i = 0; i < num; i++) {
            users.push({
                first_name: faker.person.firstName() || "DefaultName",
                last_name: faker.person.lastName() || "DefaultLastName",
                email: faker.internet.email() || `default${i}@example.com`,
                password: await createHash("coder123"),
                role: faker.helpers.arrayElement(["user", "admin"]),
                pets: []
            })
        }
        return users;
    }

    static async generateAndInsertData(userCount, petCount) {
        try {
            const users = await this.generateMockingUsers(userCount);
            const pets = await this.generateMockingPets(petCount);

            await userRepository.insertMany(users);
            await petRepository.insertMany(pets);

            return { users: users.length, pets: pets.length };
        } catch (error) {
            throw new Error(`Error al generar o insertar datos: ${error.message}`);
        }
    };
}

export default MockingService;
