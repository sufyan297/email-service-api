import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import SubscriberList from "./SubscriberList";
import CampaignList from "./CampaignList";
import { ListOptin, ListStatus, ListType } from "../types/constants";

@Entity({ name: "lists" })
export default class List {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Generated("uuid")
  @Column("char", { length: 36, unique: true })
  uuid: string;

  @Column("varchar")
  name: string;

  @Column("enum", { enum: ListType })
  type: ListType;

  @Column("enum", { enum: ListOptin })
  optin: ListOptin;

  @Column("enum", { enum: ListStatus, default: ListStatus.active })
  status: ListStatus;

  @Column("json", { nullable: true })
  tags?: string[];

  @Column("text", { nullable: true })
  description?: string;

  @Column("int", { nullable: true })
  subscriber_count?: number;

  @Column({ default: false })
  is_deleted: boolean;

  @Column("datetime")
  @CreateDateColumn()
  created_at: Date;

  @Column("datetime")
  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => SubscriberList, (subscriberList) => subscriberList.list)
  subscriberLists: SubscriberList[];

  @OneToMany(() => CampaignList, (campaignList) => campaignList.list)
  campaignLists: CampaignList[];
}
