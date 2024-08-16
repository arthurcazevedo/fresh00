// routes/index.tsx

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
    try {
      const response = await fetch('https://dummy.restapiexample.com/api/v1/employees', {
        headers: {
          'Accept': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch employees: ${response.statusText}`);
      }
      const data = await response.json();
      return ctx.render(data.data);
    } catch (error) {
      console.error(error);
      return ctx.render([]);
    }
  }
};

export default function Home({ data }: { data: Employee[] }) {
  const loading = signal(false);

  useEffect(() => {
    loading.value = true;
    fetch('https://dummy.restapiexample.com/api/v1/employees', {
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
  }, []);

  return (
    <div>
      <h1>Employee Management</h1>
      {loading.value ? (
        <p>Loading...</p>
      ) : (
        <>
          {data.length > 0 ? (
            <ul>
              {data.map((employee) => (
                <li key={employee.id}>
                  <a href={`/employee/${employee.id}`}>{employee.employee_name}</a>
                </li>
              ))}
            </ul>
          ) : (
            <p>Failed to load employees. Please try again later.</p>
          )}
          <a href="/create">Create New Employee</a>
        </>
      )}
    </div>
  );
}
