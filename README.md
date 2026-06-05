Maison Cerisette

Application e-commerce client basee sur la configuration et les fonctionnalites de `gavroche`, avec le branding et les assets du mockup Maison Cerisette.

Fonctionnalites reprises:
- Catalogue produits avec categories dynamiques Supabase
- Recherche, tri, fiches produit et produits similaires
- Panier, checkout et confirmation de commande
- Authentification, compte client, profil, adresses et historique commandes
- API produits, categories, utilisateurs, offres et commandes
- Paiement Stripe et paiement a la livraison
- Emails de verification et sessions client

Commandes:

```bash
pnpm install
pnpm run build
pnpm exec next dev -H 127.0.0.1 -p 3001
```

Le fichier `.env.local` a ete repris depuis `SeaFood/gavroche` pour conserver la meme configuration locale.
