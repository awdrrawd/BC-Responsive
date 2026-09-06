import { activityOptionsAsync } from '../integrations/catalog.js';
import { createActivitySearchAsync } from '../integrations/search.js';

// A picker session owns its cache and outstanding work. Each request has a
// unique generation, including rapid A → B → A switches and close/reopen.
export function createActivityPicker({
  host,
  load = activityOptionsAsync,
  index = createActivitySearchAsync,
}) {
  let generation = 0;
  let session, language, scope, search;
  const cache = new Map();
  function reset() {
    generation++;
    session = language = scope = search = undefined;
    cache.clear();
  }
  function select(nextSession, nextScope, changed, failed) {
    if (session !== nextSession || language !== host.TranslationLanguage) {
      reset();
      session = nextSession;
      language = host.TranslationLanguage;
    }
    if (scope === nextScope) return;
    scope = nextScope;
    const token = ++generation;
    search = cache.get(scope);
    if (search) return;
    const cancelled = () => token !== generation;
    load(host, cancelled, scope === 'all' ? null : scope)
      .then(async (rows) => {
        if (!rows || cancelled()) return;
        const prepared = await index(rows, cancelled);
        if (!prepared || cancelled()) return;
        cache.set(nextScope, prepared);
        search = prepared;
        changed();
      })
      .catch((error) => {
        if (!cancelled()) failed(error);
      });
  }
  return {
    select,
    reset,
    get search() {
      return search;
    },
  };
}
