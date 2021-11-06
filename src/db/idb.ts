export type SchemaTable = {
  name: string
} & Partial<IDBObjectStoreParameters>

export type Schema = {
  name: string,
  version: number,
  tables: SchemaTable[]
}

export default class IndexedDatabase {
  private idb!: IDBDatabase

  constructor(public schema: Schema) {}

  public open() {
    return new Promise<void>((resolve, reject) => {
      const req = indexedDB.open(this.schema.name, this.schema.version)

      req.onerror = (ev: any) => {
        reject(ev)
      }

      req.onsuccess = (ev: any) => {
        this.idb = ev.target.result
        resolve()
      }

      req.onupgradeneeded = (ev: any) => {
        this.idb = ev.target.result
        this.create_schema()
      }
    })
  }

  public transaction(storeName: string, f: (s: IDBObjectStore) => void) {
    return new Promise((resolve, reject) => {
      const t = this.idb.transaction(storeName, "readwrite")
      t.onerror = reject
      t.oncomplete = resolve

      const os = t.objectStore(storeName)
      
      f(os)
    })
  }

  public to_array(storeName: string): Promise<[any, any][]> {
    return new Promise((resolve, reject) => {
      const res: [any, any][] = []
      this.transaction(storeName, s => {
        const req = s.openCursor()

        req.onerror = reject
        req.onsuccess = (ev: any) => {
          const curr = ev.target.result
          if (curr) {
            res.push([curr.key, curr.value])
            curr.continue()
          } else {
            resolve(res)
          }
        }
      })
    })
  }

  public for_each(storeName: string, f: (key: any, value: any) => void) {
    this.transaction(storeName, s => {
      const req = s.openCursor()

      req.onsuccess = (ev: any) => {
        const curr = ev.target.result
        if (curr) {
          f(curr.key, curr.value)
          curr.continue()
        }
      }
    })
  }

  public insert(storeName: string, key: any, value: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      await this.transaction(storeName, s => {
        const req = s.add(value, key)
        req.onerror = reject
        req.onsuccess = (ev: any) => resolve(ev.target.result)
      })
    })
  }

  public delete(storeName: string, id: any) {
    return new Promise(async (resolve, reject) => {
      await this.transaction(storeName, s => {
        const req = s.delete(id)
        req.onerror = reject
        req.onsuccess = (ev: any) => resolve(ev.target.result)
      })
    })
  }

  public select(storeName: string, key: any, value: any) {
    return new Promise(async (resolve, reject) => {
      await this.transaction(storeName, s => {
        const req = s.add(value, key)
        req.onerror = reject
        req.onsuccess = resolve
      })
    })
  }

  private create_schema() {
    for (const table of this.schema.tables) {
      try {
        if (this.idb.objectStoreNames.contains(table.name)) {
          console.info("Deleting " + table.name)
          this.idb.deleteObjectStore(table.name)
        }
        console.info("Creating " + table.name)
        this.idb.createObjectStore(table.name, table)
      } catch (err) {
        console.error(err)
      }
    }
  }
}
