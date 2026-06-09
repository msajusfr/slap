import type { ArtStyle, StyleCategory } from '../types';

export const categories: StyleCategory[] = [
  'Bande dessinee',
  'Dessin',
  'Modernes',
  'Photo premium',
  'Fun'
];

export const artStyles: ArtStyle[] = [
  {
    id: 'ligne-claire',
    name: 'Ligne claire',
    category: 'Bande dessinee',
    accent: '#29d3ff',
    prompt: 'Transforme la photo en illustration ligne claire franco-belge, contours nets, aplats propres, couleurs lumineuses, composition lisible.'
  },
  {
    id: 'comics-vintage',
    name: 'Comics vintage',
    category: 'Bande dessinee',
    accent: '#f6c85f',
    prompt: 'Rendu comics vintage imprime, trame halftone subtile, encrage dynamique, couleurs legerement patinees, energie pop.'
  },
  {
    id: 'manga-noir',
    name: 'Manga N&B',
    category: 'Bande dessinee',
    accent: '#f7f2ff',
    prompt: 'Style manga noir et blanc, contrastes francs, hachures fines, cadrage cinematographique et expressions detaillees.'
  },
  {
    id: 'graphic-noir',
    name: 'Roman sombre',
    category: 'Bande dessinee',
    accent: '#a67aff',
    prompt: 'Roman graphique sombre, clair-obscur intense, palette froide, texture papier, atmosphere dramatique et elegante.'
  },
  {
    id: 'crayon',
    name: 'Croquis crayon',
    category: 'Dessin',
    accent: '#bcc8d8',
    prompt: 'Croquis au crayon graphite, traits sensibles, ombrages doux, texture papier premium, conservation de la ressemblance.'
  },
  {
    id: 'fusain',
    name: 'Fusain',
    category: 'Dessin',
    accent: '#d1d5db',
    prompt: 'Dessin au fusain, noirs profonds, estompes manuelles, grain visible, rendu artistique expressif.'
  },
  {
    id: 'aquarelle',
    name: 'Aquarelle',
    category: 'Dessin',
    accent: '#70e0c3',
    prompt: 'Aquarelle contemporaine, pigments translucides, contours delicats, lumiere naturelle, rendu doux et haut de gamme.'
  },
  {
    id: 'huile',
    name: 'Huile',
    category: 'Dessin',
    accent: '#ff8f70',
    prompt: 'Peinture a l huile, coups de pinceau riches, profondeur picturale, lumiere de studio, matiere visible.'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    category: 'Modernes',
    accent: '#29d3ff',
    prompt: 'Cyberpunk neon premium, lumiere cyan et magenta, details futuristes discrets, ambiance urbaine elegante.'
  },
  {
    id: 'anime-cinema',
    name: 'Anime cinema',
    category: 'Modernes',
    accent: '#ff6ad5',
    prompt: 'Anime cinematographique, eclairage de film, couleurs riches, profondeur de champ, rendu net et emotif.'
  },
  {
    id: 'pixar-like',
    name: '3D doux',
    category: 'Modernes',
    accent: '#78f0a8',
    prompt: 'Personnage 3D chaleureux, formes douces, materiaux premium, lumiere de studio, expression vivante.'
  },
  {
    id: 'clay',
    name: 'Clay render',
    category: 'Modernes',
    accent: '#e8a56d',
    prompt: 'Rendu argile 3D, texture matte tactile, modelisation propre, studio minimal, ombres douces.'
  },
  {
    id: 'studio',
    name: 'Studio portrait',
    category: 'Photo premium',
    accent: '#f8f0df',
    prompt: 'Portrait studio premium, peau naturelle, lumiere sculpturale, fond elegant, retouche subtile et realiste.'
  },
  {
    id: 'argentique',
    name: 'Argentique',
    category: 'Photo premium',
    accent: '#d8a86a',
    prompt: 'Photo argentique haut de gamme, grain fin, couleurs organiques, contraste doux, rendu editorial.'
  },
  {
    id: 'cinema-bw',
    name: 'Cinema N&B',
    category: 'Photo premium',
    accent: '#e7ecf4',
    prompt: 'Noir et blanc cinema, contraste controle, lumiere dramatique, grain subtil, composition luxueuse.'
  },
  {
    id: 'fashion',
    name: 'Editorial',
    category: 'Photo premium',
    accent: '#a67aff',
    prompt: 'Editorial fashion, pose et lumiere magazine, palette sophistiquee, details nets, rendu publicitaire premium.'
  },
  {
    id: 'lego',
    name: 'Briques',
    category: 'Fun',
    accent: '#ffcf33',
    prompt: 'Transformation en scene de briques de construction stylisees, couleurs vives, details reconnaissables, rendu ludique.'
  },
  {
    id: 'collectible',
    name: 'Figurine',
    category: 'Fun',
    accent: '#69e6ff',
    prompt: 'Figurine collectible sous lumiere studio, materiau vinyle premium, proportions charmantes, emballage implicite minimal.'
  },
  {
    id: 'pixel',
    name: 'Pixel art',
    category: 'Fun',
    accent: '#78f0a8',
    prompt: 'Pixel art detaille, palette limitee, silhouette lisible, style jeu moderne, rendu net sans flou.'
  },
  {
    id: 'kawaii',
    name: 'Sticker',
    category: 'Fun',
    accent: '#ff8bd2',
    prompt: 'Sticker kawaii, contours epais, expression adorable, couleurs pastel lumineuses, fond transparent suggere.'
  }
];
