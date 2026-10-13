import { EkloMark } from "@/components/EkloMark";
import { Countdown } from "@/components/Countdown";
import { InterestForm } from "@/components/InterestForm";

/**
 * eklo-launch: a single, minimal pre-launch landing page -- deliberately
 * its own separate project/deployment (not a page inside eklo-se or
 * eklo-application), meant to sit behind the real ekloapp.se domain while
 * the full app isn't ready for that traffic yet, so early interest has
 * somewhere real to land. Logo, statement, and the launch countdown,
 * same order top to bottom; reuses eklo-se's own Countdown and
 * InterestForm (same registerInterestAction, same LaunchInterest table in
 * eklo-production) byte-for-byte, so a signup here lands in the exact same
 * place one from eklo.se would.
 */
export default function LaunchPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <EkloMark size={56} />

      <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
        Mat ska smaka var den kommer ifrån.
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-lg text-gray-600">
        eklo kopplar ihop dig med gårdar, bagerier och odlare nära dig —
        utan mellanhänder, utan lager, utan dold påläggsavgift. Du
        beställer, väljer en tid, och hämtar upp direkt från den som
        faktiskt gjorde varan.
      </p>
      <p className="mt-6 text-sm font-medium text-gray-500">
        eklo öppnar snart — anmäl ditt intresse nedan så hör vi av oss.
      </p>

      <Countdown />

      <InterestForm />
    </main>
  );
}
