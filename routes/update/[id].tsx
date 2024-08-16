// routes/update/[id].tsx

import { h } from "preact";
import { signal } from "@preact/signals";
import { Handlers } from "$fresh/server.ts";

interface Employee {
  id: number;
  employee_name: string;
  employee_age: number;
  employee_salary: number;
}

export const handler: Handlers = {
  async GET(_, ctx) {
    const { id } = ctx.params;
    try {
      const response = await fetch(`https://dummy.restapiexample.com/api/v1/employee/${id}`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch employee: ${response.statusText}`);
      }
      const data = await response.json();
      return ctx.render(data.data);
    } catch (error) {
      console.error(error);
      return ctx.render(null);
    }
  },
};

export default function UpdateEmployee({ data }: { data: Employee }) {
  const name = signal(data?.employee_name || "");
  const age = signal<number | string>(data?.employee_age || 0);
  const salary = signal<number | string>(data?.employee_salary || 0);
  const loading = signal(false);
  const error = signal<string | null>(null);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    loading.value = true;
    try {
      const response = await fetch(`https://dummy.restapiexample.com/api/v1/update/${data.id}`, {
        method: "PUT",
        headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.value, age: age.value, salary: salary.value }),
      });
      if (!response.ok) {
        throw new Error(`Failed to update employee: ${response.statusText}`);
      }
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      error.value = error.message;
    } finally {
      loading.value = false;
    }
  };

  if (!data) {
    return <p>Failed to load employee details. Please try again later.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Update Employee</h2>
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
        Update
      </button>
    </form>
  );
}
