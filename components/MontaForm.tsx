
import { PageProps } from "$fresh/server.ts";
import type { aCampos, tCampo } from "../routes/api/db.ts"


export const handler: Handlers<Project> = {
    async GET(_req, ctx) {
      const perfil = await fetch("http://localhost:8000/api/db/12");
      if (!perfil) {
        return ctx.renderNotFound({
          message: "Perfil não encontrado",
        });
      }
      return ctx.render(perfil);
    },
  };
  
export default function MontaForm(props: PageProps<aCampos>) {
    //if (props.data.length === 0) {
    //    return "";
    //}
    let form = '<form>';
    props.data.forEach((campo:tCampo) => {
        form += `<label for="${campo.name}">${campo.name}: </label>\n`;
        form += `<input type="${campo.type}" id="${campo.name}" name="${campo.name}" size=${campo.size} value="${campo.value}"/>`;
    });
    form += '<div hx-post="/updatePerson" >Atualizar</div></form>';
    //return form;

    return (
        <>
        <form>
          {props.data[0].map(campo => {
                <>
                  <label for="${campo.name}">${campo.name}: </label>
                  <input type="${campo.type}" id="${campo.name}" name="${campo.name}" size="${campo.size}" value="${campo.value}"/>
                </>
              }
            )
          }
        </form>
        <div hx-post="/updatePerson" >Atualizar</div>
        </>
    )
}