/** Preload (Isolated World)
 *  Create a safe, bi-directional, synchronous bridge across isolated contexts
 *  -> https://www.electronjs.org/docs/latest/api/context-bridge
 */
import { contextBridge, ipcRenderer } from "electron";

const APIKEY = "electron";

// class o.ae. funktioniert hier nicht, nur simples object
const api = {
  doThing: () => ipcRenderer.send( "do-a-thing"),

  test: (msg) => console.log("Message from renderer: " + msg),

  version: () => process.versions.electron,
}

contextBridge.exposeInMainWorld(APIKEY, api);
