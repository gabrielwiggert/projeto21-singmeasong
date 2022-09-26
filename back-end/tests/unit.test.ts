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

  it('Should not create a recommendation with an already existing name', async () => {
    const recommendation = await recommendationFactory(1);

    jest
      .spyOn(recommendationRepository, 'findByName')
      .mockImplementationOnce((): any => {
        return recommendation;
      });

    const promise = recommendationService.insert(recommendation);

    expect(promise).rejects.toEqual({
      type: 'conflict',
      message: "Recommendations names must be unique"
    });

    expect(recommendationRepository.create).not.toBeCalled();
  });
});

describe('Tests getByIdOrFail function', () => {
    it('Should return a recommendation with the given id', async () => {
      const recommendation = await recommendationFactory(1);
  
      jest
      .spyOn(recommendationRepository, 'find')
      .mockImplementationOnce((id): any => {
        return recommendation;
      });

      const promise = recommendationService.getById(1);

      expect(promise).toBeInstanceOf(Object);
    });

    it('Should throw notFoundError if an unexisting id is searched', async () => {
        jest
        .spyOn(recommendationRepository, 'find')
        .mockImplementationOnce((id): any => {
          return null;
        });
    
        const promise = recommendationService.getById(1);
    
        expect(promise).rejects.toEqual({
          type: 'not_found',
          message: ""
        });
      });
  });