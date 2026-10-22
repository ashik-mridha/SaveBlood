export default function PolicyPage({ title, updated, intro, sections }) {
  return (
    <div className="container-page section">
      <article className="mx-auto max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-widest text-brand-600">Legal</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink md:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-muted">Last updated: {updated}</p>
        <p className="mt-6 leading-relaxed text-muted">{intro}</p>
        {sections.map((section, index) => (
          <section key={section.heading} className="mt-10">
            <h2 className="text-xl font-bold text-ink">
              {index + 1}. {section.heading}
            </h2>
            <div className="mt-3 flex flex-col gap-3 leading-relaxed text-muted">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.list && (
                <ul className="list-disc space-y-1.5 pl-5">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}
      </article>
    </div>
  );
}
