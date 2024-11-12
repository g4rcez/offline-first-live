import Dexie, { type EntityTable } from "dexie";

export enum TodoStatus {
  Pending = "pending",
  Completed = "completed",
}

interface Todo {
  id: number;
  name: string;
  createdAt: Date;
  status: TodoStatus;
}

const db = new Dexie("todo-list") as Dexie & {
  todos: EntityTable<
    Todo,
    "id" // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
db.version(1).stores({
  todos: "++id, name, createdAt, status", // primary key "id" (for the runtime!)
});

export type { Todo };

export { db };
