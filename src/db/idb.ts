import Dexie from "dexie"

export default class IndexedDatabase extends Dexie {
  public exercises!: Dexie.Table<any, number>;
  public workouts!: Dexie.Table<any, number>;
  public programs!: Dexie.Table<any, number>;

  constructor() {
    super("IndexedDatabase")
    this.version(1).stores({
      exercises: "++id",
      workouts: "++id",
      programs: "++id"
    })
  }
}
