import { FreshContext, RouteConfig } from "$fresh/server.ts";
import { ResultSet, createClient } from "@libsql/client";
import "jsr:@std/dotenv/load";

export const handler: Handlers<User | null> = {
    async GET(req:Request, _ctx:FreshContext) {
        try {
            const params = _ctx.url.searchParams;
            const perfis = await client.execute({sql: "SELECT * FROM person where id in (?)",
                                             args: [params.get('id')]
                                            });
            const chaves = await client.execute({sql: "SELECT name FROM pragma_table_info(?) where pk=1",
              args: ["person"]
            });
            let perfil = (getJSON(perfis,chaves) as aCampos);
            //console.debug(`Campos: `,...x)
            //res.send(montaForm(perfil));
            return new Response(JSON.stringify(getJSON(perfis,chaves)),{headers: [["Content-type","Application/json"]]});
          
        } catch (error) {
          //console.error(error);
          throw error;
        }
    },
};


export const config: RouteConfig = {
    routeOverride: "/api/db/:id(\\d+)?",
};


const client = createClient({
    url: Deno.env.get("TURSO_DATABASE_URL") || "",
    authToken: Deno.env.get("TURSO_AUTH_TOKEN"),
  });
  
export type tCampo = {name:string,type:string,size:number,value:string};
export type aCampo = Array<tCampo>;
export type aCampos = Array<aCampo>;

export const getJSON = (data:ResultSet,colunas:ResultSet):aCampos => {
    let result:aCampos = [];

    if (data.rows.length === 0 || colunas.rows.length === 0) {
        return [];
    }
    const regex = /.*\((\d+)\).*/;

    let cCampos:aCampo = [];
    for (let i = 0; i < data.rows.length; i++) {
        for (let j = 0; j < data.columns.length; j++) {
            let tipo:string = data.columnTypes[j].split('(')[0];
            switch (tipo) {
                case "VARCHAR2":
                    tipo = "text"
                    break;
            
                    case "NUMBER":
                    case "INTEGER":
                        tipo = "number"
                    break;
                
                    case "DATE":
                        tipo = "date"
                        break;
                
                    default:
                        break;
            }
            cCampos.push({name: data.columns[j]
                         ,type: tipo
                         ,size: Number((regex.exec(data.columnTypes[j]) ?? "0")[1] ?? "0")
                         ,value: String(data.rows[i][j])
                    });
        }
        result.push(cCampos);
    }

    cCampos = [];
    for (let i2 = 0; i2 < colunas.rows.length; i2++) {
        for (let j2 = 0; j2 < colunas.columns.length; j2++) {
            cCampos.push({name: data.columns[j2]
                        ,size: Number((regex.exec(data.columnTypes[i2]) ?? "0")[1] ?? "0")
                        ,type: data.columnTypes[i2].split('(')[0]
                        ,value: String(data.rows[i2][j2])
                    });
        }
        //Cresult.push(cCampos);
    }

    result.push(cCampos);

    if (result.length === 0) {
        return [];
    }

    return result;
};
