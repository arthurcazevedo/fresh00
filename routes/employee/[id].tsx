// routes/employee/[id].tsx

import { h } from "preact";
import { useEffect } from "preact/hooks";
import { Handlers } from "$fresh/server.ts";
import { signal } from "@preact/signals";

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

  async POST(req, ctx) {
    const { id } = ctx.params;
    try {
      const response = await fetch(`https://dummy.restapiexample.com/api/v1/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to delete employee: ${response.statusText}`);
      }
      return new Response("", { status: 303, headers: { Location: "/" } });
    } catch (error) {
      console.error(error);
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  }
};

export default function EmployeeDetail({ data }: { data: Employee }) {
  const loading = signal(false);

  useEffect(() => {
    loading.value = true;
    fetch(`https://dummy.restapiexample.com/api/v1/employee/${data.id}`, {
      headers: {
        'Accept': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        loading.value = false;
        // handle data
      })
      .catch(error => {
        console.error(error);
        loading.value = false;
      });
  }, [data.id]);

  if (!data) {
    return <p>Failed to load employee details. Please try again later.</p>;
  }

  return (
    <div>
      {loading.value ? (
        <p>Loading...</p>
      ) : (
        <>
          <h2>{data.employee_name}</h2>
          <p>Age: {data.employee_age}</p>
          <p>Salary: {data.employee_salary}</p>
          <form method="POST">
            <button type="submit">Delete</button>
          </form>
          <a href={`/update/${data.id}`}>Update</a>
        </>
      )}
    </div>
  );
}
