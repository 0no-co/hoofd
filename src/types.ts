export type OG =
  | 'og:title'
  | 'og:type'
  | 'og:url'
  | 'og:image'
  | 'og:site_name'
  | 'og:description'
  | 'og:email'
  | 'og:phone_number'
  | 'og:fax_number'
  | 'fb:admins'
  | 'fb:app_id';

export type Name =
  | OG
  | 'application-name'
  | 'author'
  | 'description'
  | 'generator'
  | 'keywords'
  | 'viewport'
  | 'referrer'
  | 'theme-color'
  | 'color-scheme'
  | 'subject'
  | 'copyright'
  | 'language'
  | 'robots'
  | 'revised'
  | 'abstract'
  | 'topic'
  | 'summary'
  | 'Classification'
  | 'designer'
  | 'reply-to'
  | 'owner'
  | 'url'
  | 'identifier-URL'
  | 'directory'
  | 'category'
  | 'coverage'
  | 'distribution'
  | 'rating'
  | 'revisit-after';

export type Property = OG;

export type HttpEquiv =
  | 'content-type'
  | 'default-style'
  | 'refresh'
  | 'content-security-policy'
  | 'Expires'
  | 'Pragma'
  | 'Cache-Control';

export type CharSet = 'utf-8';

export type Rel =
  | 'shortcut icon'
  | 'apple-touch-icon'
  | 'apple-touch-startup-image'
  | 'alternate'
  | 'shortcut icon'
  | 'fluid-icon'
  | 'icon'
  | 'stylesheet'
  | 'me'
  | 'canonical'
  | 'preload'
  | 'prefetch'
  | 'dns-prefetch'
  | 'preconnect'
  | 'modulepreload';

export type As =
  | 'audio'
  | 'document'
  | 'embed'
  | 'fetch'
  | 'font'
  | 'image'
  | 'object'
  | 'script'
  | 'style'
  | 'track'
  | 'video'
  | 'worker';
