export interface Offer {
  id: number
  nom: string
  dateDebut: string
  dateFin: string
  active: boolean
  nouveauPrix: number
}

export interface ActiveProductOffer extends Offer {
  productId: number
}

export interface CreateOfferInput {
  nom: string
  dateDebut: string
  dateFin: string
  active?: boolean
  nouveauPrix: number
}

export interface UpdateOfferInput {
  nom?: string
  dateDebut?: string
  dateFin?: string
  active?: boolean
  nouveauPrix?: number
}

export interface ApplyOfferInput {
  productId: number
  offerId: number
}
