import { useRef } from 'react'

const SAMPLE = `Dear {{client_name}},

This confirms invoice {{invoice_no}} for the amount
of {{amount}}, due on {{due_date}}.

Issued by {{issuer_name}}.`

export const HelpModal = () => {
  const dialogRef = useRef<HTMLDialogElement>(null)

  return (
    <>
      <div className="tooltip tooltip-bottom" data-tip="How to use DocFiller">
        <button
          type="button"
          className="btn btn-circle btn-ghost btn-sm text-base-content/70 hover:text-primary"
          aria-label="How to use DocFiller"
          onClick={() => dialogRef.current?.showModal()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.7}
            stroke="currentColor"
            className="size-5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
            />
          </svg>
        </button>
      </div>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box w-11/12 max-w-5xl bg-base-100">
          <form method="dialog">
            <button
              className="btn btn-circle btn-ghost btn-sm absolute right-3 top-3"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-4"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </form>

          <header className="pr-8">
            <h3 className="text-[15px] font-semibold">How to use DocFiller</h3>
            <p className="mt-1 text-[13px] leading-relaxed opacity-65">
              Turn a Word document with placeholders into a fillable form, then export a finished{' '}
              <code className="rounded bg-base-300 px-1 py-0.5 font-mono text-xs">.docx</code>.
            </p>
          </header>

          <ol className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Add placeholders',
                body: (
                  <>
                    In your Word file, wrap each variable in double curly braces, e.g.{' '}
                    <code className="rounded bg-base-300 px-1 py-0.5 font-mono text-xs">
                      {'{{client_name}}'}
                    </code>
                    . Use letters, numbers, and underscores.
                  </>
                ),
              },
              {
                step: '2',
                title: 'Upload & fill',
                body: (
                  <>
                    Upload the <span className="font-medium">.docx</span>. DocFiller detects every
                    placeholder and builds a labeled text field for each one.
                  </>
                ),
              },
              {
                step: '3',
                title: 'Export',
                body: (
                  <>
                    Fill the fields and click <span className="font-medium">Export .docx</span> to
                    download a copy named{' '}
                    <code className="rounded bg-base-300 px-1 py-0.5 font-mono text-xs">
                      filled-…docx
                    </code>{' '}
                    with your values inserted.
                  </>
                ),
              },
            ].map(({ step, title, body }) => (
              <li key={step} className="rounded-box border border-base-300 bg-base-200 p-4">
                <div className="flex items-center gap-2">
                  <span className="grid size-6 place-items-center rounded-full bg-primary text-[12px] font-semibold text-primary-content">
                    {step}
                  </span>
                  <h4 className="text-[13.5px] font-semibold">{title}</h4>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed opacity-70">{body}</p>
              </li>
            ))}
          </ol>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <section>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.1em] opacity-60">
                Placeholder syntax
              </h4>
              <pre className="mt-2 overflow-x-auto rounded-box border border-base-300 bg-base-200 p-4 font-mono text-[12.5px] leading-relaxed">
                {SAMPLE}
              </pre>
              <p className="mt-2 text-[12.5px] leading-relaxed opacity-65">
                Each unique placeholder becomes one field. Repeat the same{' '}
                <code className="rounded bg-base-300 px-1 py-0.5 font-mono text-[11px]">
                  {'{{name}}'}
                </code>{' '}
                anywhere in the document and every occurrence is filled with the same value.
              </p>
            </section>

            <section>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.1em] opacity-60">
                Supported field types
              </h4>
              <div className="mt-2 overflow-x-auto rounded-box border border-base-300">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>How it works</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-medium">Text</td>
                      <td className="opacity-75">
                        The only type today. Whatever you type is inserted exactly as-is.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-[12.5px] leading-relaxed opacity-65">
                Dates, numbers, and currency are entered as plain text — type them the way they
                should appear (e.g. <span className="font-medium">Jun 22, 2026</span> or{' '}
                <span className="font-medium">$1,250.00</span>).
              </p>
            </section>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <section>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.1em] opacity-60">
                Good to know
              </h4>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[12.5px] leading-relaxed opacity-75">
                <li>
                  Variable names are case-sensitive —{' '}
                  <code className="rounded bg-base-300 px-1 py-0.5 font-mono text-[11px]">
                    {'{{Name}}'}
                  </code>{' '}
                  and{' '}
                  <code className="rounded bg-base-300 px-1 py-0.5 font-mono text-[11px]">
                    {'{{name}}'}
                  </code>{' '}
                  are different fields.
                </li>
                <li>Leaving a field blank inserts nothing — it won&apos;t block export.</li>
                <li>
                  Type each placeholder in one pass so Word doesn&apos;t split it or swap in “smart
                  quotes”; either can stop it being detected.
                </li>
                <li>
                  Only <span className="font-medium">.docx</span> files are accepted.
                </li>
                <li>
                  Templates are stored locally in your browser and persist across reloads — upload
                  several and switch between them from the top bar.
                </li>
              </ul>
            </section>

            <section>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.1em] opacity-60">
                Not supported yet
              </h4>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[12.5px] leading-relaxed opacity-75">
                <li>
                  Loops / repeating rows, conditional sections, and image placeholders are skipped —
                  they won&apos;t appear as fields.
                </li>
                <li>No live preview yet, and field values aren&apos;t saved between sessions.</li>
                <li>
                  <span className="font-medium">.dotx</span> templates and PDF export aren&apos;t
                  available.
                </li>
              </ul>
            </section>
          </div>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-sm">Close</button>
            </form>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button aria-label="Close">close</button>
        </form>
      </dialog>
    </>
  )
}
