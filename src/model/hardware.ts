import { Arbeitsplatz } from "./arbeitsplatz";
import { HwKonfig } from "./hw-konfig";
import { Netzwerk } from "./netzwerk";

export interface Hardware {
  id: number;
  anschDat: Date;
  anschWert: number;
  invNr: string;
  smbiosgiud: string;
  wartungFa: string;
  bemerkung: string;
  sernr: string;
  pri: boolean;
  hwKonfigId: number;
  hwKonfig: HwKonfig;
  apId: number;
  ap: Arbeitsplatz;

  vlans: Netzwerk[];
  ipStr: string;
  macStr: string;
  vlanStr: string;
  apStr: string;
  macsearch: string;
}
