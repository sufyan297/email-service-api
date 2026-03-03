import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import List from "./List";
import Subscriber from "./Subscriber";
import { SubscriptionStatus } from "../types/constants";

@Entity({ name: "subscriber_lists" })
@Index(["subscriber_id", "list_id"], { unique: true })
export default class SubscriberList {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  subscriber_id: number;

  @Column()
  list_id: number;

  @Column("enum", { enum: SubscriptionStatus })
  status: SubscriptionStatus;

  @Column("json")
  meta: Record<string, unknown>;

  @Column({ default: false })
  is_deleted: boolean;

  @Column("datetime")
  @CreateDateColumn()
  created_at: Date;

  @Column("datetime")
  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Subscriber, (subscriber) => subscriber.subscriberLists, { lazy: true })
  @JoinColumn({ name: "subscriber_id", referencedColumnName: "id" })
  subscriber: Promise<Subscriber>;

  @ManyToOne(() => List, (list) => list.subscriberLists, { lazy: true })
  @JoinColumn({ name: "list_id", referencedColumnName: "id" })
  list: Promise<List>;
}
