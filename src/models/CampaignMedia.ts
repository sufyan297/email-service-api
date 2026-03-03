import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";

@Entity("campaign_media")
@Index(["campaign_id", "media_id"], { unique: true })
export default class CampaignMedia {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  campaign_id: number;

  @Column({ nullable: true })
  media_id?: number;

  @Column("text")
  filename: string;

  @Column({ default: false })
  is_deleted: boolean;

  @Column("datetime")
  @CreateDateColumn()
  created_at: Date;

  @Column("datetime")
  @UpdateDateColumn()
  updated_at: Date;
}
