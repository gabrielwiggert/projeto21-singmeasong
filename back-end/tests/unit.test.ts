import { jest } from '@jest/globals';

import { recommendationService } from '../src/services/recommendationsService'
import recommendationFactory from "./factories/recommendationFactory.js";
import { recommendationRepository } from "../src/repositories/recommendationRepository.js";

beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

describe('Tests insert function', () => {
  it('Should call functions', async () => {
    const recommendation = await recommendationFactory(1);

    jest
      .spyOn(recommendationRepository, 'findByName')
      .mockImplementationOnce((): any => {});

    jest
    .spyOn(recommendationRepository, 'create')
    .mockImplementationOnce((): any => {});

    await recommendationService.insert(recommendation);

    expect(recommendationRepository.findByName).toBeCalled();
    expect(recommendationRepository.create).toBeCalled();
  });
});