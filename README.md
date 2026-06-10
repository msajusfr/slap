# Slap

Slap est une PWA React + TypeScript pour transformer une photo en image stylisee avec OpenAI ou fal.ai, via des fonctions Vercel securisees.

## Fonctionnalites

- Upload, camera mobile et glisser-deposer desktop
- Providers `OpenAI`, `fal.ai` et rendu local de demonstration
- Catalogue de styles data-driven par categories
- Recherche, favoris et styles recemment utilises
- Recommandations de styles basees sur une analyse locale simple de l image
- Edition incrementale: chaque generation devient la nouvelle image de travail
- Bibliotheque locale de photos sources pour relancer plusieurs essais depuis une base conservee
- Cadrage tactile de la source avec drag, zoom et pinch avant generation
- Mode `Prompt Only` pour modifier l image uniquement avec le prompt avance
- Controles avances: intensite, fidelite au visage, force du style, creativite
- Options de preservation: visage, vetements, pose, arriere-plan
- Variations rapides apres generation
- Historique local, export, partage et copie
- PWA installable avec `vite-plugin-pwa`

## Architecture

```text
api/
  fal-image.ts
  openai-image.ts
src/
  components/
  data/
    styles.ts
  hooks/
  pages/
  services/
    ai.ts
    image.ts
    styleService.ts
  types/
    index.ts
    style.ts
```

Le catalogue est pilote par [src/data/styles.ts](src/data/styles.ts). Pour ajouter un style, ajoutez un objet `ArtStyle` avec `id`, `name`, `category`, `accent`, `description`, `tags`, `mode` et `prompt`.

La logique de recherche, favoris, recents, analyse image et recommandations vit dans [src/services/styleService.ts](src/services/styleService.ts).

## Variables Vercel

Ajoutez ces variables dans `Settings > Environment Variables` du projet Vercel:

```text
OPENAI_API_KEY=...
FAL_KEY=...
```

Les cles ne sont pas exposees au navigateur. Le frontend appelle:

- `/api/openai-image`
- `/api/fal-image`

## Developpement

```bash
npm install
npm run dev
npm run build
npm run lint
```

Configuration Vercel:

- Framework: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

## Flux d edition incrementale

1. Importer une image.
2. Ajuster le cadrage avec le doigt, la souris ou le pinch zoom.
3. Choisir un provider.
4. Choisir un style ou `Prompt Only`.
5. Generer uniquement depuis l image ainsi cadree.
6. Le resultat remplace l image de travail.
7. Revenir a une photo source conservee pour lancer une autre piste.
8. Relancer une generation ou une variation rapide pour affiner l image.
