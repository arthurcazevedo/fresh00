
import { FreshContext, PageProps, Handlers } from "$fresh/server.ts";
import type { aCampo, aCampos, tCampo } from "../api/db.ts"

interface Props {
  perfil: aCampos;
}

export const handler: Handlers<Props> = {
    async POST(_req:Request, _ctx:FreshContext) {
      //const url = new URL(_req.url);
      //const id = url.searchParams.get("id") || "";
      const form = await _req.formData();
      const id = form.get("id")?.toString();
      console.debug(`handler id: ${id}`)
      const perfil = (await fetch("https://jsapi-mauve.vercel.app/db/" + id)).;
      if (!perfil.json()) {
        return _ctx.renderNotFound({
          message: "Perfil não encontrado",
        });
      }
      console.debug(`handler perfil: ${perfil}`);
      //let value = (await perfil).value;
      //console.debug(`Value: ${value}`);
      return await _ctx.render({perfil});
    },
  };
  
export default function MontaForm(perfil: PageProps<Props>) {
    const { data } = perfil;
    console.debug(`MontaForm entrou`);
    if (!( data)) {
        return "";
    }

    let form = '<form>';
    const cPerfil = data.perfil;
    console.debug(`MontaForm data: ${cPerfil.keys}`);
    cPerfil.forEach((campos:aCampo) => {
      campos.map((campo:tCampo) => {
        form += `<label for="${campo.name}">${campo.name}: </label>\n`;
        form += `<input type="${campo.type}" id="${campo.name}" name="${campo.name}" size=${campo.size} value="${campo.value}"/>`;
      });
    });
    form += '<div hx-post="/updatePerson" >Atualizar</div></form>';
    return (
      form
    )
}