/// <reference lib="deno.unstable" />
const kv = await Deno.openKv();
export const handler: Handlers<User | null> = {
    async GET(_req, ctx) {
      const id = ctx.params.id;
      const key = ["user", id];
      const user = (await kv.get<User>(key)).value!;
      return new Response(JSON.stringify(user));
    },
    async PUT(req, ctx) {
        const id = ctx.params.id;
        const user = (await req.json()) as User;
        const userKey = ["user", id];
        const userRes = await kv.get(userKey);
        if (!userRes.value) return new Response(`no user with id ${id} found`);
        const ok = await kv.atomic().check(userRes).set(userKey, user).commit();
        if (!ok) throw new Error("Something went wrong.");
        return new Response(JSON.stringify(user));
      },
    
  };