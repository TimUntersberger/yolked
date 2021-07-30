import GApi from "./"

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
  public async create_file(opts: GDriveCreateFileOptions): Promise<GDriveItem<"drive#file"> | null> {
    if (GApi.signed_in) {
      const res = await gapi.client.request({
        path: "drive/v3/files",
        method: "POST",
        body: opts
      })

      return JSON.parse(res.body)
    }

    return null
  }

  public async get_all(): Promise<GDriveItemList | null> {
    if (GApi.signed_in) {
      const res = await gapi.client.request({
        path: "drive/v3/files",
        method: "GET"
      })

      return JSON.parse(res.body).files
    }

    return null
  }

  public async create_folder(opts: GDriveCreateFolderOptions): Promise<GDriveItem<"drive#folder"> | null> {
    return this.create_file({
      ...opts,
      mimeType: "application/vnd.google-apps.folder"
    }) as any
  }

  public async delete_item(id: string) {
    if (GApi.signed_in) {
      const res = await gapi.client.request({
        path: "drive/v3/files",
        method: "DELETE",
        body: {
          id
        }
      })
    }
  }
}
