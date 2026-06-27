import { useRef, type ReactNode } from 'react'
import { Trans, useTranslation } from 'react-i18next'

// Kept out of the i18next pipeline: the {{tokens}} must render verbatim, so the
// sample is selected by language here rather than interpolated.
const SAMPLE: Record<'en' | 'uk', string> = {
  en: `Dear {{client_name}},

This confirms invoice {{invoice_no}} for the amount
of {{amount}}, due on {{due_date}}.

Issued by {{issuer_name}}.`,
  uk: `Шановний(а) {{client_name}},

Це підтверджує рахунок {{invoice_no}} на суму
{{amount}}, з оплатою до {{due_date}}.

Виставлено: {{issuer_name}}.`,
}

const transComponents = {
  code: <code className="rounded bg-base-300 px-1 py-0.5 font-mono text-xs" />,
  b: <span className="font-medium" />,
}

export const HelpModal = () => {
  const { t, i18n } = useTranslation()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const sample = i18n.resolvedLanguage === 'uk' ? SAMPLE.uk : SAMPLE.en

  const steps: { step: string; title: string; body: ReactNode }[] = [
    {
      step: '1',
      title: t('help.step1Title'),
      body: (
        <Trans
          i18nKey="help.step1Body"
          components={transComponents}
          values={{ token: '{{client_name}}' }}
        />
      ),
    },
    {
      step: '2',
      title: t('help.step2Title'),
      body: <Trans i18nKey="help.step2Body" components={transComponents} />,
    },
    {
      step: '3',
      title: t('help.step3Title'),
      body: <Trans i18nKey="help.step3Body" components={transComponents} />,
    },
  ]

  return (
    <>
      <div className="tooltip tooltip-bottom" data-tip={t('help.title')}>
        <button
          type="button"
          className="btn btn-circle btn-ghost btn-sm text-base-content/70 hover:text-primary"
          aria-label={t('help.title')}
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
              aria-label={t('common.close')}
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
            <h3 className="text-[15px] font-semibold">{t('help.title')}</h3>
            <p className="mt-1 text-[13px] leading-relaxed opacity-65">
              <Trans i18nKey="help.intro" components={transComponents} />
            </p>
          </header>

          <ol className="mt-5 grid gap-4 sm:grid-cols-3">
            {steps.map(({ step, title, body }) => (
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
                {t('help.syntaxTitle')}
              </h4>
              <pre className="mt-2 overflow-x-auto rounded-box border border-base-300 bg-base-200 p-4 font-mono text-[12.5px] leading-relaxed">
                {sample}
              </pre>
              <p className="mt-2 text-[12.5px] leading-relaxed opacity-65">
                <Trans
                  i18nKey="help.syntaxNote"
                  components={transComponents}
                  values={{ token: '{{name}}' }}
                />
              </p>
            </section>

            <section>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.1em] opacity-60">
                {t('help.typesTitle')}
              </h4>
              <div className="mt-2 overflow-x-auto rounded-box border border-base-300">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>{t('help.typesColType')}</th>
                      <th>{t('help.typesColHow')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-medium">{t('help.typesText')}</td>
                      <td className="opacity-75">{t('help.typesTextDesc')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-[12.5px] leading-relaxed opacity-65">
                <Trans i18nKey="help.typesNote" components={transComponents} />
              </p>
            </section>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <section>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.1em] opacity-60">
                {t('help.knowTitle')}
              </h4>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[12.5px] leading-relaxed opacity-75">
                <li>
                  <Trans
                    i18nKey="help.knowCaseSensitive"
                    components={transComponents}
                    values={{ a: '{{Name}}', b: '{{name}}' }}
                  />
                </li>
                <li>{t('help.knowBlank')}</li>
                <li>{t('help.knowOnePass')}</li>
                <li>
                  <Trans i18nKey="help.knowDocxOnly" components={transComponents} />
                </li>
                <li>{t('help.knowLocal')}</li>
              </ul>
            </section>

            <section>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.1em] opacity-60">
                {t('help.notSupportedTitle')}
              </h4>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[12.5px] leading-relaxed opacity-75">
                <li>{t('help.notSupportedLoops')}</li>
                <li>{t('help.notSupportedPreview')}</li>
                <li>
                  <Trans i18nKey="help.notSupportedFormats" components={transComponents} />
                </li>
              </ul>
            </section>
          </div>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-sm">{t('common.close')}</button>
            </form>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button aria-label={t('common.close')}>{t('common.close')}</button>
        </form>
      </dialog>
    </>
  )
}
