import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import List from "./List";
import Campaign from "./Campaign";

@Entity({ name: "campaign_lists" })
export default class CampaignList {
  @PrimaryGeneratedColumn("uuid")
  id: string;

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
  @JoinColumn({ name: "list_id", referencedColumnName: "id" })
  list: List[];

  @ManyToMany(() => Campaign)
  @JoinColumn({ name: "campaign_id", referencedColumnName: "id" })
  campaign: Campaign[];
}
