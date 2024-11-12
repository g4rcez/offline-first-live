import { useLiveQuery } from "dexie-react-hooks";
import { ConnectionType, useNetwork } from "./hooks/use-network";
import { db, TodoStatus } from "./config/db";

const updateTodo = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const id = e.currentTarget.dataset.id ?? "";
  const status = e.target.checked ? TodoStatus.Completed : TodoStatus.Pending;
  await db.todos.update(Number(id), { status: status as TodoStatus });
};

const NetworkConnectionBanner = () => {
  const status = useNetwork();
  if (status === ConnectionType.Online) return null;
  return (
    <div className="sticky top-0 text-center w-screen h-8 text-amber-500 bg-black">
      Você está offline.
    </div>
  );
};

const AddTodo = () => {
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("name") as HTMLInputElement;
    const body = {
      status: TodoStatus.Pending,
      createdAt: new Date(),
      name: input.value.trim(),
    };
    const save = async () => await db.todos.add(body);
    try {
      const saved = await fetch("/api/todos", {
        method: "POST",
        body: JSON.stringify(body),
      });
      if (saved.ok) return;
      await save();
    } catch (e) {
      if (e instanceof TypeError) {
        // NUNCA FAÇA ESSE TIPO DE VALIDAÇÃO
        // usado apenas para fins educativos da live
        if (e.message === "Failed to fetch") {
          await save();
        }
      }
    } finally {
      input.value = "";
      input.focus();
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-row gap-4">
      <input
        autoFocus
        name="name"
        className="p-2 border text-lg rounded"
        placeholder="Novo todo..."
      />
      <button
        type="submit"
        className="px-4 py-1 rounded-lg bg-indigo-600 text-white"
      >
        Adicionar
      </button>
    </form>
  );
};

function App() {
  const todos = useLiveQuery(() => db.todos.toArray()) ?? [];
  useNetwork({
    online: async () => {
      const allTodos = await db.todos.toArray();
      if (allTodos.length === 0) return;
      await fetch("/api/todos/offline", {
        method: "POST",
        body: JSON.stringify({ items: allTodos }),
      });
      await db.todos.clear();
      alert("Sincronizado com a API. Recursos locais foram deletados");
    },
  });

  return (
    <>
      <NetworkConnectionBanner />
      <div className="w-full h-screen p-8 flex items-center justify-center">
        <ul className="space-y-4">
          {todos.map((todo) => {
            return (
              <li key={todo.id} className="flex flex-row gap-2">
                <input
                  type="checkbox"
                  onChange={updateTodo}
                  data-id={todo.id}
                  checked={todo.status === TodoStatus.Completed}
                />
                {todo.name}
              </li>
            );
          })}
          <li>
            <AddTodo />
          </li>
        </ul>
      </div>
    </>
  );
}

export default App;
