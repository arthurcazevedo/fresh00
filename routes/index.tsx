
export default function Home() {
  return (
    <>
      <form hx-target="#perfil" hx-post="/form">
      <input 
        type="number"
        id="id"
        name="id"
        size="7"
        min="1"
        max="100000"
        label="id"
        placeholder="id do perfil"
        class="bg-blue-700"
      />
      <button type={"submit"} class="bg-blue-400">Procure!</button>
      </form>
      <div id="perfil"></div>
    </>
  );
}
 