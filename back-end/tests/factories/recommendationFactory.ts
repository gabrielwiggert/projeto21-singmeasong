import { CreateRecommendationData } from "../../src/services/recommendationsService";

export default function recommendationFactory(testNumber : number): CreateRecommendationData {
  return {
    name: `Electric Callboy - Hypa Hypa ${testNumber}`,
    youtubeLink: "https://www.youtube.com/watch?v=75Mw8r5gW8E"
  };
}