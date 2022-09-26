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

async function insertRecommendation(testNumber : number) {
  const recommendation = await recommendationFactory(testNumber);
  await agent.post('/recommendations').send(recommendation);
}

describe('Tests POST /recommendations', () => {
  it('Should return status code 201, if a correctly formatted recommendation is created', async () => {
    const recommendation = await recommendationFactory(1);

    const result = await agent.post('/recommendations').send(recommendation);

    expect(result.status).toBe(201);
  });
});

describe('Tests POST /recommendations/:id/upvote', () => {
  it('Should return status code 200, if an upvote request on the given id is successful', async () => {
    await insertRecommendation(2);

    const getId = await recommendationRepository.findAll();
    const id = getId[0].id;

    const result = await agent.post(`/recommendations/${id}/upvote`);

    expect(result.status).toBe(200);
  });
});

describe('Tests POST /recommendations/:id/downvote', () => {
  it('Should return status code 200, if a downvote request on the given id is successful', async () => {
    await insertRecommendation(3);

    const getId = await recommendationRepository.findAll();
    const id = getId[0].id;

    const result = await agent.post(`/recommendations/${id}/downvote`);

    expect(result.status).toBe(200);
  });
  it('Should delete the given recommendation, if its score gets to -6', async () => {
    await insertRecommendation(4);

    const getId = await recommendationRepository.findByName('Electric Callboy - Hypa Hypa 4');
    const id = getId.id;

    await agent.post(`/recommendations/${id}/downvote`);
    await agent.post(`/recommendations/${id}/downvote`);
    await agent.post(`/recommendations/${id}/downvote`);
    await agent.post(`/recommendations/${id}/downvote`);
    await agent.post(`/recommendations/${id}/downvote`);
    await agent.post(`/recommendations/${id}/downvote`);

    const result = recommendationRepository.findByName('Electric Callboy - Hypa Hypa 4');

    expect((await result)).toBeNull();
  });
});