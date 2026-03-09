import { getMany, getOne, saveData } from "../../libs/Query";
import Link from "../models/Link";

/**
 * Extracts all URLs from href attributes in HTML content
 * Returns unique URLs only
 */
const extractUrlsFromHtml = (html: string): string[] => {
  const urlPattern = /href=["']([^"']+)["']/gi;
  const urls = new Set<string>();
  let match;

  while ((match = urlPattern.exec(html)) !== null) {
    const url = match[1];
    // Filter out empty strings and non-navigational/unsafe schemes
    if (
      url &&
      !url.startsWith("#") &&
      !url.startsWith("javascript:") &&
      !url.startsWith("mailto:") &&
      !url.startsWith("tel:")
    ) {
      urls.add(url);
    }
  }

  return Array.from(urls);
};

/**
 * Creates link records for extracted URLs associated with a campaign
 */
const ExtractAndStoreLinksForCampaign = async (
  campaignId: number,
  html: string,
): Promise<Link[]> => {
  const urls = extractUrlsFromHtml(html);

  if (urls.length === 0) {
    return [];
  }

  const savedLinks = await Promise.all(
    urls.map(async (url) => {
      // Upsert by (campaign_id, url) to avoid duplicates and to keep UUID stable.
      const existing = (await getOne("Link", {
        where: { campaign_id: campaignId, url },
        withDeleted: true,
      })) as Link | null;

      if (existing) {
        const restored = (await saveData("Link", {
          id: existing.id,
          campaign_id: campaignId,
          url,
          is_deleted: false,
        })) as Link;
        return restored;
      }

      const link = (await saveData("Link", {
        campaign_id: campaignId,
        url,
      })) as Link;
      return link;
    }),
  );

  return savedLinks;
};

/**
 * Deletes all existing links for a campaign (soft delete)
 */
const DeleteLinksForCampaign = async (campaignId: number): Promise<void> => {
  const existingLinks = (await getMany("Link", {
    where: { campaign_id: campaignId },
  })) as { id: number }[];

  await Promise.all(
    existingLinks.map(async (link) => {
      await saveData("Link", {
        id: link.id,
        is_deleted: true,
      });
    }),
  );
};

/**
 * Replaces all URLs in HTML with tracking links
 * Maps original URLs to their tracking equivalents
 */
const ReplaceUrlsWithTrackingLinks = async (
  campaignId: number,
  html: string,
  baseUrl: string,
): Promise<string> => {
  const links = (await getMany("Link", {
    where: { campaign_id: campaignId, is_deleted: false },
  })) as Link[];

  if (links.length === 0) {
    return html;
  }

  let modifiedHtml = html;

  // De-duplicate by URL to keep replacements deterministic.
  const byUrl = new Map<string, Link>();
  for (const link of links) {
    if (!byUrl.has(link.url)) {
      byUrl.set(link.url, link);
    }
  }

  // Sort by URL length (longest first) to avoid partial replacements.
  const sortedLinks = Array.from(byUrl.values()).sort((a, b) => b.url.length - a.url.length);

  for (const link of sortedLinks) {
    const trackingUrl = `${baseUrl}/api/public/link-click/${link.uuid}`;
    // Replace href values with tracking URL
    const pattern = new RegExp(`href=["']${escapeRegExp(link.url)}["']`, "g");
    modifiedHtml = modifiedHtml.replace(pattern, `href="${trackingUrl}"`);
  }

  return modifiedHtml;
};

/**
 * Escapes special regex characters in a string
 */
const escapeRegExp = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export {
  ExtractAndStoreLinksForCampaign,
  DeleteLinksForCampaign,
  ReplaceUrlsWithTrackingLinks,
  extractUrlsFromHtml,
};
