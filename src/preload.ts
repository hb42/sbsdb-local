/** Preload (Isolated World)
 *  Create a safe, bi-directional, synchronous bridge across isolated contexts
 *  -> https://www.electronjs.org/docs/latest/api/context-bridge
 */
import { execFile } from "child_process";
import { promises } from "dns";
import { contextBridge } from "electron";
import { Config } from "./config/config";

const APIKEY = "electron";
const config = new Config();

const ipString =
  /^\s*(([1-9]|[1]?\d\d|2[0-4]\d|25[0-4])\.(\d|[1]?\d\d|2[0-4]\d|25[0-5])\.(\d|[1]?\d\d|2[0-4]\d|25[0-5])\.(2[0-4]\d|25[0-4]|[1]?\d\d|[1-9]))(\D|$)/;

// Standard-Paramter fuer Powershell
const psDefault = ["-NoProfile"];

interface LocalApi {
  test(msg: string): void;
  version(): string[]; // 0: electron runtime, 1: this app
  exec(job: string, ap): Promise<{ rc: number; info: string }>;
}

interface Arbeitsplatz {
  apname: string;
  ipStr: string;
}

/**
 * API fuer den Aufruf aus der Anwendung
 * class o.ae. funktioniert hier nicht, nur simples object
 */
const api = {
  test: (msg: string) =>
    console.log("Message from renderer: " + msg + " / __dirname: " + __dirname),
  // __dirname win32: ...package\sbsdb-win32-x64\resources\app
  //           macOS: ...package/sbsdb-darwin-x64/sbsdb.app/Contents/Resources/app

  version: () => [process.versions.electron, config.version],

  exec: async (
    job: string,
    param: string,
    ap: Arbeitsplatz
  ): Promise<{ rc: number; info: string }> => {
    console.debug("sbsdb-local exec: " + job + " for " + ap.apname);

    let hostname = "";
    // DNS-Lookup
    let ipAddr = (await promises
      .lookup(ap.apname, { family: 4 })
      .then((result) => result.address)
      .catch(() => null)) as string;

    if (ipAddr) {
      // hostname gefunden
      hostname = ap.apname;
    } else {
      // keine Namensaufloesung
      if (ipString.test(ap.ipStr)) {
        // erste gueltige IP aus dem String holen
        ipAddr = ipString.exec(ap.ipStr)[1];
      } else {
        // keine gueltige IP-Adresse -> Ende
        return {
          rc: 1,
          info:
            "Hostname " +
            ap.apname +
            " kann nicht aufgelöst werden und es ist keine " +
            "gültige IP-Adresse in der Datenbank vorhanden",
        };
      }
    }
    const json = JSON.stringify(ap, (key, value: unknown) => {
      // moegliche Rekursionen aus dem Objekt entfernen
      if (key === "ap" || key === "children") {
        return undefined;
      }
      return value;
    }).replace(/"/g, "'");

    const shell = config.shell;
    const parameters = [...psDefault];
    const scriptfile = __dirname + "/" + config.script;
    parameters.push("-file", scriptfile, "-job", job, "-ip", ipAddr, "-ap", '"' + json + '"');
    if (param) {
      // TODO: fuer komplexere Programm-Parameter muesste der param-String noch escaped werden.
      parameters.push("-param", '"' + param + '"');
    }
    if (hostname) {
      parameters.push("-hostname", hostname);
    }

    return new Promise<{ rc: number; info: string }>((resolve, reject) => {
      execFile(shell, parameters, (err, stdout, errout) => {
        console.debug("STDOUT: " + stdout);
        console.debug("ERROUT: " + errout);
        console.debug("RC: " + (err?.code.toString(10) ?? "0"));
        if (err) {
          console.dir(err);
          resolve({ rc: err.code, info: errout });
        } else {
          resolve({ rc: 0, info: "OK" });
        }
      });
    });
  },
} as LocalApi;

contextBridge.exposeInMainWorld(APIKEY, api);
