import type { ArtStyle, QuickVariation, StyleCategory } from '../types/style';

export const categories: StyleCategory[] = [
  'Prompt',
  'BD & Illustration',
  'Anime & Manga',
  'Art traditionnel',
  'Photo & Cinema',
  'Gaming',
  'Fun & Viral'
];

export const quickVariations: QuickVariation[] = [
  {
    id: 'realistic',
    label: 'Plus realiste',
    prompt: 'Rends la version plus realiste, avec matieres naturelles, lumiere credible et details photo plausibles.'
  },
  {
    id: 'artistic',
    label: 'Plus artistique',
    prompt: 'Accentue la direction artistique, les choix graphiques, les couleurs et la composition.'
  },
  {
    id: 'darker',
    label: 'Plus sombre',
    prompt: 'Assombris l ambiance, ajoute du contraste dramatique et une atmosphere plus nocturne.'
  },
  {
    id: 'detailed',
    label: 'Plus detaille',
    prompt: 'Ajoute plus de micro-details lisibles, textures fines et precision visuelle sans surcharger.'
  },
  {
    id: 'retro',
    label: 'Plus retro',
    prompt: 'Ajoute une patine retro, un rendu analogique et des couleurs legerement nostalgiques.'
  }
];

export const artStyles: ArtStyle[] = [
  {
    id: 'prompt-only',
    name: 'Prompt Only',
    category: 'Prompt',
    accent: '#ffffff',
    description: 'Modification libre uniquement pilotee par le prompt avance.',
    tags: ['prompt', 'edition', 'incremental', 'custom'],
    mode: 'prompt-only',
    prompt: 'Utilise uniquement le prompt avance utilisateur pour modifier la photo source.'
  },
  {
    id: 'ligne-claire-belge',
    name: 'Ligne claire belge',
    category: 'BD & Illustration',
    accent: '#29d3ff',
    description: 'Contours nets, aplats lumineux et narration visuelle tres lisible.',
    tags: ['bd', 'illustration', 'clair', 'portrait', 'famille'],
    mode: 'styled',
    prompt: 'Illustration ligne claire belge, contours nets, aplats propres, couleurs lumineuses, decors lisibles, rendu premium.'
  },
  {
    id: 'tintin-aventure',
    name: 'Tintin aventure',
    category: 'BD & Illustration',
    accent: '#f4c84f',
    description: 'Aventure graphique coloree, expressive et tres accessible.',
    tags: ['bd', 'aventure', 'voyage', 'clair', 'personnage'],
    mode: 'styled',
    prompt: 'Style aventure BD europeenne, personnages expressifs, couleurs claires, decors de voyage, encrage propre, atmosphere optimiste.'
  },
  {
    id: 'comics-vintage',
    name: 'Comics vintage',
    category: 'BD & Illustration',
    accent: '#f66f5f',
    description: 'Encrage pop, trame imprimee et energie de couverture retro.',
    tags: ['comics', 'retro', 'action', 'vif', 'hero'],
    mode: 'styled',
    prompt: 'Rendu comics vintage imprime, trame halftone subtile, encrage dynamique, couleurs legerement patinees, energie pop.'
  },
  {
    id: 'roman-graphique-sombre',
    name: 'Roman graphique sombre',
    category: 'BD & Illustration',
    accent: '#8d7aff',
    description: 'Clair-obscur, texture papier et ambiance dramatique.',
    tags: ['bd', 'sombre', 'portrait', 'noir', 'drame'],
    mode: 'styled',
    prompt: 'Roman graphique sombre, clair-obscur intense, palette froide, texture papier, atmosphere dramatique et elegante.'
  },
  {
    id: 'moebius-sf',
    name: 'Moebius SF',
    category: 'BD & Illustration',
    accent: '#70e0c3',
    description: 'Science-fiction onirique, lignes fines et espaces etranges.',
    tags: ['sf', 'desert', 'onirique', 'ligne', 'monde'],
    mode: 'styled',
    prompt: 'Illustration science-fiction europeenne onirique, lignes fines, architectures etranges, couleurs minerales, sensation de grand espace.'
  },
  {
    id: 'manga-nb',
    name: 'Manga N&B',
    category: 'Anime & Manga',
    accent: '#f7f2ff',
    description: 'Noir et blanc expressif avec hachures et cadrage manga.',
    tags: ['manga', 'noir blanc', 'portrait', 'contraste'],
    mode: 'styled',
    prompt: 'Style manga noir et blanc, contrastes francs, hachures fines, cadrage cinematographique et expressions detaillees.'
  },
  {
    id: 'anime-cinema-japonais',
    name: 'Anime cinema japonais',
    category: 'Anime & Manga',
    accent: '#ff8bd2',
    description: 'Lumiere de film, emotion subtile et couleurs anime modernes.',
    tags: ['anime', 'cinema', 'portrait', 'emotion', 'lumiere'],
    mode: 'styled',
    prompt: 'Anime cinematographique japonais, lumiere de film, couleurs riches, profondeur de champ, rendu net et emotif.'
  },
  {
    id: 'anime-annees-90',
    name: 'Anime annees 90',
    category: 'Anime & Manga',
    accent: '#ffb86b',
    description: 'Celluloid retro, grain doux et couleurs nostalgiques.',
    tags: ['anime', 'retro', '90s', 'vhs', 'portrait'],
    mode: 'styled',
    prompt: 'Anime japonais annees 90, rendu celluloid, grain analogique subtil, couleurs nostalgiques, contours nets.'
  },
  {
    id: 'cyberpunk-anime',
    name: 'Cyberpunk anime',
    category: 'Anime & Manga',
    accent: '#29d3ff',
    description: 'Neons, ville futuriste et dramatisation anime.',
    tags: ['anime', 'cyberpunk', 'neon', 'nuit', 'ville'],
    mode: 'styled',
    prompt: 'Cyberpunk anime neon, lumiere cyan et magenta, ville futuriste, pluie lumineuse, details technologiques elegants.'
  },
  {
    id: 'crayon-graphite',
    name: 'Crayon graphite',
    category: 'Art traditionnel',
    accent: '#bcc8d8',
    description: 'Traits sensibles, ombrages doux et grain papier.',
    tags: ['dessin', 'crayon', 'portrait', 'sobre'],
    mode: 'styled',
    prompt: 'Croquis au crayon graphite, traits sensibles, ombrages doux, texture papier premium, conservation de la ressemblance.'
  },
  {
    id: 'fusain',
    name: 'Fusain',
    category: 'Art traditionnel',
    accent: '#d1d5db',
    description: 'Noirs profonds, estompes et matiere expressive.',
    tags: ['dessin', 'fusain', 'sombre', 'portrait'],
    mode: 'styled',
    prompt: 'Dessin au fusain, noirs profonds, estompes manuelles, grain visible, rendu artistique expressif.'
  },
  {
    id: 'aquarelle',
    name: 'Aquarelle',
    category: 'Art traditionnel',
    accent: '#70e0c3',
    description: 'Pigments translucides et lumiere douce.',
    tags: ['peinture', 'aquarelle', 'doux', 'lumineux'],
    mode: 'styled',
    prompt: 'Aquarelle contemporaine, pigments translucides, contours delicats, lumiere naturelle, rendu doux et haut de gamme.'
  },
  {
    id: 'huile-classique',
    name: 'Huile classique',
    category: 'Art traditionnel',
    accent: '#ff8f70',
    description: 'Matiere picturale, profondeur et lumiere classique.',
    tags: ['peinture', 'huile', 'classique', 'portrait'],
    mode: 'styled',
    prompt: 'Peinture a l huile classique, coups de pinceau riches, profondeur picturale, lumiere de studio, matiere visible.'
  },
  {
    id: 'ukiyo-e',
    name: 'Ukiyo-e',
    category: 'Art traditionnel',
    accent: '#78f0a8',
    description: 'Estampe japonaise, aplats elegants et lignes decoratives.',
    tags: ['japon', 'estampe', 'traditionnel', 'paysage'],
    mode: 'styled',
    prompt: 'Estampe japonaise ukiyo-e, aplats elegants, lignes decoratives, textures papier, composition harmonieuse.'
  },
  {
    id: 'cinematique',
    name: 'Cinematique',
    category: 'Photo & Cinema',
    accent: '#a67aff',
    description: 'Lumiere de film, profondeur et color grading premium.',
    tags: ['cinema', 'portrait', 'lumiere', 'realiste'],
    mode: 'styled',
    prompt: 'Rendu cinematographique premium, color grading de film, lumiere sculptee, profondeur de champ, atmosphere immersive.'
  },
  {
    id: 'film-noir',
    name: 'Film noir',
    category: 'Photo & Cinema',
    accent: '#e7ecf4',
    description: 'Contraste noir et blanc, mystere et ombres fortes.',
    tags: ['noir blanc', 'cinema', 'sombre', 'portrait'],
    mode: 'styled',
    prompt: 'Film noir classique, noir et blanc contraste, ombres venetiennes, lumiere dramatique, ambiance detective.'
  },
  {
    id: 'vintage-annees-70',
    name: 'Vintage annees 70',
    category: 'Photo & Cinema',
    accent: '#d8a86a',
    description: 'Couleurs chaudes, grain organique et nostalgie 70s.',
    tags: ['retro', '70s', 'photo', 'chaud'],
    mode: 'styled',
    prompt: 'Photographie vintage annees 70, couleurs chaudes, grain argentique, contraste doux, rendu editorial retro.'
  },
  {
    id: 'vhs-annees-90',
    name: 'VHS annees 90',
    category: 'Photo & Cinema',
    accent: '#69e6ff',
    description: 'Texture cassette, couleurs video et energie 90s.',
    tags: ['vhs', '90s', 'retro', 'video', 'fun'],
    mode: 'styled',
    prompt: 'Image VHS annees 90, bruit video subtil, couleurs analogiques, leger decalage chromatique, atmosphere nostalgique.'
  },
  {
    id: 'polaroid',
    name: 'Polaroid',
    category: 'Photo & Cinema',
    accent: '#f8f0df',
    description: 'Instantane doux, bords lumineux et rendu intime.',
    tags: ['photo', 'instantane', 'retro', 'doux'],
    mode: 'styled',
    prompt: 'Polaroid retro, lumiere douce, couleurs legerement delavees, grain fin, rendu intime et spontane.'
  },
  {
    id: 'rpg-fantasy',
    name: 'RPG fantasy',
    category: 'Gaming',
    accent: '#78f0a8',
    description: 'Illustration heroique, magie et univers fantasy.',
    tags: ['gaming', 'fantasy', 'hero', 'magie'],
    mode: 'styled',
    prompt: 'Concept art RPG fantasy, lumiere magique, costume heroique, environnement epique, rendu jeu premium.'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    category: 'Gaming',
    accent: '#29d3ff',
    description: 'Interface futuriste, ville neon et attitude de jeu AAA.',
    tags: ['gaming', 'cyberpunk', 'neon', 'action'],
    mode: 'styled',
    prompt: 'Concept art cyberpunk de jeu video, neons intenses, details technologiques, ambiance urbaine nocturne, rendu AAA.'
  },
  {
    id: 'souls-like',
    name: 'Souls-like',
    category: 'Gaming',
    accent: '#8f8a7f',
    description: 'Dark fantasy, monumental et melancolique.',
    tags: ['gaming', 'sombre', 'fantasy', 'armure'],
    mode: 'styled',
    prompt: 'Dark fantasy souls-like, lumiere froide, architecture monumentale, atmosphere melancolique, details d armure et de pierre.'
  },
  {
    id: 'heros-jeu-video',
    name: 'Heros de jeu video',
    category: 'Gaming',
    accent: '#ffcf33',
    description: 'Portrait de personnage iconique, pose forte et rendu promotionnel.',
    tags: ['gaming', 'hero', 'portrait', 'action'],
    mode: 'styled',
    prompt: 'Portrait de heros de jeu video, pose forte, costume detaille, lumiere promotionnelle, rendu affiche AAA.'
  },
  {
    id: 'action-figure',
    name: 'Action Figure',
    category: 'Fun & Viral',
    accent: '#69e6ff',
    description: 'Figurine collectible, packaging implicite et studio propre.',
    tags: ['fun', 'viral', 'figurine', 'collectible'],
    mode: 'styled',
    prompt: 'Action figure collectible sous lumiere studio, materiau vinyle premium, accessoires lisibles, rendu produit haut de gamme.'
  },
  {
    id: 'starter-pack',
    name: 'Starter Pack',
    category: 'Fun & Viral',
    accent: '#ff8bd2',
    description: 'Composition virale avec objets-signatures et humour visuel.',
    tags: ['fun', 'viral', 'meme', 'objets'],
    mode: 'styled',
    prompt: 'Starter pack viral propre et premium, sujet central avec objets-signatures autour, humour visuel subtil, composition partageable.'
  },
  {
    id: 'affiche-film',
    name: 'Affiche de film',
    category: 'Fun & Viral',
    accent: '#f66f5f',
    description: 'Poster dramatique, composition heroique et lumiere cinema.',
    tags: ['film', 'poster', 'cinema', 'hero'],
    mode: 'styled',
    prompt: 'Affiche de film premium, composition dramatique, lumiere cinema, sujet heroique, espace typographique sans ajouter de texte.'
  },
  {
    id: 'couverture-magazine',
    name: 'Couverture magazine',
    category: 'Fun & Viral',
    accent: '#f8f0df',
    description: 'Editorial chic, regard fort et rendu couverture mode.',
    tags: ['magazine', 'fashion', 'portrait', 'editorial'],
    mode: 'styled',
    prompt: 'Couverture magazine editorial haut de gamme, lumiere mode, pose forte, details nets, sans ajouter de texte ni logo.'
  }
];
