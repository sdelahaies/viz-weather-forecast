import Image from "next/image";
import RotatingEarth from "./App";



export default function Home() {
  return (
      <div className="flex flex-col min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-center sm:items-start row-auto">
        <RotatingEarth />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/sdelahaies"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/github-mark-white.svg"
            alt="Globe icon"
            width={25}
            height={25}
          />
          {/* sdelahaies */}
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.linkedin.com/in/sylvaindelahaies/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/linkedin.svg"
            alt="Globe icon"
            width={25}
            height={25}
          />
          {/* sylvaindelahaies */}
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://sdelahaies.fr"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/logo_1_w.png"
            alt="File icon"
            width={25}
            height={25}
          />
          {/* sdelahaies.fr → */}
        </a>



      </footer>


    </div>
  );
}