import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { getLocale, pageMetadata } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/privacy", ["Privacy Policy — Finloa", "Privacyverklaring — Finloa"], [
    "How Finloa collects, uses and protects personal information.",
    "Hoe Finloa persoonsgegevens verzamelt, gebruikt en beschermt.",
  ]);
}

export default async function PrivacyPage() {
  const nl = (await getLocale()) === "nl";
  return nl ? (
    <LegalPage title="Privacyverklaring" updated="2 november 2026">
      <NlBody />
    </LegalPage>
  ) : (
    <LegalPage title="Privacy Policy" updated="2 November 2026">
      <EnBody />
    </LegalPage>
  );
}

function EnBody() {
  return (
    <>

      <h2>Introduction</h2>
      <p>This Website Privacy Policy explains how Finloa (“Finloa”, “we”, “us” or “our”) collects, uses and protects personal information when you visit our website, use our platform or contact us. By using our website you agree to the practices described in this policy. If you do not agree, please do not use our website.</p>
      <h2>Definitions</h2>
      <p><strong>Personal information</strong> means any information that identifies you or could reasonably be used to identify you, such as your name, email address, phone number, company, channel or website, and online identifiers like your IP address.</p>
      <p><strong>Non-personal information</strong> means information that cannot identify you on its own, such as browser type, device type, pages visited and general usage statistics.</p>
      <h2>Our commitment to your privacy</h2>
      <p>We collect only the information we need to provide our services, and we never sell your personal information. We are committed to keeping your information secure and to being clear about how we use it.</p>
      <h2>Information we collect</h2>
      <h3>Information you provide to us</h3>
      <p>We collect information you give us directly, for example when you sign up, complete onboarding, fill in a contact form, apply for a job or email us. This may include:</p>
      <ul><li>Your name, email address and phone number</li><li>Your company, channel or website, and your niche</li><li>Messages, files and other content you share with us</li><li>Billing details if you buy a service from us</li></ul>
      <h3>Information collected automatically</h3>
      <p>When you visit our website we automatically collect certain information, such as your IP address, browser and device type, referring website, pages viewed and the time and date of your visit.</p>
      <h3>Cookies</h3>
      <p>We use cookies and similar technologies to keep the website working, remember your preferences and understand how visitors use our site. You can control or delete cookies in your browser settings. Some parts of the website may not work properly without them.</p>
      <h3>Analytics</h3>
      <p>We use analytics services such as Google Analytics to understand how visitors use our website. These services may collect information about your visits using cookies. You can opt out of Google Analytics by installing the Google Analytics opt-out browser add-on.</p>
      <h3>Do Not Track signals</h3>
      <p>Some browsers send “Do Not Track” signals. Because there is no common standard for these signals, our website does not currently respond to them.</p>
      <h2>How we use your information</h2>
      <p>We use personal information only when we have a valid reason to do so, including to:</p>
      <ul><li>Provide, run and improve our services and platform</li><li>Respond to your questions and requests</li><li>Prepare proposals and manage our work with you</li><li>Send updates and marketing you have agreed to receive</li><li>Review job applications</li><li>Protect our website, prevent fraud and meet legal obligations</li></ul>
      <h3>Legal bases</h3>
      <p>Depending on where you live, we process personal information because it is needed to perform a contract with you, because you have given consent, because we have a legitimate business interest that does not override your rights, or because we are legally required to.</p>
      <h3>Marketing</h3>
      <p>If you agree to receive marketing emails, we may send you news, guides and offers. You can unsubscribe at any time using the link in any email or by contacting us.</p>
      <h2>Sharing your information</h2>
      <p>We do not sell or rent your personal information. We may share it with trusted service providers who help us run our business, such as hosting, email, analytics and payment providers, only as needed to provide their services and under appropriate confidentiality terms. We may also share information if required by law, or as part of a merger, acquisition or sale of assets, in which case we will tell you if your information becomes subject to a different privacy policy.</p>
      <h2>Accessing, changing or deleting your information</h2>
      <p>You can ask us to access, correct, update or delete the personal information we hold about you, or to stop using it for marketing. To make a request, email <a href="mailto:info@finloa.com">info@finloa.com</a>. We may need to verify your identity before we can act on your request.</p>
      <h2>How long we keep your information</h2>
      <p>We keep personal information only as long as we need it for the purposes described in this policy, including to meet legal, accounting and reporting requirements. When we no longer need it, we delete or anonymise it.</p>
      <h2>Security</h2>
      <p>We use reasonable technical and organisational measures to protect your personal information, including encrypted connections and access controls. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.</p>
      <h2>Limitation of liability</h2>
      <p>You share information through our website at your own risk. To the extent permitted by law, Finloa is not responsible for unauthorised access to information caused by events outside our reasonable control.</p>
      <h2>Children’s privacy</h2>
      <p>Our website and services are not intended for children under 16. We do not knowingly collect personal information from children. If you believe a child has given us personal information, please contact us and we will delete it.</p>
      <h2>Other websites</h2>
      <p>Our website may link to other websites that we do not control. We are not responsible for their content or privacy practices, and we encourage you to read their privacy policies.</p>
      <h2>Changes to this policy</h2>
      <p>We may update this policy from time to time. When we do, we will change the “Last updated” date at the top of this page. Significant changes will be highlighted on our website.</p>
      <h2>Questions about this policy</h2>
      <p>If you have questions about this Privacy Policy or how we handle your information, contact us at <a href="mailto:info@finloa.com">info@finloa.com</a>.</p>
    </>
  );
}

function NlBody() {
  return (
    <>
      <h2>Inleiding</h2>
      <p>In deze privacyverklaring leggen we uit hoe Finloa (“Finloa”, “wij”, “we” of “ons”) persoonsgegevens verzamelt, gebruikt en beschermt wanneer je onze website bezoekt, ons platform gebruikt of contact met ons opneemt. Door onze website te gebruiken, ga je akkoord met wat in deze verklaring staat. Ben je het daar niet mee eens, gebruik onze website dan niet.</p>
      <h2>Begrippen</h2>
      <p><strong>Persoonsgegevens</strong> zijn alle gegevens waarmee je direct of indirect te identificeren bent, zoals je naam, e-mailadres, telefoonnummer, bedrijf, kanaal of website, en online kenmerken zoals je IP-adres.</p>
      <p><strong>Niet-persoonlijke gegevens</strong> zijn gegevens waarmee je op zichzelf niet te identificeren bent, zoals het type browser of apparaat, bezochte pagina’s en algemene gebruiksstatistieken.</p>
      <h2>Onze belofte over je privacy</h2>
      <p>We verzamelen alleen de gegevens die we nodig hebben om onze diensten te leveren, en we verkopen je persoonsgegevens nooit. We doen ons best om je gegevens veilig te bewaren en helder te zijn over hoe we ze gebruiken.</p>
      <h2>Welke gegevens we verzamelen</h2>
      <h3>Gegevens die je zelf aan ons geeft</h3>
      <p>We verzamelen gegevens die je rechtstreeks aan ons doorgeeft, bijvoorbeeld wanneer je je aanmeldt, de onboarding doorloopt, een contactformulier invult, solliciteert of ons mailt. Dit kan gaan om:</p>
      <ul><li>Je naam, e-mailadres en telefoonnummer</li><li>Je bedrijf, kanaal of website, en je niche</li><li>Berichten, bestanden en andere inhoud die je met ons deelt</li><li>Factuurgegevens als je een dienst bij ons afneemt</li></ul>
      <h3>Gegevens die automatisch worden verzameld</h3>
      <p>Wanneer je onze website bezoekt, verzamelen we automatisch bepaalde gegevens, zoals je IP-adres, het type browser en apparaat, de website waar je vandaan kwam, de pagina’s die je bekijkt en de datum en tijd van je bezoek.</p>
      <h3>Cookies</h3>
      <p>We gebruiken cookies en vergelijkbare technieken om de website goed te laten werken, je voorkeuren te onthouden en te begrijpen hoe bezoekers onze site gebruiken. Je kunt cookies beheren of verwijderen via de instellingen van je browser. Sommige onderdelen van de website werken dan mogelijk niet goed.</p>
      <h3>Analytics</h3>
      <p>We gebruiken analysediensten zoals Google Analytics om te begrijpen hoe bezoekers onze website gebruiken. Deze diensten kunnen met cookies gegevens over je bezoeken verzamelen. Je kunt je afmelden voor Google Analytics door de browser-add-on voor afmelding van Google Analytics te installeren.</p>
      <h3>Do Not Track-signalen</h3>
      <p>Sommige browsers versturen een “Do Not Track”-signaal. Omdat er geen gemeenschappelijke standaard voor deze signalen bestaat, reageert onze website er op dit moment niet op.</p>
      <h2>Waarvoor we je gegevens gebruiken</h2>
      <p>We gebruiken persoonsgegevens alleen als we daar een geldige reden voor hebben, onder meer om:</p>
      <ul><li>Onze diensten en ons platform te leveren, te beheren en te verbeteren</li><li>Je vragen en verzoeken te beantwoorden</li><li>Voorstellen te maken en onze samenwerking met je te beheren</li><li>Updates en marketing te sturen waarvoor je toestemming hebt gegeven</li><li>Sollicitaties te beoordelen</li><li>Onze website te beveiligen, fraude te voorkomen en aan wettelijke verplichtingen te voldoen</li></ul>
      <h3>Grondslagen</h3>
      <p>We verwerken persoonsgegevens omdat dat nodig is om een overeenkomst met je uit te voeren, omdat je toestemming hebt gegeven, omdat we een gerechtvaardigd zakelijk belang hebben dat niet zwaarder weegt dan jouw rechten, of omdat we daartoe wettelijk verplicht zijn. Voor bezoekers in Nederland en de rest van de EU gebeurt dit in overeenstemming met de Algemene verordening gegevensbescherming (AVG).</p>
      <h3>Marketing</h3>
      <p>Als je hebt aangegeven marketingmails te willen ontvangen, kunnen we je nieuws, gidsen en aanbiedingen sturen. Je kunt je op elk moment afmelden via de link in elke e-mail of door contact met ons op te nemen.</p>
      <h2>Delen van je gegevens</h2>
      <p>We verkopen of verhuren je persoonsgegevens niet. We kunnen ze delen met betrouwbare dienstverleners die ons helpen ons bedrijf te runnen, zoals aanbieders van hosting, e-mail, analytics en betalingen. Dat doen we alleen voor zover nodig voor hun dienstverlening en onder passende geheimhoudingsafspraken. Ook kunnen we gegevens delen als de wet dat vereist, of bij een fusie, overname of verkoop van bedrijfsonderdelen. In dat geval laten we het je weten als er een andere privacyverklaring op je gegevens van toepassing wordt.</p>
      <h2>Je gegevens inzien, wijzigen of verwijderen</h2>
      <p>Je kunt ons vragen de persoonsgegevens die we van je hebben in te zien, te corrigeren, bij te werken of te verwijderen, of om te stoppen met het gebruik ervan voor marketing. Stuur je verzoek naar <a href="mailto:info@finloa.com">info@finloa.com</a>. Mogelijk moeten we eerst je identiteit controleren voordat we je verzoek kunnen uitvoeren. Ben je het niet eens met hoe we met je gegevens omgaan, dan kun je ook een klacht indienen bij de Autoriteit Persoonsgegevens.</p>
      <h2>Hoe lang we je gegevens bewaren</h2>
      <p>We bewaren persoonsgegevens niet langer dan nodig is voor de doelen in deze verklaring, waaronder het voldoen aan wettelijke, boekhoudkundige en rapportageverplichtingen. Hebben we ze niet meer nodig, dan verwijderen of anonimiseren we ze.</p>
      <h2>Beveiliging</h2>
      <p>We nemen redelijke technische en organisatorische maatregelen om je persoonsgegevens te beschermen, zoals versleutelde verbindingen en toegangsbeheer. Geen enkele manier van verzenden of opslaan is volledig veilig, dus absolute veiligheid kunnen we niet garanderen.</p>
      <h2>Beperking van aansprakelijkheid</h2>
      <p>Je deelt gegevens via onze website op eigen risico. Voor zover de wet dat toestaat, is Finloa niet verantwoordelijk voor onbevoegde toegang tot gegevens door gebeurtenissen die redelijkerwijs buiten onze macht liggen.</p>
      <h2>Privacy van kinderen</h2>
      <p>Onze website en diensten zijn niet bedoeld voor kinderen jonger dan 16 jaar. We verzamelen niet bewust persoonsgegevens van kinderen. Denk je dat een kind ons persoonsgegevens heeft gegeven? Neem dan contact met ons op, dan verwijderen we ze.</p>
      <h2>Andere websites</h2>
      <p>Onze website kan links bevatten naar andere websites waar wij geen invloed op hebben. We zijn niet verantwoordelijk voor hun inhoud of privacybeleid en raden je aan hun privacyverklaringen te lezen.</p>
      <h2>Wijzigingen in deze verklaring</h2>
      <p>We kunnen deze verklaring van tijd tot tijd aanpassen. Als we dat doen, wijzigen we de datum bij “Laatst bijgewerkt op” bovenaan deze pagina. Belangrijke wijzigingen maken we op onze website duidelijk zichtbaar.</p>
      <h2>Vragen over deze verklaring</h2>
      <p>Heb je vragen over deze privacyverklaring of over hoe we met je gegevens omgaan? Neem contact met ons op via <a href="mailto:info@finloa.com">info@finloa.com</a>.</p>
    </>
  );
}
