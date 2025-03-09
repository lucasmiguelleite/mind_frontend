import Header from "@/components/Header";
import { Movimentacao } from "@/components/Movimentacao";

export default function Home() {
  return (
    <>
      <Header home={true} />
      <Movimentacao />
    </>
  );
}
