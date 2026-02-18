import "typeorm";

declare module "typeorm" {
  interface FindManyOptions<Entity = any> {
    limit?: number;
  }
}