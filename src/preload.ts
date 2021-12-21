/** Preload (Isolated World)
 *  Create a safe, bi-directional, synchronous bridge across isolated contexts
 *  -> https://www.electronjs.org/docs/latest/api/context-bridge
 */
import { execFile } from "child_process";
import { contextBridge } from "electron";
import { Config } from "./config/config";

const APIKEY = "electron";
const config = new Config();

// class o.ae. funktioniert hier nicht, nur simples object
const api = {
  test: (msg: string) =>
    console.log("Message from renderer: " + msg + " / __dirname: " + __dirname),
  // __dirname win32: ...package\sbsdb-win32-x64\resources\app
  //           macOS: ...package/sbsdb-darwin-x64/sbsdb.app/Contents/Resources/app

  version: () => process.versions.electron,

  exec: (job: string, ap) => {
    console.debug("sbsdb-local exec: " + job);
    console.dir(ap);

    const json = JSON.stringify(ap, (key, value: unknown) => {
      // moegliche Rekursionen aus dem Objekt entfernen
      if (key === "ap" || key === "children") {
        return undefined;
      }
      return value;
    }).replace(/"/g, "'");

    const shell = config.shell;
    const parameters = [config.script, "-job", job, "-ap", '"' + json + '"'];

    execFile(shell, parameters, (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(data.toString());
    });
  },
};

contextBridge.exposeInMainWorld(APIKEY, api);
