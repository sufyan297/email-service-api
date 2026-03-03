import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("link_clicks")
export default class LinkClick {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  link_id: number;

  @Column({ nullable: true })
  campaign_id?: number;

  @Column({ nullable: true })
  subscriber_id?: number;

  @Column({ default: false })
  is_deleted: boolean;

  @Column("datetime")
  @CreateDateColumn()
  created_at: Date;

  @Column("datetime")
  @UpdateDateColumn()
  updated_at: Date;
}
