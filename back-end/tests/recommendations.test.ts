import supertest from "supertest";

import app from "../src/app.js";
import { prisma } from "../src/database.js";
import recommendationFactory from "./factories/recommendationFactory.js";

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
});

const agent = supertest(app);

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Tests POST /recommendations', () => {
  it('Should return status code 201, if a correctly formatted recommendation is created', async () => {
    const recommendation = await recommendationFactory();

    const result = await agent.post('/recommendations').send(recommendation);

    expect(result.status).toBe(201);
  });
});