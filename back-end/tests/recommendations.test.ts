import supertest from "supertest";

import app from "../src/app.js";
import { prisma } from "../src/database.js";
import recommendationFactory from "./factories/recommendationFactory.js";
import { recommendationRepository } from "../src/repositories/recommendationRepository.js";

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
});

const agent = supertest(app);

afterAll(async () => {
  await prisma.$disconnect();
});

async function insertRecommendation() {
  const recommendation = await recommendationFactory();
  await agent.post('/recommendations').send(recommendation);
}

describe('Tests POST /recommendations', () => {
  it('Should return status code 201, if a correctly formatted recommendation is created', async () => {
    const recommendation = await recommendationFactory();

    const result = await agent.post('/recommendations').send(recommendation);

    expect(result.status).toBe(201);
  });
});

describe('Tests POST /recommendations/:id/upvote', () => {
  it('Should return status code 200, if an upvote request on the given id is successful', async () => {
    await insertRecommendation();

    const getId = await recommendationRepository.findAll();
    const id = getId[0].id;

    const result = await agent.post(`/recommendations/${id}/upvote`);

    expect(result.status).toBe(200);
  });
});