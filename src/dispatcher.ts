type HeadType = 'title' | 'meta';

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

const createDispatcher = () => {
  let titleQueue: string[] = [];
  let metaQueue: any[] = [];

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

  return {
    addToQueue: (type: HeadType, payload: any): void => {
      process();
      switch (type) {
        case 'title':
          titleQueue.push(payload);
          break;
        case 'meta':
          metaQueue.push(payload);
          break;
      }
    },
    removeFromQueue: (type: HeadType, payload: any) => {
      switch (type) {
        case 'title': {
          titleQueue.splice(titleQueue.indexOf(payload), 1);
          document.title = titleQueue[0] || '';
          break;
        }
        case 'meta': {
          const index = metaQueue.indexOf(payload);
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
            } else {
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
    },
    change: (type: HeadType, prevPayload: string, payload: any) => {
      switch (type) {
        case 'title': {
          document.title = titleQueue[
            titleQueue.indexOf(prevPayload)
          ] = payload;
          break;
        }
        case 'meta': {
          changeOrCreateMetaTag(
            (metaQueue[metaQueue.indexOf(prevPayload)] = payload)
          );
          break;
        }
      }
    },
    reset: () => {
      titleQueue = [];
      metaQueue = [];
    },
  };
};

export default createDispatcher();
