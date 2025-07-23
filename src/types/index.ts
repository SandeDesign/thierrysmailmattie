export interface User {
  uid: string;
  email: string;
  displayName?: string;
  mfaEnabled?: boolean;
}

export interface PraktischeInfo {
  // Verplichte velden
  volledigeNaam: string;
  bsn: string;
  geboortedatum: string;
  banknummer: string;
  straat: string;
  huisnummer: string;
  postcode: string;
  woonplaats: string;
  provincie: string;
  land: string;
  telefoon: string;
  email: string;
  uitvaartverzekering: boolean;
  uitvaartverzekeringDetails?: string;
  testament: boolean;
  testamentNotaris?: string;
  executeur?: string;
  
  // Optionele velden
  donorRegistratie?: boolean;
  donorToelichting?: string;
  dierbareBezittingen?: string;
  belangrijkeDocumenten?: string;
}

export interface WishList {
  // Verplichte velden
  overlijdensbericht: boolean;
  doodskist: string;
  laatsteVerzorging: string;
  opbaringLocatie: 'thuis' | 'uitvaartcentrum';
  soortUitvaart: 'begraven' | 'cremeren';
  familieGraf?: boolean;
  begraafplaats?: string;
  naCeremonie: boolean;
  laatsteSamenkomst: boolean;
  
  // Optionele velden
  kennisgevingDetails?: string;
  muziekWensen?: string;
  bloemenWensen?: string;
  condoleanceVoorkeuren?: string;
  ceremoniDetails?: string;
  genodigdenLijst?: string;
}

export interface ZakelijkAbonnement {
  id: string;
  categorie: 'communicatie' | 'administratie' | 'professioneel' | 'marketing' | 'software';
  naam: string;
  provider: string;
  klantnummer?: string;
  telefoon?: string;
  email?: string;
  login?: string;
  password?: string;
  notities?: string;
  completed: boolean;
}

export interface PriveAbonnement {
  id: string;
  categorie: 'communicatie' | 'financieel' | 'wonen' | 'zorg' | 'lifestyle';
  naam: string;
  provider: string;
  klantnummer?: string;
  telefoon?: string;
  email?: string;
  login?: string;
  password?: string;
  notities?: string;
  completed: boolean;
}

export interface AppData {
  praktischeInfo: PraktischeInfo;
  wishList: WishList;
  zakelijkAbonnementen: ZakelijkAbonnement[];
  priveAbonnementen: PriveAbonnement[];
  lastUpdated: Date;
}