import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import List from "./List";
import Subscriber from "./Subscriber";

@Entity({ name: "subscriber_lists" })
export default class SubscriberList {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("char", { length: 36 })
  subscriber_id: string;

  @Column("char", { length: 36 })
  list_id: string;

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

  @ManyToOne(() => Subscriber, (subscriber) => subscriber.subscriberLists, { lazy: true })
  subscriber: Promise<Subscriber>;

  @ManyToOne(() => List, (list) => list.subscriberLists, { lazy: true })
  list: Promise<List>;
}
