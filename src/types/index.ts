import {
  CampaignStatus,
  ListOptin,
  ListStatus,
  ListType,
  Order,
  SubscriptionStatus,
} from "./constants";

export type GetManySubscribersOptions = {
  query?: string;
  list_id?: number[];
  list_ids?: number[];
  subscription_status?: SubscriptionStatus;
  page?: number;
  per_page?: number | "all";
  order_by?: "created_at" | "updated_at" | "name" | "status";
  order?: Order;
};

export type GetManyListsOptions = {
  query?: string;
  type?: ListType;
  optin?: ListOptin;
  status?: ListStatus;
  minimal?: boolean;
  tag?: string[] | string;
  tags?: string[];
  order_by?: "created_at" | "updated_at" | "name" | "status";
  order?: Order;
  page?: number;
  per_page?: number | "all";
};

export type GetBounceRecordsOptions = {
  campaign_id?: number;
  source?: string;
  order_by?: "created_at" | "email" | "campaign_name" | "source";
  order?: Order | "asc" | "desc";
  page?: number;
  per_page?: number | "all";
};

export type GetManyCampaignsOptions = {
  query?: string;
  no_body?: boolean;
  status?: CampaignStatus | CampaignStatus[];
  tags?: string[];
  order_by?: "created_at" | "updated_at" | "name" | "status";
  order?: Order;
  page?: number;
  per_page?: number | "all";
};

export type GetManySMTPConfigsOptions = {
  query?: string;
  enabled?: boolean;
  is_default?: boolean;
  order_by?: "created_at" | "updated_at" | "host" | "port" | "username";
  order?: Order;
  page?: number;
  per_page?: number;
};
