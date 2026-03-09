import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import Campaign from "./Campaign";

@Entity("links")
export default class Link {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Generated("uuid")
  @Column("char", { length: 36, unique: true })
  uuid: string;

  @Column()
  campaign_id: number;

  @Column("text")
  url: string;

  @Column({ default: false })
  is_deleted: boolean;

  @Column("datetime")
  @CreateDateColumn()
  created_at: Date;

  @Column("datetime")
  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Campaign, { lazy: true })
  @JoinColumn({ name: "campaign_id", referencedColumnName: "id" })
  campaign: Promise<Campaign>;
}
