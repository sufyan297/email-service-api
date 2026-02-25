import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import List from "./List";
import Campaign from "./Campaign";

@Entity({ name: "campaign_lists" })
export default class CampaignList {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("char")
  campaign_id: string;

  @Column("char")
  list_id: string;

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

  @ManyToOne(() => List, { lazy: true })
  @JoinColumn({ name: "list_id", referencedColumnName: "id" })
  list: Promise<List>;

  @ManyToOne(() => Campaign, { lazy: true })
  @JoinColumn({ name: "campaign_id", referencedColumnName: "id" })
  campaign: Promise<Campaign>;
}
