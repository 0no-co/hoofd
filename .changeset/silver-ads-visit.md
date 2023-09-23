---
'hoofd': patch
---

Fix case where due to concurrent mode running effects twice our `currentIndex` would get wonky, we need to decrement the currentIndex when we remove the top of the stack during a process iteration
