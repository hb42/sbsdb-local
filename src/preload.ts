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
  /^\s*(\d|[01]?\d\d|2[0-4]\d|25[0-5])\.(\d|[01]?\d\d|2[0-4]\d|25[0-5])\.(\d|[01]?\d\d|2[0-4]\d|25[0-5])\.(\d|[01]?\d\d|2[0-4]\d|25[0-5])\s*$/;

// API fuer den Aufruf aus der Anwendung
// class o.ae. funktioniert hier nicht, nur simples object
const api = {
  test: (msg: string) =>
    console.log("Message from renderer: " + msg + " / __dirname: " + __dirname),
  // __dirname win32: ...package\sbsdb-win32-x64\resources\app
  //           macOS: ...package/sbsdb-darwin-x64/sbsdb.app/Contents/Resources/app

  version: () => process.versions.electron,

  exec: async (job: string, ap): Promise<{ rc: number; info: string }> => {
    console.debug("sbsdb-local exec: " + job);
    console.dir(ap);

    let hostname = "";
    // DNS-Lookup
    let ipAddr = (await promises
      .lookup(ap.apname, { family: 4 })
      .then((result) => result.address)
      .catch(() => null)) as string;
    if (ipAddr) {
      // hostname gefunden
      hostname = ap.apname as string;
    } else {
      // keine Namensaufloesung
      if (ipString.test(ap.ipStr)) {
        ipAddr = ap.ipStr as string;
      } else {
        // und keine gueltige IP-Adresse
        return {
          rc: 1,
          info:
            "Hostname kann nicht aufgelöst werden und es ist keine " +
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
    const parameters = [
      config.script,
      "-job",
      job,
      "-hostname",
      hostname,
      "-ip",
      ipAddr,
      "-ap",
      '"' + json + '"',
    ];

    execFile(shell, parameters, (err, stdout, errout) => {
      if (err) {
        console.error(err);
      }
      console.debug(stdout);
      console.debug(errout);
    });
    return { rc: 0, info: "OK" };
  },
};

contextBridge.exposeInMainWorld(APIKEY, api);
