import { GSheet } from "../gapi/gsheets"
import IndexedDatabase from "./idb"
import GApi from "../gapi"

const TABLE_PREFIX = "__yolked_"
const INDEX_TABLE_NAME = TABLE_PREFIX + "index"

export class Table {
  constructor(
    public name: string,
    public sheet: GSheet
  ) { }

  public async add(...data: any[]) {
    return this.sheet.append([data])
  }

  public async get_all(): Promise<string[][]> {
    return this.sheet.get_all()
  }
}

export default class GdriveDb {
  private table_names: string[]
  private prefixed_table_names: string[]

  constructor(table_names: string[]) {
    this.table_names = table_names
    this.prefixed_table_names = table_names.map(x => TABLE_PREFIX + x)
  }

  public async sync(idb: IndexedDatabase) {
    const lastSyncTime = localStorage.getItem("lastSyncTime")

    console.log(lastSyncTime)

    for (const tbl_name of this.table_names) {
      const sheet_name = TABLE_PREFIX + tbl_name;
      const sheet = await GApi.sheets.get_by_name(sheet_name);

      if (sheet) {
        //const data = (await sheet.get_all()) || []
        const idb_data = (await (idb as any)[tbl_name].toArray().map((x: any) => x.map((x: any) => JSON.stringify(x))))

        await sheet.clear()
        await sheet.update(idb_data)
      }
    }

    localStorage.setItem("lastSyncTime", Date.now().toString())
  }

  private async create_tables() {
    const table_names = [INDEX_TABLE_NAME].concat(this.prefixed_table_names)

    const [
      index_sheet,
      ...tables
    ] = await Promise.all(
      table_names.map(async name => new Table(name, await GApi.sheets.create(name)))
    )

    await index_sheet.sheet.append([tables.map(t => t.sheet.id)])
  }

  public async cleanup() {
    const sheets = await GApi.sheets.get_all_by_query([
      INDEX_TABLE_NAME,
      ...this.prefixed_table_names
    ].map(x => `name = '${x}'`).join(" or "))

    await Promise.all(sheets.map((s) => GApi.drive.delete_item(s.id)))
  }

  public async init() {
    const index_sheet = await GApi.sheets.get_by_name(INDEX_TABLE_NAME);

    if (!index_sheet) {
      console.log("Creating tables")
      await this.create_tables()
    }
  }
}
