import { faker } from "@faker-js/faker";

export const researchs = Array.from({ length: 10 }, () => ({
  id: faker.number.int({ min: 1000, max: 9999 }),
  name: faker.person.fullName(),
  email: faker.internet.email(),
}))