import { Logout } from "./LogOut";

export default function Header() {
  return (
    <header>
      <nav className="my-4 mx-4 flex justify-between">
        <h1>Estoque</h1>
        <Logout />
      </nav>
    </header>
  );
}