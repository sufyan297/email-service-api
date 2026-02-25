import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import SubscriberList from "./SubscribersList";
import DeliveryLog from "./DeliveryLog";
import MailQueue from "./MailQueue";

@Entity({ name: "subscribers" })
export default class Subscriber {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar")
  email: string;

  @Column("varchar")
  name: string;

  @Column("json", { nullable: true })
  attributes?: Record<string, any>;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: false })
  is_deleted: boolean;

  @Column("datetime")
  @CreateDateColumn()
  created_at: Date;

  @Column("datetime")
  @UpdateDateColumn()
  updated_at: Date;

  @Column("datetime", { nullable: true })
  deleted_at: Date;

  @OneToMany(() => SubscriberList, (subscriberList) => subscriberList.subscriber)
  subscriberLists: SubscriberList[];

  @OneToMany(() => DeliveryLog, (deliveryLog) => deliveryLog.subscriber)
  deliveryLogs: DeliveryLog[];

  @OneToMany(() => MailQueue, (mailQueue) => mailQueue.subscriber)
  mailQueues: MailQueue[];
}
