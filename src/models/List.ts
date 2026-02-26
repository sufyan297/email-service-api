import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import SubscriberList from "./SubscribersList";
import CampaignList from "./CampaignList";

@Entity({ name: "lists" })
export default class List {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar")
  name: string;

  @Column("text", { nullable: true })
  description: string;

  @Column("varchar")
  optin_mode: string;

  @Column()
  is_private: boolean;

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

  @OneToMany(() => SubscriberList, (subscriberList) => subscriberList.list)
  subscriberLists: SubscriberList[];

  @OneToMany(() => CampaignList, (campaignList) => campaignList.list)
  campaignLists: CampaignList[];
}
