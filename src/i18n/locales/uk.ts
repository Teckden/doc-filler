// Ukrainian message catalog. Mirrors the key structure of ./en.ts; missing or
// renamed keys fall back to English at runtime (fallbackLng) and surface as
// i18next "missingKey" warnings in dev. Ukrainian has three cardinal plural forms
// (one/few/many), so the count keys carry _one/_few/_many/_other suffixes.
export const uk = {
  common: {
    close: 'Закрити',
    cancel: 'Скасувати',
    save: 'Зберегти',
  },
  language: {
    label: 'Вибрати мову',
  },
  navbar: {
    openMenu: 'Відкрити меню',
    theme: 'Тема',
    templates: 'Шаблони',
  },
  theme: {
    light: 'Світла',
    dark: 'Темна',
    lightTitle: 'Світла тема',
    darkTitle: 'Темна тема',
  },
  templates: {
    untitled: 'Без назви',
    fieldCount_one: '{{count}} поле',
    fieldCount_few: '{{count}} поля',
    fieldCount_many: '{{count}} полів',
    fieldCount_other: '{{count}} поля',
    deleted: 'Видалено «{{name}}»',
    rename: 'Перейменувати {{name}}',
    delete: 'Видалити {{name}}',
    upload: 'Завантажити шаблон',
    switch: 'Перемкнути шаблон — {{name}}',
  },
  empty: {
    title: 'Ще немає шаблонів',
    body: 'Завантажте документ Word із <code>{{token}}</code>, і DocFiller автоматично знайде поля, створивши форму, яку можна заповнити та експортувати.',
    cta: 'Завантажте свій перший шаблон',
    format: 'Підтримуваний формат: .docx',
  },
  workspace: {
    title: 'Заповніть поля документа',
    subtitle:
      'Введіть значення для кожного поля, знайденого в <b>{{name}}</b>, а потім експортуйте.',
    noFields: 'У цьому шаблоні не знайдено полів. Ви все одно можете експортувати його без змін.',
  },
  progress: {
    filled: '{{filled}} з {{total}} заповнено',
  },
  upload: {
    title: 'Додати шаблон',
    body: 'Завантажте <code>.docx</code> із <code>{{token}}</code>. Поля знаходяться автоматично.',
    choose: 'Виберіть шаблон .docx',
    dropzone: 'Перетягніть <b>.docx</b> сюди або натисніть, щоб вибрати',
    invalidType: 'Будь ласка, виберіть файл .docx.',
    added_one: 'Додано «{{name}}» — знайдено {{count}} поле',
    added_few: 'Додано «{{name}}» — знайдено {{count}} поля',
    added_many: 'Додано «{{name}}» — знайдено {{count}} полів',
    added_other: 'Додано «{{name}}» — знайдено {{count}} поля',
    parseError: 'Не вдалося обробити шаблон: {{message}}',
    parseErrorGeneric: 'Не вдалося обробити шаблон.',
    add: 'Додати шаблон',
  },
  rename: {
    title: 'Перейменувати шаблон',
    name: 'Назва',
  },
  export: {
    button: 'Експортувати .docx',
    failed: 'Не вдалося експортувати.',
    filename: 'заповнено-{{name}}.docx',
  },
  footer: {
    source: 'Вихідний код',
  },
  help: {
    title: 'Як користуватися DocFiller',
    intro:
      'Перетворіть документ Word із заповнювачами на форму для заповнення, а потім експортуйте готовий <code>.docx</code>.',
    step1Title: 'Додайте заповнювачі',
    step1Body:
      'У файлі Word візьміть кожну змінну в подвійні фігурні дужки, напр. <code>{{token}}</code>. Використовуйте літери, цифри та підкреслення.',
    step2Title: 'Завантажте та заповніть',
    step2Body:
      'Завантажте <b>.docx</b>. DocFiller знаходить кожен заповнювач і створює підписане текстове поле для кожного з них.',
    step3Title: 'Експорт',
    step3Body:
      'Заповніть поля та натисніть <b>Експортувати .docx</b>, щоб завантажити копію з назвою <code>заповнено-…docx</code> зі вставленими значеннями.',
    syntaxTitle: 'Синтаксис заповнювачів',
    syntaxNote:
      'Кожен унікальний заповнювач стає одним полем. Повторіть той самий <code>{{token}}</code> будь-де в документі, і кожне його входження заповниться тим самим значенням.',
    typesTitle: 'Підтримувані типи полів',
    typesColType: 'Тип',
    typesColHow: 'Як працює',
    typesText: 'Текст',
    typesTextDesc: 'Поки що єдиний тип. Усе, що ви вводите, вставляється точно як є.',
    typesNote:
      'Дати, числа та грошові суми вводяться як звичайний текст — пишіть їх так, як вони мають відображатися (напр. <b>22 черв. 2026 р.</b> або <b>1 250,00 ₴</b>).',
    knowTitle: 'Корисно знати',
    knowCaseSensitive:
      'Імена змінних чутливі до регістру — <code>{{a}}</code> та <code>{{b}}</code> — це різні поля.',
    knowBlank: 'Якщо залишити поле порожнім, нічого не вставиться — це не завадить експорту.',
    knowOnePass:
      'Вводьте кожен заповнювач за один раз, щоб Word не розбив його та не замінив лапки на «розумні»; будь-що з цього може завадити його розпізнаванню.',
    knowDocxOnly: 'Приймаються лише файли <b>.docx</b>.',
    knowLocal:
      'Шаблони зберігаються локально у вашому браузері та лишаються після перезавантаження — завантажте кілька й перемикайтеся між ними на верхній панелі.',
    notSupportedTitle: 'Поки що не підтримується',
    notSupportedLoops:
      "Цикли / повторювані рядки, умовні блоки та заповнювачі зображень пропускаються — вони не з'являться як поля.",
    notSupportedPreview:
      'Поки що немає живого попереднього перегляду, а значення полів не зберігаються між сеансами.',
    notSupportedFormats: 'Шаблони <b>.dotx</b> та експорт у PDF недоступні.',
  },
} as const
