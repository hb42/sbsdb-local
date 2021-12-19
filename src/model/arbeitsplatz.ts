import { Betrst } from "./betrst";
import { Hardware } from "./hardware";
import { Tag } from "./tag";

export interface Arbeitsplatz {
  apId: number;
  apname: string;
  bezeichnung: string;
  oeId: number;
  verantwOeId: number;
  bemerkung: string;

  apTypId: number;
  apTypBezeichnung: string;
  apTypFlag: number;
  apKatId: number;
  apKatBezeichnung: string;
  apKatFlag: number;

  tags: Tag[];

  oe: Betrst;
  verantwOe: Betrst;
  hw: Hardware[];

  hwTypStr: string; // pri HW ohne SerNr
  hwStr: string; //        mit SerNr
  sonstHwStr: string; // ges. HW fuer die Suche
  ipStr: string; // alle IPs
  macStr: string; //  dto.
  vlanStr: string; // dto.
  macsearch: string; // Suche in allen MACs
}
