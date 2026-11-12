import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { getT, pageMetadata } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/terms", ["Terms & Conditions — Finloa", "Algemene voorwaarden — Finloa"], [
    "The terms that govern your use of the Finloa website and platform.",
    "De voorwaarden voor het gebruik van de website en het platform van Finloa.",
  ]);
}

/** The body is one HTML text per language, editable under Admin → Pages (Terms & Conditions). */
export default async function TermsPage() {
  const t = await getT();
  return (
    <LegalPage title={t("Terms & Conditions", "Algemene voorwaarden")} updated={t("2 November 2026", "2 november 2026")}>
      <div
        className="flex flex-col gap-4"
        dangerouslySetInnerHTML={{
          __html: t(
            `<p>These Terms and Conditions (“Terms”) are a legal agreement between you and Finloa (“Finloa”, “we”, “us” or “our”) and govern your use of our website and platform. By using our website, you agree to these Terms. If you do not agree, please do not use the website.</p>
<h2>Our services</h2>
<p>Finloa provides marketing, website, content, advertising and growth services for creators and businesses (“Services”). Specific Services are provided under a separate written agreement or proposal.</p>
<h2>Definitions</h2>
<p>“You” and “user” mean anyone who visits or uses our website, including people who sign up, contact us or use our platform. “Content” means all text, images, graphics, video and other material on the website.</p>
<h2>Acceptance of these Terms</h2>
<p>By accessing or using the website you confirm that you have read, understood and agree to these Terms and our <a href="/privacy">Privacy Policy</a>. We may update these Terms at any time. The latest version will always be on this page, and continued use of the website after changes means you accept them.</p>
<h2>Limited licence</h2>
<p>We grant you a limited, non-exclusive, non-transferable and revocable licence to use the website for your own lawful, non-commercial purposes, in line with these Terms.</p>
<h2>Legal compliance</h2>
<p>You agree to follow all applicable laws and regulations when using the website.</p>
<h2>Our relationship to you</h2>
<p>Using the website does not create any partnership, employment, agency or joint venture between you and Finloa.</p>
<h2>Intellectual property</h2>
<p>The website, its Content, our name, logo and trademarks belong to Finloa or our licensors and are protected by intellectual property laws. You may not copy, reproduce, distribute or create derivative works from them without our written permission.</p>
<h2>Copyright complaints</h2>
<p>We respect the intellectual property of others. If you believe Content on our website infringes your copyright, email <a href="mailto:info@finloa.com">info@finloa.com</a> with:</p>
<ul><li>A description of the copyrighted work</li><li>Where the infringing material appears on our website</li><li>Your name, address, phone number and email</li><li>A statement that you believe in good faith the use is not authorised</li><li>A statement that the information is accurate and that you own the copyright or are authorised to act for the owner</li><li>Your physical or electronic signature</li></ul>
<h2>Eligibility and accounts</h2>
<p>You must be at least 18 years old, or have permission from a parent or guardian, to use the website. If you create an account, you are responsible for keeping your login details secure and for all activity under your account. You agree to give accurate information and keep it up to date. We may suspend or close accounts that break these Terms.</p>
<h2>Content disclaimer</h2>
<p>Content on the website is for general information only. We try to keep it accurate and up to date, but we do not guarantee that it is complete, correct or current, and we may change it at any time without notice.</p>
<h2>Errors, corrections and changes</h2>
<p>We do not promise that the website will be free of errors or interruptions, or that defects will be corrected. We may change, suspend or discontinue any part of the website at any time.</p>
<h2>No professional advice</h2>
<p>Nothing on the website is financial, legal, tax or other professional advice. Examples of results are illustrative and are not a promise of future results. Talk to a qualified professional before making decisions based on information from our website.</p>
<h2>Third-party offers and advertising</h2>
<p>The website may mention or link to products, services or offers from third parties. Any dealings you have with them are solely between you and that third party, and we are not responsible for their products, services or terms.</p>
<h2>Warranty disclaimer</h2>
<p>The website and its Content are provided “as is” and “as available”, without warranties of any kind, express or implied, including warranties of merchantability, fitness for a particular purpose and non-infringement, to the extent permitted by law.</p>
<h2>Limitation of liability</h2>
<p>To the fullest extent permitted by law, Finloa is not liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits, revenue, data or goodwill, arising from your use of, or inability to use, the website. Our total liability for any claim related to the website is limited to €100.</p>
<h2>Privacy and personal data</h2>
<p>Our <a href="/privacy">Privacy Policy</a> explains how we collect and use personal information and forms part of these Terms. Where we process personal data on your behalf as part of our Services, we do so under a separate data processing agreement and only on your documented instructions.</p>
<h2>Unlawful activity</h2>
<p>We may investigate any suspected breach of these Terms or unlawful use of the website, and report it to the relevant authorities. You agree not to use the website to send spam, upload malicious code, attempt unauthorised access, or harm Finloa or other users.</p>
<h2>Linking to our website</h2>
<p>You may link to our homepage as long as you do so fairly and legally and do not suggest any association, approval or endorsement by Finloa that does not exist. We may withdraw this permission at any time.</p>
<h2>Links to other websites</h2>
<p>Our website may contain links to websites we do not control. We are not responsible for their content, policies or practices, and a link does not mean we endorse them.</p>
<h2>Indemnification</h2>
<p>You agree to defend, indemnify and hold harmless Finloa and its team from any claims, losses, liabilities and expenses, including reasonable legal fees, arising from your use of the website or your breach of these Terms.</p>
<h2>Governing law</h2>
<p>These Terms are governed by the laws of the country in which Finloa is registered, and any disputes will be handled by the courts there, unless local consumer law gives you other rights.</p>
<h2>Contact</h2>
<p>Questions about these Terms? Email <a href="mailto:info@finloa.com">info@finloa.com</a>.</p>`,
            `<p>Deze algemene voorwaarden (“Voorwaarden”) vormen een juridische overeenkomst tussen jou en Finloa (“Finloa”, “wij”, “we” of “ons”) en gelden voor het gebruik van onze website en ons platform. Door onze website te gebruiken, ga je akkoord met deze Voorwaarden. Ben je het er niet mee eens, gebruik de website dan niet.</p>
<h2>Onze diensten</h2>
<p>Finloa levert diensten op het gebied van marketing, websites, content, advertenties en groei voor creators en bedrijven (“Diensten”). Specifieke Diensten leveren we op basis van een aparte schriftelijke overeenkomst of offerte.</p>
<h2>Begrippen</h2>
<p>“Jij” en “gebruiker” betekenen iedereen die onze website bezoekt of gebruikt, ook mensen die zich aanmelden, contact met ons opnemen of ons platform gebruiken. “Content” betekent alle tekst, afbeeldingen, grafische elementen, video en ander materiaal op de website.</p>
<h2>Aanvaarding van deze Voorwaarden</h2>
<p>Door de website te bezoeken of te gebruiken, bevestig je dat je deze Voorwaarden en onze <a href="/privacy">privacyverklaring</a> hebt gelezen, begrepen en ermee akkoord gaat. We kunnen deze Voorwaarden op elk moment aanpassen. De meest recente versie staat altijd op deze pagina. Als je de website na een wijziging blijft gebruiken, ga je akkoord met de nieuwe versie.</p>
<h2>Beperkte licentie</h2>
<p>We geven je een beperkte, niet-exclusieve, niet-overdraagbare en herroepbare licentie om de website te gebruiken voor je eigen rechtmatige, niet-commerciële doeleinden, in overeenstemming met deze Voorwaarden.</p>
<h2>Naleving van de wet</h2>
<p>Je houdt je bij het gebruik van de website aan alle geldende wet- en regelgeving.</p>
<h2>Onze relatie met jou</h2>
<p>Het gebruik van de website leidt niet tot een samenwerkingsverband, dienstverband, agentschap of joint venture tussen jou en Finloa.</p>
<h2>Intellectueel eigendom</h2>
<p>De website, de Content, onze naam, ons logo en onze merken zijn eigendom van Finloa of onze licentiegevers en worden beschermd door intellectuele-eigendomsrechten. Je mag ze niet kopiëren, verveelvoudigen, verspreiden of er afgeleide werken van maken zonder onze schriftelijke toestemming.</p>
<h2>Klachten over auteursrecht</h2>
<p>We respecteren het intellectuele eigendom van anderen. Denk je dat Content op onze website inbreuk maakt op jouw auteursrecht? Mail dan naar <a href="mailto:info@finloa.com">info@finloa.com</a> met:</p>
<ul><li>Een omschrijving van het beschermde werk</li><li>Waar het inbreukmakende materiaal op onze website staat</li><li>Je naam, adres, telefoonnummer en e-mailadres</li><li>Een verklaring dat je te goeder trouw meent dat het gebruik niet is toegestaan</li><li>Een verklaring dat de informatie juist is en dat jij de rechthebbende bent of namens de rechthebbende mag optreden</li><li>Je handtekening, op papier of digitaal</li></ul>
<h2>Wie mag de website gebruiken en accounts</h2>
<p>Je moet minimaal 18 jaar oud zijn, of toestemming hebben van een ouder of voogd, om de website te gebruiken. Maak je een account aan, dan ben je zelf verantwoordelijk voor het veilig bewaren van je inloggegevens en voor alle activiteiten via je account. Je geeft juiste informatie op en houdt die actueel. We kunnen accounts die deze Voorwaarden schenden opschorten of sluiten.</p>
<h2>Disclaimer over de inhoud</h2>
<p>De Content op de website is alleen bedoeld als algemene informatie. We doen ons best om die juist en actueel te houden, maar garanderen niet dat ze volledig, correct of up-to-date is. We kunnen de Content op elk moment zonder aankondiging wijzigen.</p>
<h2>Fouten, correcties en wijzigingen</h2>
<p>We beloven niet dat de website vrij is van fouten of onderbrekingen, of dat gebreken worden hersteld. We kunnen elk onderdeel van de website op elk moment wijzigen, opschorten of stopzetten.</p>
<h2>Geen professioneel advies</h2>
<p>Niets op de website is financieel, juridisch, fiscaal of ander professioneel advies. Voorbeelden van resultaten zijn ter illustratie en geen belofte voor de toekomst. Overleg met een gekwalificeerde professional voordat je beslissingen neemt op basis van informatie van onze website.</p>
<h2>Aanbiedingen en advertenties van derden</h2>
<p>De website kan producten, diensten of aanbiedingen van derden noemen of ernaar linken. Afspraken die je met hen maakt, zijn uitsluitend een zaak tussen jou en die derde partij. Wij zijn niet verantwoordelijk voor hun producten, diensten of voorwaarden.</p>
<h2>Uitsluiting van garanties</h2>
<p>De website en de Content worden geleverd “zoals ze zijn” en “zoals beschikbaar”, zonder enige uitdrukkelijke of stilzwijgende garantie, waaronder garanties van verkoopbaarheid, geschiktheid voor een bepaald doel en het niet maken van inbreuk, voor zover de wet dat toestaat.</p>
<h2>Beperking van aansprakelijkheid</h2>
<p>Voor zover de wet dat maximaal toestaat, is Finloa niet aansprakelijk voor indirecte, incidentele, bijzondere of gevolgschade, of voor gederfde winst, omzet, gegevens of goodwill, die voortvloeit uit het gebruik van of het niet kunnen gebruiken van de website. Onze totale aansprakelijkheid voor een claim die verband houdt met de website is beperkt tot €100.</p>
<h2>Privacy en persoonsgegevens</h2>
<p>In onze <a href="/privacy">privacyverklaring</a> leggen we uit hoe we persoonsgegevens verzamelen en gebruiken. Die verklaring maakt deel uit van deze Voorwaarden. Als we als onderdeel van onze Diensten persoonsgegevens namens jou verwerken, doen we dat op basis van een aparte verwerkersovereenkomst en uitsluitend volgens je schriftelijke instructies.</p>
<h2>Onrechtmatig gebruik</h2>
<p>We kunnen elk vermoeden van schending van deze Voorwaarden of onrechtmatig gebruik van de website onderzoeken en melden bij de bevoegde instanties. Je gebruikt de website niet om spam te versturen, schadelijke code te uploaden, zonder toestemming toegang te proberen te krijgen of Finloa of andere gebruikers schade te berokkenen.</p>
<h2>Linken naar onze website</h2>
<p>Je mag naar onze homepage linken, zolang je dat op een eerlijke en rechtmatige manier doet en niet de indruk wekt dat er een band, goedkeuring of aanbeveling van Finloa is die niet bestaat. We kunnen deze toestemming op elk moment intrekken.</p>
<h2>Links naar andere websites</h2>
<p>Onze website kan links bevatten naar websites waar wij geen invloed op hebben. We zijn niet verantwoordelijk voor hun inhoud, beleid of werkwijze, en een link betekent niet dat we ze aanbevelen.</p>
<h2>Vrijwaring</h2>
<p>Je vrijwaart Finloa en haar team voor alle claims, verliezen, aansprakelijkheden en kosten, inclusief redelijke advocaatkosten, die voortvloeien uit jouw gebruik van de website of jouw schending van deze Voorwaarden.</p>
<h2>Toepasselijk recht</h2>
<p>Op deze Voorwaarden is het recht van toepassing van het land waar Finloa is ingeschreven, en geschillen worden voorgelegd aan de rechter in dat land, tenzij het consumentenrecht van jouw woonland je andere rechten geeft.</p>
<h2>Contact</h2>
<p>Vragen over deze Voorwaarden? Mail naar <a href="mailto:info@finloa.com">info@finloa.com</a>.</p>`,
          ),
        }}
      />
    </LegalPage>
  );
}
