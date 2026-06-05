# Proposition Commerciale - Application de Vente

## 1. Presentation generale

Cette application est une solution e-commerce complete adaptee a la vente de produits en ligne.  
Le projet actuel comprend une application client complete et une application d'administration exploitable pour la gestion commerciale.

Important : dans l'etat actuel du projet, l'application comprend une partie client et une partie administration deja exploitable.

## 2. Options actuelles - Application client

### Navigation et experience utilisateur

- Accueil commercial avec mise en avant des produits et categories.
- Catalogue produits avec recherche.
- Filtrage par categorie.
- Tri par prix croissant / decroissant.
- Fiches produit detaillees.
- Produits associes / recommandations.
- Interface responsive pour mobile et desktop.
- Site bilingue FR / EN.

### Gestion des produits cote client

- Affichage des categories.
- Affichage des stocks disponibles.
- Affichage des promotions actives.
- Affichage du prix normal et du prix en promotion.

### Panier et commande

- Ajout au panier.
- Modification des quantites.
- Verification du stock avant validation.
- Calcul du sous-total, frais de livraison et total.
- Choix du mode de livraison :
  - Livraison standard.
  - Livraison le jour meme pour certaines villes.

### Paiement

- Paiement a la livraison.
- Paiement en ligne via Stripe.
- Confirmation de commande apres paiement en ligne.

### Adresse et livraison

- Saisie manuelle de l'adresse.
- Recuperation de la position actuelle du client.
- Conversion de la geolocalisation en adresse exploitable.
- Enregistrement d'adresses client.

### Compte client

- Creation de compte.
- Connexion par email ou telephone.
- Verification email avant activation.
- Gestion du mot de passe.
- Mise a jour du profil client.
- Upload de photo de profil.
- Historique des commandes.
- Consultation du detail d'une commande.

### Suivi et relation client

- Statuts de commande prevus dans la base :
  - En cours.
  - Confirmee.
  - En route.
  - Livree.
  - Annulee.
  - Appel client / non reponse.

## 3. Options actuelles - Application admin / back-office

### Gestion catalogue

- Ajouter un produit.
- Modifier un produit.
- Supprimer un produit.
- Activer / desactiver un produit.
- Gerer le stock.
- Gerer le prix.
- Gerer l'unite de vente.
- Associer un produit a une categorie.
- Gerer les visuels produits via Cloudinary.

### Gestion categories

- Gestion des categories depuis la base et l'API.
- Activation / desactivation des categories.
- Suppression controlee des categories.
- Deplacement des produits vers une categorie de remplacement en cas de suppression.

### Gestion promotions

- Creer une offre.
- Modifier une offre.
- Supprimer une offre.
- Activer / desactiver une offre.
- Associer une promotion a un produit.
- Retirer une promotion d'un produit.

### Gestion commandes

- Enregistrement des commandes en base.
- Gestion des lignes de commande.
- Tableau de bord de suivi des commandes.
- Gestion visuelle des commandes.
- Mise a jour du statut des commandes.
- Suppression de commandes.
- Gestion du mode de paiement :
  - Especes.
  - En ligne.
- Gestion des adresses de livraison.
- Gestion des statuts de commande.

### Gestion utilisateurs

- Creation de comptes clients.
- Gestion visuelle des clients.
- Mise a jour des profils clients.
- Gestion du role client / admin dans la base.
- Suspension / desactivation de comptes.
- Suppression de comptes.
- Gestion de la securite :
  - Mot de passe chiffre.
  - Verrouillage temporaire apres plusieurs echecs.
  - Suivi de derniere connexion.
  - Verification email.

### Pilotage admin et reporting

- Vraie interface admin.
- Tableau de bord.
- Gestion visuelle des promotions.

### Securite admin

- Connexion administrateur separee.
- Session HTTP-only securisee.
- Protection des routes admin.
- Verification d'origine sur les operations sensibles.
- Limitation des tentatives de connexion.
- Controle de la presence des secrets critiques avant mise en production.

## 4. Proposition de prix

Les prix ci-dessous sont une proposition commerciale coherente avec :

- le niveau actuel de personnalisation du projet,
- la presence d'un systeme de commande complet,
- la gestion des comptes clients,
- le paiement en ligne Stripe,
- la gestion promotions / produits / commandes,
- et les reperes observes sur le marche tunisien en 2026.

### References de marche consultees

- ReadyGo indique qu'un site e-commerce en Tunisie en 2026 demarre frequemment autour de 2500 DT, avec surcout pour le multilingue et les options avancees : [ReadyGo](https://readygo.tn/blog/combien-coute-site-web-tunisie)
- Yalla Souk propose une formule SaaS standard a 50 DT / mois pour une boutique plus simple et mutualisee : [Yalla Souk](https://yalla-souk.tn/en)
- SmartBS se positionne sur une logique SaaS / cloud prive avec support inclus pour des besoins plus structures : [SmartBS](https://smartbs.tn/)

### A. Prix de vente definitive

**Prix recommande pour vendre l'application : 2 500 DT**

Cette formule inclut :

- livraison du projet dans son etat actuel,
- transfert du code source,
- installation initiale,
- aucune mise a jour incluse apres livraison,
- aucune maintenance incluse,
- toute intervention future facturee separement.

### Politique d'intervention apres vente

Comme tu l'as demande, la formule vente ne comprend pas les mises a jour.  
Chaque intervention est facturee a part avec augmentation de prix.

Tu peux aussi presenter la regle ainsi :

**Toute demande hors livraison initiale est facturee selon la difficulte du probleme et la nature de l'intervention, avec revalorisation du prix selon l'importance du besoin.**

### B. Prix de location

**Prix recommande pour louer l'application : 250 DT / mois**

**Uniquement pour la location : premier mois gratuit**

Cette formule inclut :

- utilisation continue de l'application,
- mises a jour correctives,
- mises a jour d'amelioration,
- interventions techniques mineures gratuites,
- support courant,
- maintenance de suivi.

### Ce que couvre la location a 250 DT / mois

- corrections de bugs,
- petites adaptations fonctionnelles,
- assistance technique courante,
- suivi de la disponibilite generale,
- evolutions legeres sans refonte majeure.

### Ce qui reste hors forfait location

- refonte complete du design,
- ajout d'un module lourd,
- application mobile native,
- marketplace multi-vendeurs,
- ERP / facturation avancee / POS,
- connecteurs specifiques externes complexes.

Ces demandes peuvent etre facturees en supplement sur devis.

## 5. Recommendation commerciale

Pour bien vendre l'offre, tu peux presenter 2 niveaux :

### Offre 1 - Vente definitive

- 2 500 DT une seule fois.
- Sans mises a jour.
- Sans maintenance.
- Interventions futures facturees separement.

### Offre 2 - Location mensuelle

- 250 DT / mois.
- Premier mois gratuit.
- Mises a jour incluses.
- Interventions mineures incluses.
- Solution ideale pour un client qui veut de la stabilite et un accompagnement.

## 6. Mises a jour possibles a proposer

Voici une liste d'evolutions credibles a proposer ensuite au client :

### Mises a jour commerciales

- Ajout de codes promo.
- Packs produit.
- Upsell / cross-sell.
- Programme de fidelite.
- Bons d'achat.
- Produits favoris / liste d'envies.
- Avis clients reels.

### Mises a jour logistiques

- Suivi livreur en temps reel.
- Creneaux horaires de livraison.
- Zones de livraison avec frais dynamiques.
- Gestion avancee du stock par alerte.
- Gestion de rupture et precommande.

### Mises a jour marketing

- Newsletter.
- Notifications WhatsApp automatiques.
- Notifications email automatiques.
- Pixel Meta / Google Analytics / conversion tracking.
- SEO avance.
- Blog integre.

### Mises a jour admin

- Tableau de bord avec statistiques avancees.
- Historique des actions admin.
- Export Excel / PDF.

### Mises a jour paiement

- Ajout de passerelles locales tunisiennes.
- Paiement partiel.
- Paiement a la commande + solde a la livraison.
- Factures automatiques apres paiement.

### Mises a jour securite

- Double authentification admin.
- Journal de connexion.
- Gestion de permissions avancees.
- Sauvegardes automatiques.

### Mises a jour produit

- Variantes produit.
- Poids / formats / calibres.
- Galerie images multiple.
- Video produit.
- Disponibilite par saison.

### Mises a jour plateforme

- Version arabe.
- Application mobile.
- Progressive Web App (PWA).
- Multi-boutique.
- Multi-vendeur / marketplace.
- API publique pour partenaires.

## 7. Conclusion

Cette application est deja une base e-commerce solide, exploitable commercialement, avec paiement, gestion compte client, commandes, promotions et catalogue.

La meilleure strategie commerciale est :

- **vente definitive a 2 500 DT** pour un client qui veut posseder la solution sans support inclus,
- **location a 250 DT / mois** pour un client qui veut une solution suivie, mise a jour et maintenue.

## 8. Formulation courte a utiliser avec ton client

**Vente definitive :** 2 500 DT  
Solution livree une seule fois, sans mises a jour. Toute intervention future est facturee en supplement selon la difficulte du probleme.

**Location mensuelle uniquement :** premier mois gratuit puis 250 DT / mois  
Solution avec mises a jour, maintenance courante et interventions mineures incluses.
