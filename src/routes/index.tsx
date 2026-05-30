import { createFileRoute } from "@tanstack/react-router";
import { CherryMark } from "@/components/CherryMark";
import heroCherries from "@/assets/hero-cherries.jpg";
import productConfiture from "@/assets/product-confiture.jpg";
import productLiqueur from "@/assets/product-liqueur.jpg";
import productChocolat from "@/assets/product-chocolat.jpg";
import productSirop from "@/assets/product-sirop.jpg";
import storyArtisan from "@/assets/story-artisan.jpg";
import blogClafoutis from "@/assets/blog-clafoutis.jpg";
import blogCocktail from "@/assets/blog-cocktail.jpg";
import blogTarte from "@/assets/blog-tarte.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maison Cerisette — Artisans de la cerise depuis 1962" },
      { name: "description", content: "Confitures, liqueurs, chocolats et sirops artisanaux à base de cerises de Provence. Le savoir-faire d'une maison familiale française." },
      { property: "og:title", content: "Maison Cerisette — L'art de la cerise" },
      { property: "og:description", content: "Produits gourmands artisanaux à base de cerise. Tradition française, qualité premium." },
    ],
  }),
  component: Index,
});

const bestSellers = [
  { name: "Confiture de Cerise Noire", price: "12€", img: productConfiture, tag: "Best-seller", desc: "Lentement mijotée au cuivre" },
  { name: "Liqueur de Griotte", price: "38€", img: productLiqueur, tag: "Édition limitée", desc: "Vieillie 24 mois en fût" },
  { name: "Truffes Cœur Cerise", price: "24€", img: productChocolat, tag: "Nouveau", desc: "Chocolat noir 70%, cerise confite" },
  { name: "Sirop de Cerise Sauvage", price: "16€", img: productSirop, tag: "Best-seller", desc: "Récolte de juin, sans additif" },
];

const categories = [
  { name: "Confitures & Compotes", count: "12 produits" },
  { name: "Liqueurs & Spiritueux", count: "8 produits" },
  { name: "Chocolats & Confiseries", count: "15 produits" },
  { name: "Sirops & Boissons", count: "6 produits" },
];

const reviews = [
  { text: "Une découverte sublime. La confiture de cerise noire a un goût d'enfance, mais en plus raffiné. On sent le travail artisanal.", name: "Claire D.", city: "Lyon" },
  { text: "Les truffes cœur cerise sont absolument divines. Le packaging est à la hauteur du contenu — c'est un cadeau parfait.", name: "Antoine R.", city: "Paris" },
  { text: "La liqueur de griotte est une merveille. On retrouve la chaleur du sud et la patience du temps. Merci Maison Cerisette.", name: "Hélène M.", city: "Bordeaux" },
];

const articles = [
  { title: "Le clafoutis comme grand-mère", category: "Recette", read: "6 min", img: blogClafoutis },
  { title: "Cocktail signature : La Cerisette", category: "Mixologie", read: "4 min", img: blogCocktail },
  { title: "Tarte rustique aux griottes", category: "Recette", read: "8 min", img: blogTarte },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <Bestsellers />
        <Story />
        <Shop />
        <Newcomers />
        <Reviews />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3">
          <CherryMark className="w-9 h-10" />
          <div className="leading-tight">
            <div className="font-serif text-xl tracking-wide text-cherry-deep">Maison Cerisette</div>
            <div className="eyebrow text-[0.6rem] text-muted-foreground">depuis 1962</div>
          </div>
        </a>
        <nav className="hidden lg:flex items-center gap-10 text-sm">
          {[
            ["Boutique", "#boutique"],
            ["Notre histoire", "#histoire"],
            ["Nouveautés", "#nouveautes"],
            ["Recettes", "#blog"],
            ["Contact", "#contact"],
          ].map(([label, href]) => (
            <a key={label} href={href} className="text-foreground/80 hover:text-cherry transition-colors">{label}</a>
          ))}
        </nav>
        <div className="hidden lg:block">
          <a href="#boutique" className="btn-cherry !py-2.5 !px-5 !text-[0.7rem]">Nos produits</a>
        </div>
        <div className="flex items-center gap-5">
          <button aria-label="Recherche" className="text-foreground/70 hover:text-cherry transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5" strokeLinecap="round"/></svg>
          </button>
          <button aria-label="Compte" className="text-foreground/70 hover:text-cherry transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7" strokeLinecap="round"/></svg>
          </button>
          <button aria-label="Panier" className="relative text-foreground/70 hover:text-cherry transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M5 7h14l-1.5 11a2 2 0 0 1-2 1.7H8.5a2 2 0 0 1-2-1.7L5 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>
            <span className="absolute -top-1.5 -right-2 bg-cherry text-bone text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">2</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-12 lg:pt-20 pb-24 lg:pb-32 grid lg:grid-cols-12 gap-12 items-center">
        {/* Decorative blob */}
        <div className="absolute -top-20 -left-32 w-[28rem] h-[28rem] organic-blob bg-cream -z-0" />
        <div className="absolute top-40 right-0 w-72 h-72 leaf-shape bg-leaf/10 -z-0" />

        <div className="lg:col-span-6 relative z-10">
          <div className="eyebrow text-cherry mb-6 divider-cherry">Maison artisanale française</div>
          <h1 className="font-serif text-5xl lg:text-7xl leading-[1.05] text-cherry-deep">
            L'art de la cerise,<br />
            <em className="italic text-leaf-deep font-light">cueillie</em> et préservée
            <span className="text-cherry">.</span>
          </h1>
          <p className="mt-8 max-w-lg text-lg text-muted-foreground leading-relaxed">
            Depuis trois générations, nous transformons les cerises de nos vergers de Provence en confitures, liqueurs et douceurs d'exception.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#boutique" className="btn-cherry">
              Découvrir la boutique
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
            <a href="#histoire" className="btn-ghost">Notre histoire</a>
          </div>
          <div className="mt-14 flex items-center gap-8 text-xs text-muted-foreground">
            <Stat n="62 ans" l="de savoir-faire" />
            <Divider />
            <Stat n="100%" l="Provence" />
            <Divider />
            <Stat n="Sans" l="conservateurs" />
          </div>
        </div>

        <div className="lg:col-span-6 relative z-10">
          <div className="relative">
            <div className="absolute -inset-6 bg-cream organic-blob -z-10" />
            <img
              src={heroCherries}
              alt="Bol de cerises fraîches de Provence sur lin crème"
              width={1600}
              height={1200}
              className="w-full h-[32rem] object-cover rounded-[2rem]"
            />
            <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl shadow-xl p-5 max-w-[14rem] border border-border/40">
              <div className="flex items-center gap-2 mb-1">
                <CherryMark className="w-5 h-6" />
                <div className="eyebrow text-[0.6rem] text-cherry">Récolte 2025</div>
              </div>
              <p className="font-serif text-base text-cherry-deep leading-snug">
                Cerises noires du Ventoux, cueillies à la main.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="font-serif text-2xl text-cherry-deep">{n}</div>
      <div className="eyebrow text-[0.6rem] mt-1">{l}</div>
    </div>
  );
}
function Divider() {
  return <div className="w-px h-10 bg-border" />;
}

function Bestsellers() {
  return (
    <section className="py-24 lg:py-32 bg-cream/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between mb-14 flex-wrap gap-4">
          <div>
            <div className="eyebrow text-cherry mb-3">Best-sellers</div>
            <h2 className="font-serif text-4xl lg:text-5xl text-cherry-deep max-w-xl">Nos pièces signature, les préférées de la maison</h2>
          </div>
          <a href="#boutique" className="btn-ghost">Voir toute la collection</a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {bestSellers.map((p) => (
            <ProductCard key={p.name} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ name, price, img, tag, desc }: { name: string; price: string; img: string; tag: string; desc: string }) {
  return (
    <article className="card-product group">
      <div className="relative aspect-[4/5] overflow-hidden bg-cream">
        <img src={img} alt={name} width={900} height={1100} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <span className="absolute top-4 left-4 bg-bone/90 backdrop-blur text-cherry-deep text-[0.65rem] tracking-[0.2em] uppercase font-medium px-3 py-1.5 rounded-full">{tag}</span>
        <button aria-label="Favori" className="absolute top-4 right-4 w-9 h-9 bg-bone/90 backdrop-blur rounded-full flex items-center justify-center text-cherry hover:bg-cherry hover:text-bone transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9Z"/></svg>
        </button>
      </div>
      <div className="p-6">
        <h3 className="font-serif text-xl text-cherry-deep leading-tight">{name}</h3>
        <p className="text-sm text-muted-foreground mt-1.5">{desc}</p>
        <div className="mt-5 flex items-center justify-between">
          <span className="font-serif text-xl text-cherry">{price}</span>
          <button className="text-xs tracking-[0.18em] uppercase font-medium text-cherry-deep hover:text-cherry transition flex items-center gap-2">
            Ajouter
            <span className="w-7 h-7 rounded-full border border-cherry-deep/30 flex items-center justify-center">+</span>
          </button>
        </div>
      </div>
    </article>
  );
}

function Story() {
  return (
    <section id="histoire" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        <div className="lg:col-span-6 order-2 lg:order-1 relative">
          <div className="absolute -top-8 -right-8 w-48 h-48 organic-blob bg-leaf/10 -z-10" />
          <img src={storyArtisan} alt="Artisane cueillant des cerises dans le verger" width={1400} height={1100} loading="lazy" className="w-full h-[34rem] object-cover rounded-[2rem]" />
          <div className="absolute -bottom-6 right-6 bg-cherry text-bone p-6 rounded-2xl max-w-[15rem]">
            <div className="font-serif italic text-3xl leading-none">«</div>
            <p className="font-serif text-base mt-1 leading-snug">Le temps est notre meilleur ingrédient.</p>
            <div className="eyebrow text-[0.6rem] mt-3 opacity-80">— Madeleine, fondatrice</div>
          </div>
        </div>
        <div className="lg:col-span-6 order-1 lg:order-2">
          <div className="eyebrow text-cherry mb-4 divider-cherry">Notre histoire</div>
          <h2 className="font-serif text-4xl lg:text-5xl text-cherry-deep leading-tight">
            Trois générations,<br/>
            <em className="italic font-light text-leaf-deep">un seul fruit</em>, mille gestes.
          </h2>
          <p className="mt-8 text-lg text-muted-foreground leading-relaxed">
            Tout commence en 1962 dans un petit verger de Bonnieux, où Madeleine met en pot ses premières confitures. Soixante ans plus tard, c'est sa petite-fille Camille qui veille sur le cuivre, fidèle aux recettes — et aux mêmes arbres.
          </p>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Chaque cerise est cueillie à la main entre fin mai et début juillet. Nous travaillons en petites séries, sans additif ni colorant, parce qu'un fruit bien né n'a besoin de rien.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6 pt-8 border-t border-border">
            <StatBlock n="1962" l="Année fondatrice" />
            <StatBlock n="12 ha" l="de vergers" />
            <StatBlock n="Bio" l="depuis 2008" />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatBlock({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="font-serif text-3xl text-cherry">{n}</div>
      <div className="eyebrow text-[0.65rem] mt-2 text-muted-foreground">{l}</div>
    </div>
  );
}

function Shop() {
  return (
    <section id="boutique" className="py-24 lg:py-32 bg-cherry-deep text-bone relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-96 h-96 organic-blob bg-cherry/30" />
      <div className="absolute bottom-0 -left-32 w-80 h-80 leaf-shape bg-leaf/20" />
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="eyebrow text-cream/70 mb-4">La boutique</div>
          <h2 className="font-serif text-4xl lg:text-5xl">Explorez nos catégories</h2>
          <p className="mt-5 text-cream/80">Une collection patiemment composée, des confitures aux liqueurs rares.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((c, i) => (
            <a key={c.name} href="#" className="group block p-8 rounded-2xl border border-bone/15 hover:border-bone/40 transition-all hover:bg-bone/5">
              <div className="text-cream/50 font-serif text-3xl">0{i + 1}</div>
              <h3 className="font-serif text-2xl mt-8 leading-tight">{c.name}</h3>
              <div className="mt-4 flex items-center justify-between">
                <span className="eyebrow text-[0.65rem] text-cream/60">{c.count}</span>
                <span className="w-10 h-10 rounded-full border border-bone/30 flex items-center justify-center group-hover:bg-cherry group-hover:border-cherry transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Newcomers() {
  return (
    <section id="nouveautes" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 items-stretch">
          <div className="lg:col-span-5">
            <div className="eyebrow text-cherry mb-4 divider-cherry">Nouveautés</div>
            <h2 className="font-serif text-4xl lg:text-5xl text-cherry-deep leading-tight">
              La fraîcheur de la <em className="italic font-light text-leaf-deep">saison</em>, en édition limitée.
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Quelques pièces nouvelles, conçues autour de la récolte 2025. Disponibles tant qu'il en reste.
            </p>
            <a href="#" className="mt-8 inline-flex items-center gap-2 text-cherry font-medium text-sm hover:gap-3 transition-all">
              Voir toutes les nouveautés
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
            <ProductCard name="Truffes Cœur Cerise" price="24€" img={productChocolat} tag="Nouveau" desc="Édition récolte 2025" />
            <div className="bg-leaf/15 rounded-[1.25rem] p-8 flex flex-col justify-between sm:translate-y-12">
              <CherryMark className="w-12 h-14" />
              <div>
                <div className="eyebrow text-leaf-deep mb-3">Arrivage</div>
                <h3 className="font-serif text-2xl text-cherry-deep leading-tight">Coffret Découverte<br/>4 saveurs</h3>
                <p className="text-sm text-muted-foreground mt-3">Un assortiment pensé pour offrir, ou se faire plaisir.</p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="font-serif text-2xl text-cherry">58€</span>
                  <button className="btn-cherry !py-3 !px-5 !text-[0.7rem]">Précommander</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section className="py-24 lg:py-32 bg-cream/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="eyebrow text-cherry mb-4">Avis clients</div>
          <h2 className="font-serif text-4xl lg:text-5xl text-cherry-deep">Ce qu'on en dit autour de la table</h2>
          <div className="mt-6 flex items-center justify-center gap-1 text-cherry">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="m12 2 3 7 7 .5-5.5 4.8L18 22l-6-4-6 4 1.5-7.7L2 9.5 9 9z"/></svg>
            ))}
            <span className="ml-3 text-sm text-muted-foreground">4.9 / 5 — 2 480 avis vérifiés</span>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <blockquote key={r.name} className="bg-card p-8 rounded-2xl border border-border/40 hover:shadow-lg transition-shadow">
              <div className="font-serif italic text-5xl text-cherry leading-none mb-2">«</div>
              <p className="text-foreground/85 leading-relaxed">{r.text}</p>
              <footer className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                <div>
                  <div className="font-serif text-lg text-cherry-deep">{r.name}</div>
                  <div className="eyebrow text-[0.6rem] text-muted-foreground mt-1">{r.city}</div>
                </div>
                <div className="flex gap-0.5 text-cherry">
                  {[...Array(5)].map((_, i) => <svg key={i} className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="m12 2 3 7 7 .5-5.5 4.8L18 22l-6-4-6 4 1.5-7.7L2 9.5 9 9z"/></svg>)}
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

function Blog() {
  return (
    <section id="blog" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between mb-14 flex-wrap gap-4">
          <div>
            <div className="eyebrow text-cherry mb-3">Le carnet</div>
            <h2 className="font-serif text-4xl lg:text-5xl text-cherry-deep max-w-xl">Recettes & inspirations gourmandes</h2>
          </div>
          <a href="#" className="btn-ghost">Tous les articles</a>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((a) => (
            <article key={a.title} className="group cursor-pointer">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-cream">
                <img src={a.img} alt={a.title} width={1000} height={800} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="mt-6 flex items-center gap-3 eyebrow text-[0.65rem]">
                <span className="text-cherry">{a.category}</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                <span className="text-muted-foreground">{a.read} de lecture</span>
              </div>
              <h3 className="font-serif text-2xl text-cherry-deep mt-3 leading-snug group-hover:text-cherry transition">{a.title}</h3>
              <div className="mt-4 text-sm text-cherry font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                Lire l'article
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="py-24 lg:py-32 bg-cream/40">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <div className="bg-card rounded-[2rem] p-10 lg:p-16 grid lg:grid-cols-2 gap-12 border border-border/40 shadow-sm">
          <div>
            <div className="eyebrow text-cherry mb-4 divider-cherry">Contact</div>
            <h2 className="font-serif text-4xl lg:text-5xl text-cherry-deep leading-tight">Une question, un mot doux ?</h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">Nous répondons en personne, sous 48 heures. Pour les commandes professionnelles ou les visites du verger, écrivez-nous.</p>
            <div className="mt-10 space-y-5 text-sm">
              <ContactLine icon="📍" label="Notre verger" value="Domaine de la Cerisette, 84480 Bonnieux, Provence" />
              <ContactLine icon="✉" label="E-mail" value="bonjour@maison-cerisette.fr" />
              <ContactLine icon="☏" label="Téléphone" value="+33 4 90 75 12 34" />
            </div>
          </div>
          <form className="space-y-5">
            <Field label="Votre nom" placeholder="Camille Durand" />
            <Field label="Votre e-mail" type="email" placeholder="camille@exemple.fr" />
            <Field label="Sujet" placeholder="Une commande spéciale…" />
            <div>
              <label className="eyebrow text-[0.65rem] text-muted-foreground block mb-2">Votre message</label>
              <textarea rows={5} placeholder="Dites-nous tout…" className="w-full bg-cream/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cherry focus:bg-bone transition resize-none" />
            </div>
            <button type="submit" className="btn-cherry w-full justify-center">
              Envoyer le message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function ContactLine({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <span className="w-10 h-10 rounded-full bg-cherry/10 text-cherry flex items-center justify-center text-sm flex-shrink-0">{icon}</span>
      <div>
        <div className="eyebrow text-[0.6rem] text-muted-foreground">{label}</div>
        <div className="font-serif text-lg text-cherry-deep mt-0.5">{value}</div>
      </div>
    </div>
  );
}

function Field({ label, type = "text", placeholder }: { label: string; type?: string; placeholder: string }) {
  return (
    <div>
      <label className="eyebrow text-[0.65rem] text-muted-foreground block mb-2">{label}</label>
      <input type={type} placeholder={placeholder} className="w-full bg-cream/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cherry focus:bg-bone transition" />
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-cherry-deep text-bone pt-20 pb-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 organic-blob bg-cherry/25 -translate-y-1/2 translate-x-1/4" />
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
        {/* Newsletter */}
        <div className="border-b border-bone/15 pb-14 mb-14 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="font-serif text-3xl lg:text-4xl">Recevez nos lettres gourmandes</h3>
            <p className="mt-3 text-bone/70">Recettes saisonnières, arrivages et avant-premières. Une lettre par mois, jamais plus.</p>
          </div>
          <form className="flex gap-3">
            <input type="email" placeholder="votre@email.fr" className="flex-1 bg-bone/10 border border-bone/20 rounded-full px-6 py-4 text-sm placeholder:text-bone/50 focus:outline-none focus:border-bone/60" />
            <button type="submit" className="bg-bone text-cherry-deep px-6 py-4 rounded-full text-xs tracking-[0.18em] uppercase font-medium hover:bg-cream transition">S'abonner</button>
          </form>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <CherryMark className="w-9 h-10" />
              <div>
                <div className="font-serif text-xl">Maison Cerisette</div>
                <div className="eyebrow text-[0.6rem] opacity-70">Provence, depuis 1962</div>
              </div>
            </div>
            <p className="mt-6 text-bone/70 text-sm leading-relaxed max-w-sm">
              Maison familiale artisanale dédiée à la cerise. Confitures, liqueurs, chocolats et sirops élaborés en petites séries au cœur du Luberon.
            </p>
            <div className="mt-6 flex gap-3">
              {["Instagram", "Facebook", "Pinterest", "TikTok"].map((s) => (
                <a key={s} href="#" aria-label={s} className="w-10 h-10 rounded-full border border-bone/25 flex items-center justify-center text-bone/80 hover:bg-bone hover:text-cherry-deep transition">
                  <span className="text-[10px] uppercase tracking-wider">{s[0]}</span>
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Boutique" links={["Confitures", "Liqueurs", "Chocolats", "Sirops", "Coffrets cadeaux", "Édition limitée"]} />
          <FooterCol title="Maison" links={["Notre histoire", "Le verger", "Savoir-faire", "Engagement bio", "Presse", "Recrutement"]} />
          <FooterCol title="Aide" links={["Livraison", "Retours", "Mentions légales", "CGV", "Confidentialité", "Contact"]} />
        </div>

        <div className="mt-16 pt-8 border-t border-bone/15 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-bone/60">
          <div>© 2026 Maison Cerisette. Tous droits réservés.</div>
          <div className="flex items-center gap-6">
            <span>Paiement sécurisé</span>
            <span>Livraison en France & Europe</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="lg:col-span-2 lg:col-start-auto">
      <h4 className="eyebrow text-bone/60 mb-5">{title}</h4>
      <ul className="space-y-3 text-sm text-bone/85">
        {links.map((l) => (
          <li key={l}><a href="#" className="hover:text-bone transition">{l}</a></li>
        ))}
      </ul>
    </div>
  );
}
