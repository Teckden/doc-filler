import { useEffect, useRef, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppState } from '../contexts/AppStateContext'
import navbarButtonPng from '../assets/help/navbar-button.png'
import drawerListPng from '../assets/help/drawer-list.png'
import presetEditorPng from '../assets/help/preset-editor.png'
import comboboxPng from '../assets/help/combobox.png'
import multiplePresetsPng from '../assets/help/multiple-presets.png'

const YAML_SAMPLE: Record<'en' | 'uk', string> = {
  en: `kind: docfiller-field-presets
version: 1
presets:
  - name: Managers
    fieldKey: manager_name
    allowManual: true
    options:
      - J. Smith
      - A. Johnson`,
  uk: `kind: docfiller-field-presets
version: 1
presets:
  - name: Менеджери
    fieldKey: manager_name
    allowManual: true
    options:
      - І. Петренко
      - О. Коваль`,
}

export const PresetsHelpModal = () => {
  const { t, i18n } = useTranslation()
  const { activeModal, closeModal } = useAppState()
  const open = activeModal?.type === 'presetsHelp'
  const sample = i18n.resolvedLanguage === 'uk' ? YAML_SAMPLE.uk : YAML_SAMPLE.en

  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const steps: { step: string; title: string; body: string }[] = [
    { step: '1', title: t('presetsHelp.step1Title'), body: t('presetsHelp.step1Body') },
    { step: '2', title: t('presetsHelp.step2Title'), body: t('presetsHelp.step2Body') },
    { step: '3', title: t('presetsHelp.step3Title'), body: t('presetsHelp.step3Body') },
  ]

  const sections: { title: string; body: ReactNode; image: string; alt: string }[] = [
    {
      title: t('presetsHelp.createTitle'),
      body: t('presetsHelp.createBody'),
      image: presetEditorPng,
      alt: t('presetsHelp.altEditor'),
    },
    {
      title: t('presetsHelp.fillTitle'),
      body: (
        <>
          {t('presetsHelp.fillBody')} {t('presetsHelp.fillListOnly')}
        </>
      ),
      image: comboboxPng,
      alt: t('presetsHelp.altCombobox'),
    },
    {
      title: t('presetsHelp.multiTitle'),
      body: t('presetsHelp.multiBody'),
      image: multiplePresetsPng,
      alt: t('presetsHelp.altMulti'),
    },
    {
      title: t('presetsHelp.libraryTitle'),
      body: (
        <>
          {t('presetsHelp.libraryBody')}
          <img
            src={navbarButtonPng}
            alt={t('presetsHelp.altNavbar')}
            className="mt-3 w-[146px] rounded-box border border-base-300"
          />
        </>
      ),
      image: drawerListPng,
      alt: t('presetsHelp.altLibrary'),
    },
  ]

  return (
    <dialog ref={dialogRef} className="modal" onClose={closeModal}>
      <div className="modal-box w-11/12 max-w-4xl bg-base-100">
        <form method="dialog">
          <button
            className="btn btn-circle btn-ghost btn-sm absolute right-3 top-3"
            aria-label={t('common.close')}
          >
            ✕
          </button>
        </form>

        <header className="pr-8">
          <h3 className="text-[15px] font-semibold">{t('presetsHelp.title')}</h3>
          <p className="mt-1 text-[13px] leading-relaxed opacity-65">{t('presetsHelp.intro')}</p>
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

        {sections.map(({ title, body, image, alt }) => (
          <section key={title} className="mt-6 grid items-start gap-5 md:grid-cols-2">
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.1em] opacity-60">
                {title}
              </h4>
              <p className="mt-2 text-[12.5px] leading-relaxed opacity-75">{body}</p>
            </div>
            <img src={image} alt={alt} className="w-full rounded-box border border-base-300" />
          </section>
        ))}

        <section className="mt-6 grid items-start gap-5 md:grid-cols-2">
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.1em] opacity-60">
              {t('presetsHelp.yamlTitle')}
            </h4>
            <p className="mt-2 text-[12.5px] leading-relaxed opacity-75">
              {t('presetsHelp.yamlBody')}
            </p>
          </div>
          <pre className="overflow-x-auto rounded-box border border-base-300 bg-base-200 p-4 font-mono text-[12px] leading-relaxed">
            {sample}
          </pre>
        </section>

        <section className="mt-6">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.1em] opacity-60">
            {t('presetsHelp.knowTitle')}
          </h4>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[12.5px] leading-relaxed opacity-75">
            <li>{t('presetsHelp.know1')}</li>
            <li>{t('presetsHelp.know2')}</li>
            <li>{t('presetsHelp.know3')}</li>
            <li>{t('presetsHelp.know4')}</li>
          </ul>
        </section>

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
  )
}
