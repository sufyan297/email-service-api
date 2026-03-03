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
import Campaign from "./Campaign";

@Entity({ name: "campaign_lists" })
@Index(["campaign_id", "list_id"], { unique: true })
export default class CampaignList {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  campaign_id: number;

  @Column()
  list_id: number;

  @Column("text")
  list_name: string;

  @Column({ default: false })
  is_deleted: boolean;

  @Column("datetime")
  @CreateDateColumn()
  created_at: Date;

  @Column("datetime")
  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => List, { lazy: true })
  @JoinColumn({ name: "list_id", referencedColumnName: "id" })
  list: Promise<List>;

  @ManyToOne(() => Campaign, { lazy: true })
  @JoinColumn({ name: "campaign_id", referencedColumnName: "id" })
  campaign: Promise<Campaign>;
}
