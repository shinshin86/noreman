import { copy } from "https://deno.land/std@0.140.0/streams/conversion.ts";
const listener = Deno.listen({ port: 8080 });
console.log("listening on 0.0.0.0:8080");
for await (const conn of listener) {
  copy(conn, conn).finally(() => conn.close());
}
