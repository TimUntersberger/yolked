import GApi from "./"

export class GSheet {
  constructor(public id: string, public title: string) {}

  public static from_json(json: any): GSheet {
      return new GSheet(json.spreadsheetId, json.properties.title)
  }

  public async append(data: any[][]) {
    if (GApi.signed_in) {
      await gapi.client.request({
        path: "https://sheets.googleapis.com/v4/spreadsheets/" + this.id + "/values/A1:append?valueInputOption=RAW",
        method: "POST",
        body: {
          range: "A1",
          majorDimension: "ROWS",
          values: data
        }
      })
    }
  }
}

export default class GSheetsClient {
  public async create(): Promise<GSheet | null> {
    if (GApi.signed_in) {
      const res = await gapi.client.request({
        path: "https://sheets.googleapis.com/v4/spreadsheets",
        method: "POST",
        body: {
          properties: {
            title: "YolkedDatabase"
          }
        }
      })

      return GSheet.from_json(JSON.parse(res.body))
    }

    return null
  }

  public async get_by_id(id: string): Promise<GSheet | null> {
    if (GApi.signed_in) {
      const res = await gapi.client.request({
        path: "https://sheets.googleapis.com/v4/spreadsheets/" + id,
        method: "GET"
      })

      return GSheet.from_json(JSON.parse(res.body))
    }

    return null
  }
}
