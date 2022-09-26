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

describe('Tests GET /recommendations', () => {
  it('Should return an array with the latest 10 recommendations', async () => {
    for (let i = 5; i < 15; i++) {
      await insertRecommendation(i);
    }

    const result = await agent.get('/recommendations');

    expect(result.body.length).toBeGreaterThanOrEqual(10);
  });
});

describe('Tests GET /recommendations/:id', () => {
  it('Should return an object containing the recommendation with the given id', async () => {
    await insertRecommendation(20);
    const getId = await recommendationRepository.findByName('Electric Callboy - Hypa Hypa 20');
    const id = getId.id;

    const result = await agent.get(`/recommendations/${id}`);

    expect(result.body).toBeInstanceOf(Object);
  });
});

describe('Tests GET /recommendations/random', () => {
  it('Should return an object containing a random recommendation', async () => {
    await insertRecommendation(20);
    const result = await agent.get('/recommendations/random');

    expect(result.body).toBeInstanceOf(Object);
  });

  it('Should return an object containing a random recommendation with a score greater than -5', async () => {
    await insertRecommendation(20);
    const result = await agent.get('/recommendations/random');

    expect(result.body.score).toBeGreaterThan(-6);
  });

  it('Should return status code 404 when there is no recommendations', async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
    const result = await agent.get('/recommendations/random');

    expect(result.status).toBe(404);
  });
});

describe('Tests GET /recommendations/top/:amount', () => {
  it('Should return an array containing a given number of recommendations', async () => {
    await insertRecommendation(1);
    await insertRecommendation(2);
    await insertRecommendation(3);
    await insertRecommendation(4);
    const result = await agent.get('/recommendations/top/4');

    expect(result.body).toHaveLength(4);
  });

  it('Should return an array containing a given number of recommendations ordered by score', async () => {
    await insertRecommendation(1);
    const getId = await recommendationRepository.findByName('Electric Callboy - Hypa Hypa 1');
    const id = getId.id;
    await agent.post(`/recommendations/${id}/upvote`);

    await insertRecommendation(2);

    await insertRecommendation(3);
    const getId2 = await recommendationRepository.findByName('Electric Callboy - Hypa Hypa 3');
    const id2 = getId2.id;
    await agent.post(`/recommendations/${id2}/downvote`);

    const result = await agent.get('/recommendations/top/3');

    expect(result.body[0].name).toEqual("Electric Callboy - Hypa Hypa 1");
    expect(result.body[1].name).toEqual("Electric Callboy - Hypa Hypa 2");
    expect(result.body[2].name).toEqual("Electric Callboy - Hypa Hypa 3");
  });
});