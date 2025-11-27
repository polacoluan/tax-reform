import TaxReform from "./tax-reform/page";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="bg-white dark:bg-black">
        <TaxReform />
      </main>
    </div>
  );
}
