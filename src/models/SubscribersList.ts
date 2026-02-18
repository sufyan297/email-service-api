import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import List from "./List";
import Subscriber from "./Subcriber";

@Entity({ name: "subscriber_lists" })
export default class SubscriberList {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar")
  is_subscribed: string;

  @Column()
  is_active: boolean;

  @Column()
  is_deleted: boolean;

  @Column("datetime")
  @CreateDateColumn()
  created_at: Date;

  @Column("datetime")
  @UpdateDateColumn()
  updated_at: Date;

  @Column("datetime")
  deleted_at: Date;

  @ManyToMany(() => List)
  list: List[];

  @ManyToMany(() => Subscriber)
  subscriber: Subscriber[];
}
