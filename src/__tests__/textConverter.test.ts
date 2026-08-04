import { describe, it, expect } from 'vitest';
import {
  slugify,
  humanize,
  titleify,
  plainify,
  markdownify,
} from '../lib/utils/textConverter';

describe('textConverter', () => {
  describe('slugify', () => {
    it('should convert text to url-safe slug', () => {
      expect(slugify('Toalla de Baño Bordada')).toBe('toalla-de-baño-bordada');
    });

    it('should handle special characters and spaces', () => {
      expect(slugify('¡Oferta Especial! 100% Algodón')).toBe('oferta-especial-100-algodón');
    });
  });

  describe('humanize', () => {
    it('should convert snake_case or kebab-case to human readable text', () => {
      expect(humanize('toalla_de_bano')).toBe('Toalla de bano');
      expect(humanize('toalla-de-mano')).toBe('Toalla de mano');
    });
  });

  describe('titleify', () => {
    it('should capitalize each word in a string', () => {
      expect(titleify('toalla de bano premium')).toBe('Toalla De Bano Premium');
    });
  });

  describe('markdownify & plainify', () => {
    it('should convert markdown text to html', async () => {
      const html = await markdownify('**Toalla**');
      expect(html).toContain('<strong>Toalla</strong>');
    });

    it('should strip markdown and html tags in plainify', async () => {
      const plain = await plainify('# Encabezado\nTexto **negrita** <script>alert(1)</script>');
      expect(plain).not.toContain('#');
      expect(plain).not.toContain('<strong>');
    });
  });
});
