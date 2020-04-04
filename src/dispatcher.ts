type HeadType = 'title' | 'meta';

let scheduled = false;
const titleQueue: string[] = [];
const metaQueue: any[] = [];

const defer =
  typeof Promise == 'function'
    ? Promise.prototype.then.bind(Promise.resolve())
    : setTimeout;

export const addToQueue = (type: HeadType, payload: any): number => {
  scheduleQueueProcessing();
  switch (type) {
    case 'title':
      return titleQueue.push(payload) - 1;
    case 'meta':
      return metaQueue.push(payload) - 1;
  }
};

export const removeFromQueue = (type: HeadType, index: number) => {
  // splice and look for replacement
  switch (type) {
    case 'title': {
      titleQueue.splice(index, 1);
      document.title = titleQueue[0] || '';
      break;
    }
    case 'meta': {
      const oldMeta = metaQueue[index];
      metaQueue.splice(index, 1);
      const newMeta = metaQueue.find(
        (m) =>
          m.keyword === oldMeta.keyword && m[m.keyword] === oldMeta[m.keyword]
      );

      if (newMeta) {
        changeOrCreateMetaTag(newMeta);
      } else if (oldMeta) {
        const result = document.head.querySelectorAll(
          oldMeta.charset
            ? 'meta[charset]'
            : `meta[${
                oldMeta.keyword === 'httpEquiv' ? 'http-equiv' : oldMeta.keyword
              }="${oldMeta[oldMeta.keyword]}"]`
        );
        if (result[0]) {
          document.head.removeChild(result[0]);
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

export const scheduleQueueProcessing = () => {
  if (!scheduled) {
    scheduled = true;
    defer(() => {
      const visited = new Set();
      document.title = titleQueue[0];

      metaQueue.forEach((meta) => {
        if (!visited.has(meta[meta.keyword])) {
          visited.add(meta[meta.keyword]);
          changeOrCreateMetaTag(meta);
        }
      });
      scheduled = false;
    });
  }
};
