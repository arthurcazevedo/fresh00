// routes/index.tsx
import "preact/debug"; 

import { h } from "preact";
import FetchDataIsland from "../../islands/FetchdataIsland.tsx";

export default function Home() {
  return (
    <div>
      <FetchDataIsland />
    </div>
  );
}
