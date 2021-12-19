export interface Netzwerk {
  hwMacId: number;
  vlanId?: number;
  bezeichnung?: string;
  vlan?: number;
  netmask?: number;
  ip?: number;
  mac: string;

  ipStr: string;
  macStr: string;
}
