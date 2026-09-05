import { StorageService } from './storage';
import { SupportedLanguage } from '../types';

export class DraftService {
  /**
   * Saves user draft code for a specific problem and language.
   */
  public static saveDraft(
    userId: string,
    problemId: string,
    language: SupportedLanguage,
    code: string
  ): boolean {
    if (!userId || !problemId || !language) return false;
    try {
      StorageService.saveDraft(userId, problemId, language, code);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Retrieves user draft code for a specific problem and language.
   */
  public static getDraft(
    userId: string,
    problemId: string,
    language: SupportedLanguage
  ): string | null {
    if (!userId || !problemId || !language) return null;
    return StorageService.getDraft(userId, problemId, language);
  }

  /**
   * Clears a saved draft.
   */
  public static clearDraft(
    userId: string,
    problemId: string,
    language: SupportedLanguage
  ): boolean {
    if (!userId || !problemId || !language) return false;
    try {
      StorageService.saveDraft(userId, problemId, language, '');
      return true;
    } catch {
      return false;
    }
  }
}
