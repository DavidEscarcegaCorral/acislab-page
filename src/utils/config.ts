/**
 * Configuration Tools
 * Convenient for accessing and using configuration items in the application
 */

import originalSiteConfigFromFile from '../config/site.json';

// Configuration type definition
// SiteConfig
export interface SiteConfig {
  site: SiteSubConfig;
  giscus: {
    enabled: boolean;
    repo: string;
    repoId: string;
    category: string;
    categoryId: string;
    mapping: string;
    strict: string;
    theme: string;
    reactionsEnabled: boolean;
    emitMetadata: boolean;
    inputPosition: string;
    lang: string;
    loading: string;
  };
  seo: {
    openGraph: {
      twitterCreator: string;
      defaultImageWidth: number;
      defaultImageHeight: number;
    };
    analytics: {
      googleAnalyticsId: string;
      baiduAnalyticsId: string;
    };
  };
  social: {
    twitter?: string;
    github: string;
    linkedin: string;
  };
  features: {
    darkMode: boolean;
    tableOfContents: boolean;
    readingTime: boolean;
    search: boolean;
    comments: boolean;
  };
  navigation?: {
    header: NavItem[];
    footer: NavItem[];
  };
}

export interface SiteSubConfig {
  title: string;
  description: string;
  url: string;
  author: string;
  email: string;
  logo: string;
  homeTitle: string;
  homeSubtitle: string;
  blogSubtitle: string;
  projectSubtitle: string;
  brandTitle: string;
}

export interface DynamicSiteConfig extends SiteSubConfig {
  base: string;

}


export interface NavItem {
  text: string;
  href: string;
}

/**
 * Get all configurations from site.json (original static config)
 */
export function getConfig(): SiteConfig {
  return originalSiteConfigFromFile as SiteConfig;
}

/**
 * Get site basic configuration with dynamic URL and base path.
 * This function is intended for use in astro.config.mjs and places where deployed URL/base is needed.
 * @returns {DynamicSiteConfig} Site configuration with dynamic URL and base path.
 */
export function getSiteConfig(): DynamicSiteConfig {
  const deployEnv = process.env.DEPLOY_ENV || 'LOCAL';
  const githubRepoName = process.env.GITHUB_REPO_NAME || 'product_whoami';
  const githubActor = process.env.GITHUB_ACTOR || 'copyboy';

  const baseSiteDetails = { ...originalSiteConfigFromFile.site };

  let dynamicUrl: string;
  let dynamicBase: string;

  switch (deployEnv) {
    case 'DEMO_GITHUB_PAGES':
      dynamicUrl = `https://${githubActor}.github.io`;
      dynamicBase = `/${githubRepoName}`;
      break;
    case 'MAIN_CLOUDFLARE':
      dynamicUrl = originalSiteConfigFromFile.site.url;
      dynamicBase = '/';
      break;
    default: // LOCAL or other environments
      dynamicUrl = originalSiteConfigFromFile.site.url || 'http://localhost:4321';
      dynamicBase = '/';
      break;
  }

  return {
    ...baseSiteDetails,
    url: dynamicUrl,
    base: dynamicBase,
  };
}

/**
 * Get Giscus comment configuration (from site.json)
 */
export function getGiscusConfig() {
  return originalSiteConfigFromFile.giscus;
}

/**
 * Get SEO configuration (from site.json)
 */
export function getSeoConfig() {
  return originalSiteConfigFromFile.seo;
}

/**
 * Get social media configuration (from site.json)
 */
export function getSocialConfig() {
  return originalSiteConfigFromFile.social;
}

/**
 * Get feature switch configuration (from site.json)
 */
export function getFeaturesConfig() {
  return originalSiteConfigFromFile.features;
}

/**
 * Get navigation configuration (from site.json)
 */
export function getNavigationConfig() {
  return (originalSiteConfigFromFile as any).navigation || { header: [], footer: [] };
}

/**
 * Check if a specific feature is enabled (from site.json)
 * @param featureName Feature name
 * @returns Whether the feature is enabled
 */
export function isFeatureEnabled(featureName: keyof SiteConfig['features']): boolean {
  return originalSiteConfigFromFile.features[featureName] === true;
}

/**
 * Format page title.
 * This will use the site title from site.json (via the modified getSiteConfig).
 * @param pageTitle Page title
 * @returns Formatted complete title
 */
export function formatPageTitle(pageTitle: string): string {
  const siteDetails = getSiteConfig();
  return `${pageTitle} | ${siteDetails.title}`;
}

export default {
  getConfig,
  getSiteConfig,
  getGiscusConfig,
  getSeoConfig,
  getSocialConfig,
  getFeaturesConfig,
  getNavigationConfig,
  isFeatureEnabled,
  formatPageTitle
};