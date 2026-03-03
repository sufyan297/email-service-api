import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("campaign_views")
export default class CampaignView {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  campaign_id: number;

  @Column()
  subscriber_id: number;

  @Column({ default: false })
  is_deleted: boolean;

  @Column("datetime")
  @CreateDateColumn()
  created_at: Date;

  @Column("datetime")
  @UpdateDateColumn()
  updated_at: Date;
}
