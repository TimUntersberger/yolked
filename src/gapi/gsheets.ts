import GApi from "../gapi"

const SHEETS_URL = "https://sheets.googleapis.com/v4/spreadsheets/"

export class GSheet {
  constructor(public id: string, public title: string) {}

  public static from_json(json: any): GSheet {
    return new GSheet(json.spreadsheetId, json.properties.title)
  }

  public async append(data: any[][]) {
    await gapi.client.request({
      path: SHEETS_URL + this.id + "/values/A1:append",
      method: "POST",
      body: {
        range: "A1",
        majorDimension: "ROWS",
        values: data
      },
      params: {
        valueInputOption: "RAW"
      }
    })
  }

  public async get_all(): Promise<any[][]> {
    return this.get_range("Sheet1")
  }

  public async get_range(range: string): Promise<any[][]> {
    const res = await gapi.client.request({
      path: SHEETS_URL + this.id + "/values/" + range,
      method: "GET",
    })

    return JSON.parse(res.body).values
  }
}

export default class GSheetsClient {
  public async create(name: string): Promise<GSheet> {
    const res = await gapi.client.request({
      path: SHEETS_URL,
      method: "POST",
      body: {
        properties: {
          title: name
        }
      }
    })

    return GSheet.from_json(JSON.parse(res.body))
  }

  public async get_by_id(id: string): Promise<GSheet | null> {
    try {
      const res = await gapi.client.request({
        path: SHEETS_URL + id,
        method: "GET"
      })

      return GSheet.from_json(JSON.parse(res.body))
    } catch {
      return null
    }
  }

  public async get_all(): Promise<GSheet[] | null> {
    return await GApi.drive
      .get_all_by_query(`mimeType = 'application/vnd.google-apps.spreadsheet'`)
      .then(items => items.map(item => new GSheet(item.id, item.name)))
  }

  public async get_all_by_query(query: string): Promise<GSheet[]> {
    return await GApi.drive
      .get_all_by_query(`mimeType = 'application/vnd.google-apps.spreadsheet' and ${query}`)
      .then(items => items.map(item => new GSheet(item.id, item.name)))
  }

  public async get_one_by_query(query: string): Promise<GSheet | null> {
    return await GApi.drive
      .get_one_by_query(`mimeType = 'application/vnd.google-apps.spreadsheet' and ${query}`)
      .then(item => item && new GSheet(item.id, item.name))
  }

  public async get_by_name(name: string): Promise<GSheet | null> {
    return await this.get_one_by_query(`name = '${name}'`)
  }
}
