import { generateBrandNames } from './groq.service';
import * as firebaseService from './firebase.service';
import type {
  BrandInput,
  GenerateBrandResponse,
} from '@upstream/shared';

/**
 * Orchestrates full brand naming and visual direction generation session
 */
export async function generateBrand(
  input: BrandInput,
  count = 12
): Promise<GenerateBrandResponse> {
  // 1. Generate brand names, taglines, visual direction with Groq
  const names = await generateBrandNames(input, count);

  // 2. Persist project state in Firestore (or in-memory mock store)
  const projectId = await firebaseService.saveProject({
    input,
    generatedNames: names,
  });

  return {
    projectId,
    names,
  };
}
