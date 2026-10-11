import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-6 py-10 text-sm text-green-deep/70">
      <div className="flex flex-col gap-2 border-t border-green-deep/20 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p>Ikke tilknyttet Augusta National Golf Club eller The Masters.</p>
        <Link to="/personvern" className="underline underline-offset-2 hover:text-green-deep">
          Personvern
        </Link>
      </div>
    </footer>
  );
}
