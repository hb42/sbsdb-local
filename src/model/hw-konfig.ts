export interface HwKonfig {
  id: number;
  bezeichnung: string;
  hersteller: string;
  hd: string;
  prozessor: string;
  ram: string;
  sonst: string;
  video: string;

  hwTypId: number;
  hwTypBezeichnung: string;
  hwTypFlag: number;

  apKatId: number;
  apKatBezeichnung: string;
  apKatFlag: number;

  konfiguration: string;
  deviceCount?: number;
  apCount?: number;
}
