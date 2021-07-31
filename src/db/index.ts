import GApi from "../gapi"
import { GSheet } from "../gapi/gsheets"
import IndexedDatabase from "./idb"

export class Table {
  constructor(
    public name: string,
    public sheet: GSheet
  ) {}

  public async add(...data: any[]) {
    return this.sheet.append([data])
  }

  public async get_all(): Promise<string[][]> {
    return this.sheet.get_all()
  }
}

const TABLE_PREFIX = "__yolked_"
const INDEX_TABLE_NAME = TABLE_PREFIX + "index"

export class Db {
  public idb: IndexedDatabase
  private table_names: string[]
  private prefixed_table_names: string[]
  
  constructor(table_names: string[]){
    this.table_names = table_names
    this.idb = new IndexedDatabase({
      name: "YolkedDb",
      version: 8,
      tables: [
        {
          name: "exercises",
          autoIncrement: true
        },
        {
          name: "workouts",
          autoIncrement: true
        },
        {
          name: "programs",
          autoIncrement: true
        },
      ]
    })
    this.prefixed_table_names = table_names.map(x => TABLE_PREFIX + x)
  }

  private async create_tables() {
    const table_names = [INDEX_TABLE_NAME].concat(this.prefixed_table_names)

    const [
      index_sheet,
      ...tables
    ] = await Promise.all(
      table_names.map(async name => new Table(name,await GApi.sheets.create(name)))
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
    await this.idb.open()
  }
}

export default new Db(["exercises", "workouts", "programs"])
