export type Vibe       = 'wild' | 'chill' | 'dance' | 'birthday' | 'casual'
export type WhosComing = 'friends' | 'work' | 'couples' | 'mixed'
export type Budget     = '0-20' | '20-50' | '50-100' | 'splurge'
export type DrinkType  = 'beer' | 'wine' | 'cocktails' | 'shots' | 'sober'
export type HasCards   = 'yes' | 'no' | 'can-get'

export interface FormState {
  city:       string
  groupSize:  number
  vibe:       Vibe | null
  whosComing: WhosComing | null
  budget:     Budget | null
  drinkType:  DrinkType | null
  hasCards:   HasCards
  notes:      string
}

export interface Venue {
  name:     string
  address:  string
  category: string
  mapsUrl:  string
}

export interface DrinkingGame {
  name:          string
  tagline:       string
  rules:         string[]
  requiresCards: boolean
  requiresDice:  boolean
}

export interface Plan {
  games: DrinkingGame[]
  activity: {
    name:        string
    description: string
    venues:      Venue[]
  }
  backup: {
    name:   string
    venues: Venue[]
  }
}
