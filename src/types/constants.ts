/**
 * Subscriber account-level status.
 */
export enum SubscriberStatus {
  enabled = "enabled",
  disabled = "disabled",
  blocklisted = "blocklisted",
}

/**
 * Subscription status for a specific list.
 */
export enum SubscriptionStatus {
  confirmed = "confirmed",
  unconfirmed = "unconfirmed",
  unsubscribed = "unsubscribed",
}

/**
 * List visibility type.
 * - `public`: List can be shown on public subscription forms
 * - `private`: List is internal only, not visible to subscribers
 */
export enum ListType {
  public = "public",
  private = "private",
  temporary = "temporary",
}

/**
 * Opt-in confirmation mode.
 * - `single`: Subscribers are added immediately without confirmation
 * - `double`: Subscribers must confirm via email before being added
 */
export enum ListOptin {
  single = "single",
  double = "double",
}

/**
 * List availability status.
 * - `active`: List is fully operational and visible in selectors
 * - `archived`: List is hidden from UI selectors but retains data
 */
export enum ListStatus {
  active = "active",
  archived = "archived",
}

/**
 * Actions for list membership modification.
 */
export enum ListAction {
  add = "add",
  remove = "remove",
  unsubscribe = "unsubscribe",
}

export enum CampaignStatus {
  draft = "draft",
  scheduled = "scheduled",
  running = "running",
  paused = "paused",
  cancelled = "cancelled",
  finished = "finished",
}

export enum CampaignType {
  regular = "regular",
  optin = "optin",
}

export enum CampaignContentType {
  richtext = "richtext",
  html = "html",
  markdown = "markdown",
  plain = "plain",
  visual = "visual",
}

/**
 * SMTP authentication protocol.
 */
export enum SMTPConfigAuthProtocol {
  plain = "plain",
  login = "login",
  cram = "cram",
  none = "none",
}

/**
 * TLS configuration type.
 */
export enum SMTPConfigTlsType {
  none = "none",
  starttls = "STARTTLS",
  tls = "TLS",
}

export enum TemplateType {
  campaign = "campaign",
  campaign_visual = "campaign_visual",
  tx = "tx",
}

export enum BounceType {
  hard = "hard",
  soft = "soft",
  complaint = "complaint",
}

export enum UserType {
  user = "user",
  api = "api",
}

export enum UserStatus {
  enabled = "enabled",
  disabled = "disabled",
}

export enum TwoFAType {
  none = "none",
  totp = "totp",
}

export enum Order {
  asc = "ASC",
  desc = "DESC",
}
