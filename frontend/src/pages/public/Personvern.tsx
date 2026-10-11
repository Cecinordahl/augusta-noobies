import { PillNav } from "../../components/public/PillNav";
import { Footer } from "../../components/public/Footer";

export function Personvern() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-3xl px-6">
        <PillNav items={[{ label: "Forside", to: "/" }]} />

        <h1 className="py-6 font-serif text-5xl italic text-green-deep">Personvern</h1>

        <div className="space-y-6 pb-16 text-green-deep/90">
          <section>
            <h2 className="font-serif text-2xl italic text-green-deep">Hva lagrer vi?</h2>
            <p className="mt-2 text-sm">
              Denne siden lagrer navn, bilder og golfresultater/handicap for deltakerne i Augusta
              Noobies — en lukket vennegjeng på rundt ni til tolv personer. Ingen andre
              personopplysninger samles inn, og siden krever ikke innlogging for besøkende.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl italic text-green-deep">Hvorfor lagrer vi det?</h2>
            <p className="mt-2 text-sm">
              Navn, resultater og handicap lagres på grunnlag av berettiget interesse — dette er en
              lukket, ikke-kommersiell vennegjengs egen historikk, og formålet er å bygge stemning
              og minner rundt en årlig turnering. Bilder av deltakere publiseres kun etter samtykke
              fra den enkelte før de legges ut.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl italic text-green-deep">Hvem kan se siden?</h2>
            <p className="mt-2 text-sm">
              Siden er ikke indeksert av søkemotorer (robots.txt/noindex) og deles kun som en
              upublisert lenke innad i vennegjengen. Den er likevel teknisk tilgjengelig for alle
              med lenken, siden det ikke kreves innlogging for å bla i innholdet.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl italic text-green-deep">Hvor lenge lagres det?</h2>
            <p className="mt-2 text-sm">
              Informasjonen beholdes som en historisk oversikt over turneringen, år for år, så
              lenge Augusta Noobies eksisterer som arrangement.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl italic text-green-deep">Dine rettigheter</h2>
            <p className="mt-2 text-sm">
              Ønsker du at navnet ditt, bilder av deg, eller resultater skal fjernes eller
              rettes, ta kontakt med turneringsarrangøren direkte.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
