/** Preload (Isolated World)
 *  Create a safe, bi-directional, synchronous bridge across isolated contexts
 *  -> https://www.electronjs.org/docs/latest/api/context-bridge
 */
// import { exec, execFile, spawn } from "child_process";
import { contextBridge, ipcRenderer } from "electron";
import { Arbeitsplatz } from "./model/arbeitsplatz";

const APIKEY = "electron";

// class o.ae. funktioniert hier nicht, nur simples object
const api = {
  doThing: () => ipcRenderer.send("do-a-thing"),

  test: (msg) => console.log("Message from renderer: " + msg + " / __dirname: " + __dirname),

  version: () => process.versions.electron,

  exec: (ap: Arbeitsplatz, job: string) => {
    console.debug("sbsdb-local exec: " + job);
    console.dir(ap);

    // var executablePath = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
    // var parameters = ["--incognito"];
    //
    // execFile(executablePath, parameters, (err, data) => {
    //   if(err){
    //     console.error(err);
    //     return;
    //   }
    //   console.log(data.toString());
    // });

    // exec("ls -la", (err, stdout, stderr) => {
    //   if (err) {
    //     console.error(err);
    //     return;
    //   }
    //   console.log(stdout);
    // });
  },
};

contextBridge.exposeInMainWorld(APIKEY, api);
