import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Generated,
} from "typeorm";
import SubscriberList from "./SubscriberList";
import { SubscriberStatus } from "../types/constants";
import Bounce from "./Bounce";

@Entity({ name: "subscribers" })
export default class Subscriber {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Generated("uuid")
  @Column("char", { length: 36, unique: true })
  uuid: string;

  @Column("varchar", { unique: true })
  email: string;

  @Column("varchar")
  name: string;

  @Column("enum", { enum: SubscriberStatus })
  status: SubscriberStatus;

  @Column("json", { nullable: true })
  attribs?: Record<string, unknown>;

  @Column({ default: false })
  is_deleted: boolean;

  @Column("datetime")
  @CreateDateColumn()
  created_at: Date;

  @Column("datetime")
  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => SubscriberList, (subscriberList) => subscriberList.subscriber)
  subscriberLists: SubscriberList[];

  @OneToMany(() => Bounce, (bounce) => bounce.subscriber)
  bounces: Bounce[];
}
