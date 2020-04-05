type HeadType = 'title' | 'meta';

const isServerSide = typeof document === 'undefined';

function debounceFrame(func: any) {
  let timeout: any;

  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func();
    }, 1000 / 60);
  };
}

const changeOrCreateMetaTag = (meta: any) => {
  const propertyValue = meta[meta.keyword];
  const result = document.head.querySelectorAll(
    meta.charset ? 'meta[charset]' : `meta[${meta.keyword}="${propertyValue}"]`
  );

  if (result[0]) {
    if (meta.charset) {
      result[0].setAttribute(meta.keyword, meta.charset);
    } else {
      result[0].setAttribute('content', meta.content as string);
    }
  } else {
    const metaTag = document.createElement('meta');
    if (meta.charset) {
      metaTag.setAttribute('charset', meta.charset);
    } else {
      metaTag.setAttribute(meta.keyword, meta[meta.keyword] as string);
      metaTag.setAttribute('content', meta.content as string);
    }
    document.head.appendChild(metaTag);
  }
};

/**
 * This dispatcher orchestrates the title and meta updates/creation/deletion.
 *
 * This is needed because of the order of execution in hooks
 *
 * <App> --> useTitle('x')
 *  <Child /> --> useTitle('y')
 *
 * Will display 'x' due to the effects resolving bottom-up, instead we schedule
 * both meta and titles in batches.
 *
 * When this batch is processed we only take one of each kind of meta and one title.
 *
 * Due to the batching with "currentXIndex" we also account for the scenario where Child
 * would get switched out for Child2, this is a new batch and will be put in front of the
 * queue.
 */
const createDispatcher = () => {
  let titleQueue: string[] = [];
  let metaQueue: any[] = [];
  let currentTitleIndex = 0;
  let currentMetaIndex = 0;

  // A process can be debounced by one frame timing,
  // since microticks could potentially interfere with how
  // React works.
  const process = debounceFrame(() => {
    const visited = new Set();
    document.title = titleQueue[0];

    metaQueue.forEach((meta) => {
      if (
        !visited.has(
          meta.keyword === 'charset' ? meta.keyword : meta[meta.keyword]
        )
      ) {
        visited.add(
          meta.keyword === 'charset' ? meta.keyword : meta[meta.keyword]
        );
        changeOrCreateMetaTag(meta);
      }
    });

    currentTitleIndex = currentMetaIndex = 0;
  });

  return {
    addToQueue: (type: HeadType, payload: any): void => {
      if (!isServerSide) process();

      if (type === 'title') {
        titleQueue.splice(currentTitleIndex++, 0, payload);
      } else {
        metaQueue.splice(currentMetaIndex++, 0, payload);
      }
    },
    removeFromQueue: (type: HeadType, payload: any) => {
      if (type === 'title') {
        titleQueue.splice(titleQueue.indexOf(payload), 1);
        document.title = titleQueue[0] || '';
      } else {
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
                : `meta[${oldMeta.keyword}="${oldMeta[oldMeta.keyword]}"]`
            );

            document.head.removeChild(result[0]);
          }
        }
      }
    },
    change: (type: HeadType, prevPayload: string, payload: any) => {
      if (type === 'title') {
        document.title = titleQueue[titleQueue.indexOf(prevPayload)] = payload;
      } else {
        changeOrCreateMetaTag(
          (metaQueue[metaQueue.indexOf(prevPayload)] = payload)
        );
      }
    },
    reset: () => {
      titleQueue = [];
      metaQueue = [];
    },
    // toString: () => {
    //  Will process the two arrays, taking the first title in the array and returning <title>{string}</title>
    //  Then do a similar for the meta's. (will also need to add links, and add a linkQueue). Note that both queues
    //  will need a reset to prevent memory leaks.
    // },
  };
};

export default createDispatcher();
