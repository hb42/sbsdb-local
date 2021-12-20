import * as fs from "fs";
import * as path from "path";

export class Config {
  private readonly CONFIGFILE = "config_internal.json";
  private config: Conf;

  public get domain(): string {
    return this.config.domain;
  }
  public get url(): string {
    return this.config.url;
  }
  public get path(): string {
    return this.config.path;
  }
  public get shell(): string {
    return this.config.shell;
  }
  public get script(): string {
    return this.config.script;
  }

  constructor() {
    const configFile = path.join(__dirname, this.CONFIGFILE);
    const conf = JSON.parse(fs.readFileSync(configFile, "utf8")) as ConfFile;
    this.config = process.platform !== "darwin" ? conf.win : conf.osx;
  }
}
