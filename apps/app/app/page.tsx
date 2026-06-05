import { redirect } from "next/navigation";

export default function Home() {
  // O funil começa na lista de partidas.
  redirect("/matches");
}
