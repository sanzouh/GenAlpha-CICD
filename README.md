# GenAlpha — Genetic Algorithm Portfolio Optimizer

> Application académique d'optimisation de portefeuille financier par algorithme génétique (NSGA-II), avec visualisation du front de Pareto et aide à la décision multicritères.

---

## Table des matières

1. [Présentation du projet](#1-présentation-du-projet)
2. [Pourquoi ce projet existe](#2-pourquoi-ce-projet-existe)
3. [Comment l'utiliser](#3-comment-lutiliser)
4. [Architecture technique](#4-architecture-technique)
5. [Prérequis](#5-prérequis)
6. [Installation et lancement en local](#6-installation-et-lancement-en-local)
7. [Structure du projet](#7-structure-du-projet)
8. [Les actifs financiers](#8-les-actifs-financiers)
9. [Les paramètres de l'algorithme](#9-les-paramètres-de-lalgorithme)
10. [Comprendre les résultats](#10-comprendre-les-résultats)
11. [Concepts académiques](#11-concepts-académiques)
12. [Roadmap](#12-roadmap)

---

## 1. Présentation du projet

**GenAlpha** est une application web qui permet d'optimiser un portefeuille d'investissement en utilisant un **algorithme génétique multiobjectif (NSGA-II)**. Elle s'inscrit dans le cadre d'un cours d'**aide à la décision et optimisation multicritères**.

L'application résout un problème fondamental en finance : comment répartir un capital entre plusieurs actifs (actions, obligations, crypto...) pour obtenir le **meilleur compromis entre rendement et risque** ?

Elle ne donne pas une seule réponse — elle donne un **ensemble de solutions optimales** (le front de Pareto) parmi lesquelles le décideur humain choisit librement selon ses préférences.

---

## 2. Pourquoi ce projet existe

### Le problème

Un investisseur dispose d'un capital à placer. Il peut choisir parmi plusieurs actifs, chacun avec un rendement espéré et une volatilité (risque). La question est : dans quelle proportion investir dans chaque actif ?

Il existe une infinité de combinaisons possibles. Tester toutes les solutions manuellement est impossible.

### La solution

L'algorithme génétique simule l'évolution naturelle : des portefeuilles "naissent" aléatoirement, les meilleurs "survivent" et "se reproduisent", les moins bons sont éliminés. Génération après génération, la population converge vers les meilleures solutions.

### La valeur ajoutée académique

Contrairement à un conseiller financier classique qui propose 3-4 portefeuilles types, GenAlpha génère des dizaines de solutions **mathématiquement prouvées non-dominées** (front de Pareto) et laisse le décideur choisir en connaissance de cause. C'est la définition d'un **système d'aide à la décision multicritères (MCDSS)**.

---

## 3. Comment l'utiliser

### Flux d'utilisation typique

```
1. Configurer les actifs (ou utiliser ceux par défaut)
2. Régler les paramètres de l'algorithme
3. Lancer l'optimisation
4. Observer la convergence et le front de Pareto en temps réel
5. Consulter l'écran Résultats
6. Choisir un portefeuille selon sa tolérance au risque
```

### Étape par étape

**Configurer les actifs** — La section "Assets" dans la colonne gauche liste les actifs disponibles. Chaque actif est défini par son ticker, son nom, son rendement attendu (%) et sa volatilité (%). Vous pouvez ajouter, modifier ou supprimer des actifs via les boutons dédiés.

**Régler les paramètres** — Cinq sliders permettent de configurer l'algorithme génétique. Voir la section [Paramètres](#9-les-paramètres-de-lalgorithme) pour le détail de chaque paramètre.

**Lancer l'optimisation** — Cliquez sur "Launch optimisation". L'algorithme tourne en temps réel, les graphiques se mettent à jour génération après génération.

**Observer les graphiques** — Deux graphiques s'affichent en direct :
- *Fitness Convergence* : montre l'amélioration du meilleur portefeuille au fil des générations
- *Pareto Front* : montre tous les portefeuilles (gris) et les solutions non-dominées (bleu)

**Consulter les résultats** — À la fin, une bannière verte indique le nombre de solutions Pareto trouvées. Cliquez sur "Voir les résultats" pour accéder à l'écran de sélection.

**Choisir un portefeuille** — L'écran Résultats présente les solutions Pareto sous forme de tableau. Filtrez par tolérance au risque (Conservateur / Équilibré / Agressif) et sélectionnez le portefeuille qui correspond à vos objectifs.

---

## 4. Architecture technique

| Couche | Technologie |
|--------|-------------|
| Framework UI | React 19 + TypeScript |
| Build tool | Vite |
| Styles | Tailwind CSS v4 |
| Composants | shadcn/ui |
| Graphiques | Recharts |
| Icônes | Lucide React |
| Algorithme | NSGA-II — JavaScript pur (pas de backend) |

L'application est **100% frontend** — pas de serveur, pas de base de données. L'algorithme génétique tourne entièrement dans le navigateur via un générateur asynchrone JavaScript.

---

## 5. Prérequis

Avant d'installer le projet, assurez-vous d'avoir :

- **Node.js** version 18 ou supérieure — [télécharger](https://nodejs.org)
- **npm** version 9 ou supérieure (inclus avec Node.js)
- **Git** — [télécharger](https://git-scm.com)
- Un éditeur de code (VS Code recommandé)

Pour vérifier vos versions :

```bash
node --version   # doit afficher v18.x.x ou supérieur
npm --version    # doit afficher 9.x.x ou supérieur
git --version
```

---

## 6. Installation et lancement en local

### Cloner le projet

```bash
git clone https://github.com/sanzouh/GenAlpha.git
```

Si vous n'avez pas accès au repo Git, vous pouvez télécharger le projet en ZIP depuis GitHub (bouton "Code" > "Download ZIP"), puis décompresser l'archive.

### Accéder au dossier

```bash
cd GenAlpha
```

### Installer les dépendances

```bash
npm install
```

Cette commande installe toutes les bibliothèques listées dans `package.json`. L'installation prend environ 30 à 60 secondes selon votre connexion.

### Lancer en mode développement

```bash
npm run dev
```

L'application est maintenant accessible sur [http://localhost:5173](http://localhost:5173).

Le mode développement inclut le **Hot Module Replacement (HMR)** — toute modification du code est répercutée instantanément dans le navigateur sans recharger la page.

### Construire pour la production

```bash
npm run build
```

Génère les fichiers optimisés dans le dossier `dist/`. Ces fichiers peuvent être déployés sur n'importe quel hébergeur statique (Vercel, Netlify, GitHub Pages...).

### Prévisualiser le build de production

```bash
npm run preview
```

Lance un serveur local qui sert les fichiers du dossier `dist/`. Permet de vérifier le comportement en conditions réelles avant déploiement.

### Vérifier le code (linting)

```bash
npm run lint
```

Vérifie la qualité du code via ESLint. Corrige les erreurs signalées avant de commiter.

---

## 7. Structure du projet

```
GenAlpha/
├── src/
│   ├── components/           # Composants React réutilisables
│   │   ├── ui/               # Composants shadcn/ui (Button, Slider, Select...)
│   │   ├── AssetList/        # Liste et CRUD des actifs
│   │   │   ├── index.tsx     # Orchestrateur
│   │   │   ├── AssetCard.tsx # Carte d'un actif
│   │   │   └── AssetModal.tsx # Formulaire ajout/édition
│   │   ├── Topbar.tsx        # Barre de navigation principale
│   │   ├── ParamPanel.tsx    # Sliders des paramètres AG
│   │   ├── LaunchButton.tsx  # Bouton lancer/pause/resume
│   │   ├── MetricsBar.tsx    # Cartes métriques (rendement, risque, Sharpe)
│   │   ├── ProgressBar.tsx   # Barre de progression
│   │   ├── ConvergenceChart.tsx # Graphique fitness convergence
│   │   └── ParetoChart.tsx   # Graphique front de Pareto
│   ├── pages/
│   │   └── ResultsPage.tsx   # Écran de sélection du portefeuille
│   ├── lib/
│   │   └── geneticAlgorithm.ts # Algorithme NSGA-II complet
│   ├── data/
│   │   └── assets.ts         # Actifs par défaut + matrice de corrélation
│   ├── hooks/
│   │   └── useGeneticAlgorithm.ts # Hook React — pont entre algo et UI
│   ├── App.tsx               # Composant racine — layout principal
│   ├── main.tsx              # Point d'entrée React
│   └── index.css             # Variables CSS + classes Tailwind custom
├── public/                   # Assets statiques
├── package.json              # Dépendances et scripts
├── vite.config.ts            # Configuration Vite
├── tailwind.config.ts        # Configuration Tailwind
└── tsconfig.json             # Configuration TypeScript
```

### Fichiers clés à connaître

`src/lib/geneticAlgorithm.ts` — Le cœur de l'application. Contient l'implémentation NSGA-II complète : tri par fronts de dominance, calcul de la distance de crowding, sélection par tournoi, croisement uniforme et mutation. C'est ici que toute la logique d'optimisation réside.

`src/data/assets.ts` — Définit les actifs financiers disponibles et la matrice de corrélation entre eux. Modifiez ce fichier pour changer les actifs par défaut.

`src/hooks/useGeneticAlgorithm.ts` — Hook React qui orchestre l'exécution de l'algorithme et expose les états (génération courante, meilleur portefeuille, front de Pareto, historique fitness) aux composants UI.

`src/index.css` — Système de design complet : variables CSS pour les couleurs, fonds, typographie, et classes Tailwind custom (`.card`, `.pill-positive`, `.pill-academic`...).

---

## 8. Les actifs financiers

Les actifs par défaut couvrent un spectre large de profils risque/rendement :

| Ticker | Nom | Rendement attendu | Volatilité | Profil |
|--------|-----|-------------------|------------|--------|
| TBOND | US Treasury Bond | 3.5% | 4.2% | Ultra-conservateur |
| GOLD | Gold ETF | 6.8% | 12.5% | Refuge |
| AAPL | Apple Inc. | 12.8% | 20.4% | Modéré |
| MSFT | Microsoft Corp. | 14.2% | 22.1% | Modéré |
| TSLA | Tesla Inc. | 28.5% | 58.3% | Agressif |
| BTC | Bitcoin ETF | 45.0% | 82.0% | Spéculatif |

### Ajouter un actif personnalisé

Cliquez sur "+ Add" dans la section Assets. Renseignez :
- **Ticker** : identifiant court (ex: "NVDA")
- **Nom** : nom complet de l'entreprise
- **Rendement attendu** : rendement annuel historique en % (peut être négatif pour un actif de couverture)
- **Volatilité** : écart-type annualisé en % (toujours positif, jamais zéro)

### Modèle de volatilité

Deux modes sont disponibles via le sélecteur "Volatility model" :

- **Markowitz** (recommandé) : utilise la matrice de corrélation complète. `σp = √(ΣiΣj wi wj σi σj ρij)`. Modèle réaliste — la diversification réduit naturellement le risque global.
- **Linear** : somme pondérée simple des volatilités. Plus simple, produit plus de dispersion dans les résultats, utile pour explorer.

---

## 9. Les paramètres de l'algorithme

| Paramètre | Défaut | Plage | Rôle |
|-----------|--------|-------|------|
| Population | 80 | 20–200 | Nombre de portefeuilles évalués par génération |
| Générations | 60 | 20–100 | Nombre de cycles évolutifs |
| Crossover | 75% | 50–95% | Probabilité de croisement entre deux parents |
| Mutation | 3% | 1–20% | Probabilité de perturbation aléatoire d'un poids |
| Max Risk | 35% | 5–90% | Volatilité maximale tolérée |

### Conseils de réglage

**Pour un bon front de Pareto (arc bien dispersé) :**
```
Population:  100
Générations: 80
Crossover:   70%
Mutation:    5%
Max Risk:    70%
Mode:        markowitz
```

**Max Risk élevé (>60%)** — laisse les actifs agressifs (TSLA, BTC) apparaître dans le front Pareto, créant les extrémités hautes de l'arc.

**Mutation faible (1-5%)** — mutations douces qui affinent sans détruire. Au-delà de 10%, l'exploration devient trop aléatoire et nuit à la convergence.

**Population élevée (100+)** — plus de diversité initiale, meilleure couverture de l'espace rendement/risque.

---

## 10. Comprendre les résultats

### Graphique Fitness Convergence

Montre l'évolution du meilleur ratio Sharpe au fil des générations. Une courbe qui monte rapidement puis se stabilise indique une **bonne convergence** — l'algorithme a trouvé une zone optimale.

### Graphique Pareto Front

- **Points gris** : toute la population courante
- **Points bleus** : solutions non-dominées (front de Pareto)

Un bon front de Pareto forme un **arc de bas-gauche (faible risque, faible rendement) vers haut-droite (fort rendement, fort risque)**. Aucun point bleu ne peut être amélioré sur un critère sans dégrader l'autre.

### Métriques principales

- **Rendement attendu** : moyenne pondérée des rendements des actifs
- **Volatilité σ** : risque du portefeuille calculé selon Markowitz
- **Ratio Sharpe** : `(rendement - taux sans risque) / volatilité`. Mesure la qualité du rendement ajusté au risque. Plus il est élevé, meilleur est le portefeuille.

### Écran Résultats

Présente les solutions Pareto sous forme de tableau avec trois filtres de tolérance au risque :

- **Conservateur** — priorise les portefeuilles à faible volatilité
- **Équilibré** — meilleur ratio Sharpe, compromis optimal
- **Agressif** — priorise le rendement maximal

Sélectionnez un portefeuille pour voir le détail de l'allocation (donut chart + barres par actif) et confirmer votre choix.

---

## 11. Concepts académiques

### Algorithme génétique (AG)

Métaheuristique inspirée de l'évolution biologique. La population de solutions évolue par :
- **Sélection** : les meilleures solutions survivent
- **Croisement** : deux bonnes solutions se mélangent pour créer une meilleure
- **Mutation** : perturbations aléatoires pour explorer de nouvelles zones

### NSGA-II (Non-dominated Sorting Genetic Algorithm II)

Variante multiobjectif de l'AG (Deb et al., 2002). Au lieu d'optimiser un seul critère (le Sharpe), NSGA-II optimise simultanément rendement ET risque grâce à :

- **Tri par fronts de dominance** : chaque individu reçoit un rang selon combien de solutions le dominent
- **Distance de crowding** : préserve la diversité le long du front en favorisant les individus isolés

### Dominance de Pareto

Un portefeuille A **domine** un portefeuille B si A est au moins aussi bon sur tous les critères ET strictement meilleur sur au moins un. Le **front de Pareto** est l'ensemble des solutions que rien ne domine — les vrais meilleurs compromis.

### MCDSS (Multicriteria Decision Support System)

L'algorithme génère le front optimal. Le **décideur humain** applique ses préférences (tolérance au risque, objectifs de rendement) pour choisir parmi les solutions Pareto. La division des rôles algorithme/humain est le principe fondateur des MCDSS.

### Modèle de Markowitz

Formule de calcul de la volatilité d'un portefeuille tenant compte des corrélations entre actifs :

```
σp = √( ΣiΣj wi × wj × σi × σj × ρij )
```

Où `ρij` est la corrélation entre les actifs i et j. Un portefeuille diversifié avec des actifs faiblement corrélés a une volatilité inférieure à la somme des volatilités individuelles.

---

## 12. Roadmap

### Version actuelle (MVP)
- Algorithme NSGA-II fonctionnel
- Visualisation temps réel (convergence + Pareto)
- CRUD des actifs
- Écran de sélection des résultats
- Modèle de Markowitz avec matrice de corrélation

### Améliorations prévues
- Intégration API Yahoo Finance pour données boursières réelles
- Capital de départ — affichage des allocations en valeur monétaire
- Backtesting sur données historiques
- Export PDF du portefeuille sélectionné
- Persistance des actifs en localStorage
- Mode light/dark complet

---

## Dépendances principales

```json
{
  "react": "^19.x",
  "typescript": "^5.x",
  "vite": "^8.x",
  "tailwindcss": "^4.x",
  "recharts": "^3.x",
  "lucide-react": "^1.x",
  "shadcn/ui": "composants sélectifs"
}
```

---

## Licence

Projet académique — usage éducatif uniquement.

---

*Développé dans le cadre du cours d'Aide à la Décision et Optimisation Multicritères.*