type HeadType = 'title' | 'meta';

const titleQueue: string[] = [];
const metaQueue: any[] = [];

function debounce(func: any) {
  let timeout: any;

  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func();
    }, 20);
  };
}

export const addToQueue = (type: HeadType, payload: any): number => {
  process();
  switch (type) {
    case 'title':
      return titleQueue.push(payload) - 1;
    case 'meta':
      return metaQueue.push(payload) - 1;
  }
};

export const removeFromQueue = (type: HeadType, index: number) => {
  switch (type) {
    case 'title': {
      titleQueue.splice(index, 1);
      document.title = titleQueue[0] || '';
      break;
    }
    case 'meta': {
      // TODO: we have to find instead of holding indices when rapidly removing, we can't
      // update the indices of certain components due to rapid unmounts.
      const oldMeta = metaQueue[index];
      if (oldMeta) {
        metaQueue.splice(index, 1);
        const newMeta = metaQueue.find(
          (m) =>
            m.keyword === oldMeta.keyword &&
            (m.keyword === 'charset' || m[m.keyword] === oldMeta[m.keyword])
        );

        if (newMeta) {
          changeOrCreateMetaTag(newMeta);
        } else if (oldMeta) {
          const result = document.head.querySelectorAll(
            oldMeta.charset
              ? 'meta[charset]'
              : `meta[${
                  oldMeta.keyword === 'httpEquiv'
                    ? 'http-equiv'
                    : oldMeta.keyword
                }="${oldMeta[oldMeta.keyword]}"]`
          );

          if (result[0]) {
            document.head.removeChild(result[0]);
          }
        }
      }
      break;
    }
  }
};

export const change = (type: HeadType, index: number, payload: any) => {
  switch (type) {
    case 'title': {
      document.title = titleQueue[index] = payload;
      break;
    }
    case 'meta': {
      changeOrCreateMetaTag((titleQueue[index] = payload));
      break;
    }
  }
};

const changeOrCreateMetaTag = (meta: any) => {
  const propertyValue = meta[meta.keyword];
  const result = document.head.querySelectorAll(
    meta.charset
      ? 'meta[charset]'
      : `meta[${
          meta.keyword === 'httpEquiv' ? 'http-equiv' : meta.keyword
        }="${propertyValue}"]`
  );

  if (result[0]) {
    if (meta.charset) {
      result[0].setAttribute('charset', meta.charset);
    } else {
      result[0].setAttribute('content', meta.content as string);
    }
  } else {
    const metaTag = document.createElement('meta');
    if (meta.charset) {
      metaTag.setAttribute('charset', meta.charset);
    } else {
      metaTag.setAttribute(
        meta.keyword === 'httpEquiv' ? 'http-equiv' : meta.keyword,
        meta[meta.keyword] as string
      );
      metaTag.setAttribute('content', meta.content as string);
    }
    document.head.appendChild(metaTag);
  }
};

const process = debounce(() => {
  const visited = new Set();
  document.title = titleQueue[0];

  metaQueue.forEach((meta) => {
    const val = meta.keyword === 'charset' ? 'charset' : meta[meta.keyword];
    if (!visited.has(val)) {
      visited.add(val);
      changeOrCreateMetaTag(meta);
    }
  });
});
