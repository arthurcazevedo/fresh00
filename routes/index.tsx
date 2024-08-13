

export default function Home() {
  return (
    <>
      <form method="post" hx-get="/api/db" hx-target="#perfil" >
        <input 
          type="number"
          id="id"
          name="id"
          size="7"
          min="1"
          max="100000"
          label="id"
          placeholder="id do perfil"
        />
      </form>
      <div id="perfil"></div>
    </>
  );
}
 