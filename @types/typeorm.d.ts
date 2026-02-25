import "typeorm";

declare module "typeorm" {
  interface FindManyOptions<Entity = any> {
    limit?: number;
  }

  type GetManySubscribersOptions = {
    list_ids?: string[];
    subscription_status?: boolean;
    page?: number;
    per_page?: number;
    order_by?: "created_at" | "updated_at";
    order?: "ASC" | "DESC";
  };
}
