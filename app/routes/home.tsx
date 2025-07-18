import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Gestor de Tareas | Devoped by Tomas Riera" },
    { name: "description", content: "Bienvenido al Gestor de tareas" },
  ];
}

export default function Home() {
  return <Welcome />;
}
