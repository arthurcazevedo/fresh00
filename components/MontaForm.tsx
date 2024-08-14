
import { FreshContext, PageProps, Handlers } from "$fresh/server.ts";
import type { aCampo, aCampos, tCampo } from "../routes/api/db.ts"

interface Props {
  perfil: aCampos;
}

export const handler: Handlers<Props> = {
    async GET(_req:Request, _ctx:FreshContext) {
      const form = await _req.formData();
      const perfil = (await fetch("http://localhost:8000/api/db/" + form.get('id')?.toString())).body?.getReader().read() as unknown as aCampos;
      if (!perfil) {
        return _ctx.renderNotFound({
          message: "Perfil não encontrado",
        });
      }
      console.debug(`Perfil: ${perfil}`)

      return _ctx.render({perfil});
    },
  };
  
export default function MontaForm(props: PageProps<Props>) {
    const { data } = props;
    if (!data) {
        return "";
    }
    let form = '<form>';
    props.data.perfil.forEach((campos:aCampo) => {
      campos.forEach((campo:tCampo) => {
        form += `<label for="${campo.name}">${campo.name}: </label>\n`;
        form += `<input type="${campo.type}" id="${campo.name}" name="${campo.name}" size=${campo.size} value="${campo.value}"/>`;
      });
    });
    form += '<div hx-post="/updatePerson" >Atualizar</div></form>';
console.debug(`Form: ${form}`)
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
    )
}