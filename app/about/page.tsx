export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-slate-300">
      <h1 className="mb-6 text-2xl font-bold text-slate-100">
        About Flowstack
      </h1>

      <section className="space-y-6 text-sm leading-relaxed">
        <p>
          Flowstack is a small collection of simple money tools designed to make
          everyday financial tasks easier. Our aim is to help people organise
          their bank switching process, find low-cost direct debit examples,
          plan their switches clearly, and explore helpful digital and money-
          related tools. Flowstack is built to be clean, lightweight, and easy
          to understand — no complex dashboards or confusing jargon.
        </p>

        <h2 className="text-lg font-semibold text-slate-100">
          What Flowstack Is Not
        </h2>
        <p>
          Flowstack is <strong>not</strong> a regulated financial service and
          does <strong>not</strong> provide personalised financial advice. We do
          not recommend specific direct debits as “best” or “required,” we do
          not guarantee that any direct debit will trigger correctly for switch
          incentives, and we do not offer guidance tailored to your personal
          financial situation. Flowstack is not authorised or regulated by the
          FCA.
        </p>
        <p>
          Flowstack contains general planning tools and example direct debits
          only. Always double-check details directly with your bank or service
          provider.
        </p>

        <h2 className="text-lg font-semibold text-slate-100">
          How Flowstack Works
        </h2>
        <p>
          Flowstack uses simple curated lists of low-cost direct debits and
          planning templates to help you organise your switch. These examples
          are common, low-commitment options intended to save time. They are{" "}
          <strong>not</strong> exclusive or required — most direct debits
          generally work with most banks. You can use any direct debit that fits
          your needs.
        </p>

        <h2 className="text-lg font-semibold text-slate-100">
          How Flowstack Makes Money
        </h2>
        <p>
          Flowstack may earn small commissions through affiliate links,
          referrals, and occasionally newsletter partnerships in the future.
          These links are optional and never influence the tools or results you
          see. Flowstack does <strong>not</strong> sell personal data or run
          intrusive advertising.
        </p>

        <h2 className="text-lg font-semibold text-slate-100">
          Data &amp; Privacy
        </h2>
        <p>
          Flowstack stores only minimal information, such as your email address
          if you choose to subscribe. We do <strong>not</strong> store bank
          account details, direct debit numbers, or any sensitive financial
          data. You may unsubscribe from newsletters at any time.
        </p>

        <h2 className="text-lg font-semibold text-slate-100">
          Future Plans
        </h2>
        <p>
          Flowstack is growing gradually. Future updates may include more free
          tools, clearer switch timelines, subscription cost helpers,
          broadband/SIM comparison tools, and lightweight premium features. User
          feedback will help guide the roadmap.
        </p>

        <h2 className="text-lg font-semibold text-slate-100">
          Important Disclaimer
        </h2>
        <p>
          Flowstack aims to keep information helpful and easy to understand, but
          we cannot guarantee complete accuracy. Direct debit availability,
          provider rules, and bank requirements may change. Flowstack may
          contain errors or outdated information. Always confirm details directly
          with official providers before making decisions. Flowstack should not
          be used as the sole basis for financial actions.
        </p>

        <h2 className="text-lg font-semibold text-slate-100">Contact</h2>
        <p>
          To report issues, request a feature, or provide feedback, contact us
          at:{" "}
          <span className="text-slate-100 font-medium">
            support@flowstack.uk
          </span>
        </p>
      </section>
    </main>
  );
}
