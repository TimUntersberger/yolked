const CLIENT_ID = "783083744421-e7sv195ihcgmq1bvpqdpevneu7otam00.apps.googleusercontent.com"
const SCOPES = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/drive.appdata",
].join(" ")

import GDriveClient from "./gdrive"
import GSheetsClient from "./gsheets"

export type GApiEvent = "initialized" | "signIn" | "signOut"
export type GApiEventHandler = (event: GApiEvent) => void

class GApi {
  public initialized = false
  public signed_in = false
  public drive = new GDriveClient()
  public sheets = new GSheetsClient()
  private event_handler: GApiEventHandler = () => {}

  public load() {
    return new Promise<void>((resolve) => {
      gapi.load("client:auth2", () => {
        resolve()
      })
    })
  }

  public init() {
    return new Promise<void>((resolve) => {
      gapi.auth2.init({
        client_id: CLIENT_ID,
        scope: SCOPES,
        ux_mode: "popup",
      }).then(auth => {
        this.initialized = true
        this.signed_in = auth.isSignedIn.get()
        auth.isSignedIn.listen(value => {
          this.signed_in = value
          this.event_handler(value ? "signIn" : "signOut")
        })
        this.event_handler("initialized")
        resolve()
      })
    })
  }

  public get_user() {
    return gapi.auth2.getAuthInstance().currentUser.get()
  }

  public set_event_handler(f: GApiEventHandler) {
    this.event_handler = f
  }

  public sign_in() {
    if (!this.signed_in) {
      gapi.auth2.getAuthInstance().signIn()
    }
  }

  public sign_out() {
    if (this.signed_in) {
      gapi.auth2.getAuthInstance().signOut()
    }
  }
}

export default new GApi()
