export interface Betrst {
  bstId: number;
  betriebsstelle: string;
  bstNr: number;
  fax: string;
  tel: string;
  oeff: string;
  ap: boolean;
  parentId?: number;
  plz: string;
  ort: string;
  strasse: string;
  hausnr: string;

  fullname: string; // incl. BST-Nr.
  hierarchy: string; // Pfad der Ueberstellung (parent1/parent2/this), jew. fullname
  parent?: Betrst;
  children: Betrst[];
}
