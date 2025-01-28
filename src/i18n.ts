import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import es from '@/locales/es.json'
import nl from '@/locales/nl.json'
import pt from '@/locales/pt.json'
import fa from '@/locales/fa.json'
import he from '@/locales/he.json'
import ru from '@/locales/ru.json'
import ko from '@/locales/ko.json'
import cs from '@/locales/cs.json'
import pl from '@/locales/pl.json'
import it from '@/locales/it.json'
import fr from '@/locales/fr.json'
import uk from '@/locales/uk.json'
import de from '@/locales/de.json'
import zh_Hans from '@/locales/zh_Hans.json'
import ca from '@/locales/ca.json'
import fi from '@/locales/fi.json'
import tr from '@/locales/tr.json'
import vi from '@/locales/vi.json'


export default createI18n({
  legacy: false,
  locale: import.meta.env.SAFETWITCH_DEFAULT_LOCALE || 'en-US',
  fallbackLocale: import.meta.env.SAFETWITCH_FALLBACK_LOCALE || 'en-US',
  globalInjection: true,
  messages: {
    'en': en,
    'en-US': en,
    'es-ES': es,
    'nl-NL': nl,
    'pt-PT': pt,
    'fa-IR': fa,
    'he-IL': he,
    'ru-RU': ru,
    'ko-KR': ko,
    'cs-CZ': cs,
    'pl-PL': pl,
    'it-IT': it,
    'fr-FR': fr,
    'uk-UA': uk,
    'de-DE': de,
    'zh-Hans': zh_Hans,
    'ca-ES': ca,
    'fi-FI': fi,
    'tr-TR': tr,
    'vi-VN': vi
  }
})
