// islands/FetchDataIsland.tsx
import "preact/debug";

import { h } from "preact";
import { signal } from "@preact/signals";
import { load } from "$std/dotenv/mod.ts";

interface DataItem {
  id: number;
  name: string;
  age: number;
}

export default function FetchDataIsland() {
  const id = signal<string | number>(0);
  const data = signal<DataItem | null>(null);
  const loading = signal(false);
  const error = signal<string | null>(null);

  const handleFetch = async () => {
    console.log("Island/FetchDataIsland()");
    if (!id.value) {
      error.value = "Please enter a valid ID.";
      return;
    }

    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`https://jsapi-mauve.vercel.app/db/${id.value}`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch data for ID ${id.value}: ${response.statusText}`);
      }
      const fetchedData = await response.json();
      data.value = fetchedData;
    } catch (err) {
      console.error(err);
      error.value = `Error: ${err.message}`;
    } finally {
      loading.value = false;
    }
  };
  console.log("Island/FetchDataIsland() 2", id.value, loading.value,data.value);

  return (
    <div>
      <h1>Fetch Data by ID</h1>
      <input
        name="id"
        id="id"
        type="number"
        placeholder="Enter ID"
        //value={Number(id.value)}
        onInput={(e) => id.value = Number((e.target as HTMLInputElement).value)}
      />
      <button type="submit" onClick={handleFetch} >Fetch Data</button>
      {loading.value && <p>Loading...</p>}
      {error.value && <p style={{ color: "red" }}>{error.value}</p>}
      {data.value && (
        <div>
          <h2>Data for ID: {id.value}</h2>
          <p><strong>Name:</strong> {data.value.name}</p>
          <p><strong>Age:</strong> {data.value.age}</p>
          {/* Adicione mais campos conforme necessário */}
        </div>
      )}
    </div>
  );
}
