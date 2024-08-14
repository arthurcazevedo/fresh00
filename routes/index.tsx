import MontaForm from "../components/MontaForm.tsx";


export default function Home() {
  return (
    <>
      <form  hx-target="#perfil" >
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
    </>
  );
}
 