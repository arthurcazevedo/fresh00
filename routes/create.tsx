// routes/create.tsx

import { h } from "preact";
import { signal } from "@preact/signals";

export default function CreateEmployee() {
  const name = signal("");
  const age = signal<number | string>("");
  const salary = signal<number | string>("");
  const loading = signal(false);
  const error = signal<string | null>(null);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    loading.value = true;
    try {
      const response = await fetch("https://dummy.restapiexample.com/api/v1/create", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.value, age: age.value, salary: salary.value }),
      });
      if (!response.ok) {
        throw new Error(`Failed to create employee: ${response.statusText}`);
      }
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      error.value = error.message;
    } finally {
      loading.value = false;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Employee</h2>
      {loading.value && <p>Loading...</p>}
      {error.value && <p style={{ color: "red" }}>{error.value}</p>}
      <input
        type="text"
        placeholder="Name"
        value={name.value}
        onInput={(e) => name.value = (e.target as HTMLInputElement).value}
        required
      />
      <input
        type="number"
        placeholder="Age"
        value={age.value}
        onInput={(e) => age.value = parseInt((e.target as HTMLInputElement).value)}
        required
      />
      <input
        type="number"
        placeholder="Salary"
        value={salary.value}
        onInput={(e) => salary.value = parseInt((e.target as HTMLInputElement).value)}
        required
      />
      <button type="submit" disabled={loading.value}>
        Create
      </button>
    </form>
  );
}
