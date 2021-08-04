export type GDriveItemKind = "drive#folder" | "drive#file"
export type GDriveItem<TKind extends GDriveItemKind> = {
  kind: TKind,
  id: string,
  name: string,
  mimeType: string
}

export type GDriveCreateFileOptions = {
  name: string,
  description?: string,
  mimeType?: string
}

export type GDriveCreateFolderOptions = {
  name: string,
  description?: string,
}

export type GDriveItemList = GDriveItem<any>[]

export default class GDriveClient {
  public async create_file(opts: GDriveCreateFileOptions): Promise<GDriveItem<"drive#file">> {
    const res = await gapi.client.request({
      path: "drive/v3/files",
      method: "POST",
      body: opts
    })

    return JSON.parse(res.body)
  }

  public async get_all_by_query(query: string): Promise<GDriveItemList> {
    const res = await gapi.client.request({
      path: "drive/v3/files",
      method: "GET",
      params: {
        q: query
      }
    })

    return JSON.parse(res.body).files
  }

  public async get_one_by_query(query: string): Promise<GDriveItem<any>> {
    const res = await gapi.client.request({
      path: "drive/v3/files",
      method: "GET",
      params: {
        q: query,
        pageSize: 1
      }
    })

    return JSON.parse(res.body).files[0]
  }

  public async get_all(): Promise<GDriveItemList> {
    const res = await gapi.client.request({
      path: "drive/v3/files",
      method: "GET"
    })

    return JSON.parse(res.body).files
  }

  public async create_folder(opts: GDriveCreateFolderOptions): Promise<GDriveItem<"drive#folder">> {
    return this.create_file({
      ...opts,
      mimeType: "application/vnd.google-apps.folder"
    }) as any
  }

  public async delete_item(id: string) {
    await gapi.client.request({
      path: "drive/v3/files/" + id,
      method: "DELETE"
    })
  }
}
