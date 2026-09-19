import { generateLogoFromTemplate } from './gemini.service';
import { generateLogoFromScratch } from './flux.service';
import { promptService } from './prompt.service';
import { ARCHETYPE_CARDS } from '../data/archetypes';
import type {
  GenerateLogosRequest,
  LogoConcept,
  LogoArchetype,
} from '@upstream/shared';
import type { GeneratedPromptPayload } from '../types/logo.types';

export class LogoService {
  /**
   * Dispatch logo generation to Gemini (template mode) or Flux (scratch mode)
   */
  public async generateLogos(request: GenerateLogosRequest): Promise<LogoConcept[]> {
    const mode = request.mode || 'template';
    const brandName = request.selectedName?.name || 'Upstream';
    const industry = request.industry || '';
    const preferredColors =
      request.preferredColors ||
      request.selectedName?.visualDirection?.palette?.map((c) => c.hex) ||
      [];
    const fontStyle =
      request.fontStyle ||
      request.selectedName?.visualDirection?.fonts?.headline ||
      '';
    const styleKeywords =
      request.styleKeywords ||
      request.selectedName?.visualDirection?.styleDescription ||
      '';

    if (mode === 'template') {
      const archetypeId = request.archetypeId || 'abstract';
      return generateLogoFromTemplate({
        brandName,
        archetypeId,
        exemplarBrandId: request.exemplarBrandId,
        referenceImageBase64: request.referenceImageBase64,
        referenceImageMimeType: request.referenceImageMimeType,
        preferredColors,
        fontStyle,
        styleKeywords,
        industry,
        count: request.count || 2,
      });
    } else {
      // mode === 'scratch'
      const archetypeId = request.archetypeId || 'abstract';
      return generateLogoFromScratch({
        brandName,
        archetypeId,
        preferredColors,
        fontStyle,
        styleKeywords,
        industry,
        count: request.count || 2,
      });
    }
  }

  /**
   * Retrieve all 7 archetype UI cards
   */
  public getArchetypes() {
    return ARCHETYPE_CARDS;
  }

  /**
   * Retrieve exemplars for an archetype
   */
  public getExemplars(archetypeId: string) {
    return promptService.getExemplarsByArchetype(archetypeId as LogoArchetype);
  }

  /**
   * Generate preview stitched prompt without invoking image models
   */
  public previewPrompt(request: any): GeneratedPromptPayload {
    return promptService.buildLogoPrompt(request);
  }
}

export const logoService = new LogoService();
