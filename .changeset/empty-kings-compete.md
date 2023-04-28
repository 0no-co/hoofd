---
'hoofd': minor
---

Make `useLink` concurrent safe by only re-using `link` tags carrying `data-hoofd="1"`, these would come from hydration as hoofd will add these to the static export
