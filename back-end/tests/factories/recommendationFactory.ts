import { faker } from "@faker-js/faker";
import { CreateRecommendationData } from "../../src/services/recommendationsService";

export default function recommendationFactory(): CreateRecommendationData {
  return {
    name: faker.lorem.words(4),
    youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
  };
}