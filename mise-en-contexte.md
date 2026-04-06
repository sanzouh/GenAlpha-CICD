# Optimisation de Portefeuille par Algorithme Génétique

## C’est quoi le problème qu’on résout ?

Imagine que tu as **6 entreprises** dans lesquelles tu peux investir.  
Tu as un budget — disons **1000 €**.

La question est : **combien mettre dans chaque entreprise ?**

Tu pourrais mettre tout dans **NVDA** qui rapporte le plus (+28,4 %).  
Mais NVDA est aussi très instable — un jour +10 %, le lendemain -15 %. C’est le risque.

**Donc le vrai problème c’est :**  
Trouver la **meilleure répartition possible** qui maximise le **gain** **ET** minimise le **risque** en même temps.

Ces deux objectifs sont contradictoires — plus de gain = plus de risque en général.  
C’est ce qu’on appelle un **problème multi-objectif**.

---

## Pourquoi un algorithme génétique ?

Ce problème a une **infinité de solutions possibles**.  
Si tu as 6 actifs, tu peux mettre 10 %/20 %/15 %/25 %/10 %/20 %, ou 5 %/5 %/40 %/20 %/15 %/15 %, ou… des millions de combinaisons.

Tester toutes les combinaisons une par une prendrait **trop longtemps**.

L’**algorithme génétique** s’inspire de la **sélection naturelle de Darwin** — les meilleures solutions survivent, se reproduisent, et donnent de meilleures solutions à chaque génération.

C’est une **recherche intelligente** dans un espace immense.

---

## Les 5 étapes de l’algorithme — dans notre contexte

### Étape 1 — Population initiale

On crée **80 portefeuilles au hasard**.  
Chaque portefeuille c’est un tableau de 6 nombres qui somment à 1 :

**Portefeuille A :** `[0.20, 0.15, 0.30, 0.10, 0.15, 0.10]`  
**AAPL MSFT TSLA GOOGL AMZN NVDA**

= 20 % dans Apple, 15 % dans Microsoft, etc.

C’est la **"génération 0"** — 80 solutions aléatoires, probablement pas très bonnes.

### Étape 2 — Évaluation (Fitness)

Pour chaque portefeuille, on calcule **3 choses** :

- **Rendement attendu** — la moyenne pondérée des gains.  
  Si tu mets 20 % dans AAPL (+12,4 %) et 80 % dans NVDA (+28,4 %) :  
  `0.2 × 12.4 + 0.8 × 28.4 = 25,2 %`

- **Volatilité (risque)** — à quel point les gains varient.  
  Formule de Markowitz :
  ```math
  volatilité = √( Σ wi² × vi² )
  ```

En clair : chaque actif contribue au risque total proportionnellement au **carré de son poids**.

- **Ratio de Sharpe** — c’est le **score final** du portefeuille :

  ```math
  Sharpe = \frac{\text{Rendement} - \text{Taux sans risque}}{\text{Volatilité}} = \frac{25,2\ \% - 2\ \%}{\text{volatilité}}
  ```

Le taux sans risque (**2 %**) c’est ce que tu gagnerais en mettant ton argent à la banque sans risque.

Le **Sharpe** mesure combien tu gagnes **au-delà de la banque**, pour chaque unité de risque prise.  
**Plus le Sharpe est élevé, meilleur est le portefeuille.**

---

### Étape 3 — Sélection

On trie les 80 portefeuilles par **Sharpe décroissant**.  
On garde le **top 25 %** — les **20 meilleurs**.  
Les 60 autres sont éliminés.

C’est la **sélection naturelle** : les plus adaptés survivent.

### Types de séléction choisi

**Sélection par rang** :
Cette technique de sélection choisit **toujours** les individus possédant les **meilleurs scores d’adaptation**.

### Les autres types fréquents

- **Technique de la roulette** (ou roue de la fortune)  
  Pour chaque individu, la probabilité d’être sélectionné est **proportionnelle** à son adaptation au problème.

- **Sélection par tournoi**  
  Cette technique utilise la sélection proportionnelle sur des paires d’individus, puis choisit parmi ces paires l’individu qui a le **meilleur score d’adaptation**.

- **Sélection uniforme**  
  La sélection se fait **aléatoirement**, uniformément et **sans intervention** de la valeur d’adaptation.

### ─── Élitisme ───

Les **20 meilleurs individus** (les élites) sont **copiés directement** dans la nouvelle population.

→ Cela garantit que **20 des 80** portefeuilles de la génération suivante sont déjà les meilleurs de la génération précédente.

**Avantage** : on ne perd jamais les meilleures solutions trouvées jusqu’ici.

---

### Étape 4 — Reproduction

Les 20 survivants se « reproduisent » pour recréer **80 portefeuilles** :

#### Croisement

On prend deux parents et on mélange leurs poids. À chaque actif, on choisit aléatoirement le poids du parent A ou du parent B.

**Parent A :** `[0.20, 0.15, 0.30, 0.10, 0.15, 0.10]`  
**Parent B :** `[0.05, 0.35, 0.10, 0.25, 0.15, 0.10]`  
**Enfant :** `[0.20, 0.35, 0.10, 0.10, 0.15, 0.10]` ← mélange

### Le type choisi : Croisement uniforme

À chaque position, on tire à pile ou face entre le parent A et le parent B.

#### Pourquoi ce choix ?

Parce que nos « gènes » sont des **poids continus indépendants**.  
La position d’un poids dans le tableau n’a pas de signification ordonnée.

Le **croisement uniforme** mélange mieux les caractéristiques dans ce cas précis.

Le croisement en un point est plus adapté aux génomes binaires (comme le problème du sac à dos).

### Les autres types de croisement

- **One-point (croisement en un point)**  
  Consiste à fusionner les particularités de deux individus à partir d’un **pivot unique**, afin d’obtenir un ou deux enfants.

- **N-point (croisement en n points)**  
  Repose sur le même principe, sauf qu’il y a **n pivots** au lieu d’un seul.

#### Mutation

Avec une faible probabilité (**8 %**), on perturbe légèrement un poids.  
Ça empêche l’algo de rester bloqué sur une solution locale et explore de nouvelles zones.

**Avant mutation :** `[0.20, 0.35, 0.10, 0.10, 0.15, 0.10]`  
**Après mutation :** `[0.20, 0.35, 0.10, 0.13, 0.15, 0.10]` ← GOOGL légèrement augmenté

### L’équilibre délicat de la mutation

La mutation est un paramètre sensible qui doit trouver le juste milieu :

- **Trop faible (1-2 %)**  
  L’algorithme explore peu et risque de rester bloqué sur un **minimum local**.

- **Trop élevée (> 20 %)**  
  Les enfants ressemblent plus à du **hasard** qu’à leurs parents : la convergence est détruite.

- **8 %** → **Valeur idéale**  
  Suffisamment élevée pour explorer de nouvelles zones, tout en préservant l’information génétique accumulée par les parents.

C’est cet équilibre qui permet à l’algorithme génétique d’être à la fois **efficace** et **robuste**.

Après croisement et mutation, on **renormalise** — on divise chaque poids par la somme totale pour que ça fasse toujours **1**.

### Renormalisation

La renormalisation est nécessaire **partout où les gènes ont une contrainte de somme**.

Dans notre cas, la contrainte est claire :  
**la somme des poids doit toujours être égale à 1** (soit 100 % du capital alloué).

Après le croisement et la mutation, les poids ne somment plus forcément à 1. La renormalisation corrige cela automatiquement.

**Exemple :**

- Après mutation : `[0.20, 0.35, 0.10, 0.13, 0.15, 0.10]` → somme = **1.03**
- Après renormalisation : `[0.194, 0.340, 0.097, 0.126, 0.146, 0.097]` → somme = **1.00**

---

**À noter :**  
Dans le problème du sac à dos (où le génome est binaire 0/1), il n’y a pas de contrainte de somme.  
Donc **pas de renormalisation** nécessaire dans ce type de problème.

---

### Étape 5 — Front de Pareto

C’est le **concept le plus important** pour la partie multi-objectif.

Un portefeuille **A domine** un portefeuille **B** si :

- A a un rendement **supérieur ou égal** à B
- A a un risque **inférieur ou égal** à B
- Et A est **strictement meilleur** sur au moins un des deux critères

Le **front de Pareto** = tous les portefeuilles que personne ne domine.

Ce sont les solutions où il est **impossible d’améliorer le rendement sans augmenter le risque**, et vice versa.  
C’est l’ensemble des **meilleurs compromis possibles** — ce qu’on présente au décideur.

---

## Conclusion

On répète ces **5 étapes 60 fois** (60 générations).  
À chaque génération la population s’améliore.

C’est ce que montre le **graphique de convergence** — le Sharpe monte au fil des générations.
