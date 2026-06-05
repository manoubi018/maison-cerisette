"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"

export default function ContactPage() {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="bg-primary text-primary-foreground py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">{t("Contact Us", "Contactez-nous")}</h1>
            <p className="text-lg text-primary-foreground/90">
              {t("We're here to help. Reach out with any questions or concerns", "Nous sommes la pour vous aider. Ecrivez-nous pour toute question")}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6">{t("Send us a Message", "Envoyez-nous un message")}</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">{t("Your Name *", "Votre nom *")}</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={t("John Doe", "Nom complet")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">{t("Email Address *", "Adresse email *")}</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">{t("Phone Number", "Telephone")}</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="+216 XX XXX XXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">{t("Subject *", "Sujet *")}</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={t("How can we help?", "Comment pouvons-nous vous aider ?")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">{t("Message *", "Message *")}</label>
                  <textarea
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={t("Your message...", "Votre message...")}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full">
                  {t("Send Message", "Envoyer le message")}
                </Button>
              </form>
            </div>

            <div className="space-y-8">
              <div className="bg-card border border-border rounded-lg p-8">
                <h3 className="text-xl font-bold mb-2">{t("Visit Us", "Venez nous voir")}</h3>
                <p className="text-muted-foreground mb-4">{t("Maison Cerisette, Tunis, Tunisia", "Maison Cerisette, Tunis, Tunisie")}</p>
                <div className="rounded-lg overflow-hidden border border-border">
                  <iframe
                    title="Maison Cerisette location map"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=10.155%2C36.802%2C10.205%2C36.838&layer=mapnik&marker=36.8189%2C10.1658"
                    className="w-full h-64"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-8">
                <h3 className="text-xl font-bold mb-2">{t("Phone", "Telephone")}</h3>
                <p className="text-muted-foreground mb-2">{t("Call us during business hours", "Appelez-nous pendant les heures d'ouverture")}</p>
                <a href="tel:+216" className="text-primary hover:underline font-semibold text-lg">
                  +216 XX XXX XXXX
                </a>
              </div>

              <div className="bg-card border border-border rounded-lg p-8">
                <h3 className="text-xl font-bold mb-2">Email</h3>
                <p className="text-muted-foreground mb-2">{t("Send us an email anytime", "Envoyez-nous un email a tout moment")}</p>
                <a href="mailto:contact@maison-cerisette.tn" className="text-primary hover:underline font-semibold text-lg">
                  contact@maison-cerisette.tn
                </a>
              </div>

              <div className="bg-card border border-border rounded-lg p-8">
                <h3 className="text-xl font-bold mb-2">WhatsApp</h3>
                <p className="text-muted-foreground mb-4">{t("Quick response on WhatsApp", "Reponse rapide sur WhatsApp")}</p>
                <a
                  href="https://wa.me/216"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-accent text-accent-foreground px-6 py-2 rounded-lg hover:opacity-90 font-semibold"
                >
                  {t("Chat on WhatsApp", "Discuter sur WhatsApp")}
                </a>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-8">
                <h3 className="text-xl font-bold mb-3">{t("Business Hours", "Horaires")}</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>{t("Monday - Friday: 9:00 AM - 6:00 PM", "Lundi - Vendredi : 9h00 - 18h00")}</li>
                  <li>{t("Saturday: 10:00 AM - 4:00 PM", "Samedi : 10h00 - 16h00")}</li>
                  <li>{t("Sunday: Closed", "Dimanche : ferme")}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
