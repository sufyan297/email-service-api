import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Generated,
} from "typeorm";
import Template from "./Template";
import CampaignList from "./CampaignList";
import { CampaignContentType, CampaignStatus, CampaignType } from "../types/constants";
import SMTPConfig from "./SMTPConfig";

@Entity("campaigns")
export default class Campaign {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Generated("uuid")
  @Column("char", { length: 36, unique: true })
  uuid: string;

  @Column("varchar")
  name: string;

  @Column("varchar")
  subject: string;

  @Column("varchar")
  from_email: string;

  @Column("text")
  body: string;

  @Column("text", { nullable: true })
  body_source?: string;

  @Column("text", { nullable: true })
  altbody?: string;

  @Column("enum", { enum: CampaignContentType })
  content_type: CampaignContentType;

  @Column("enum", { enum: CampaignType })
  type: CampaignType;

  @Column("enum", { enum: CampaignStatus })
  status: CampaignStatus;

  @Column("datetime", { nullable: true })
  send_at?: Date;

  @Column("datetime", { nullable: true })
  started_at?: Date;

  @Column("json")
  headers: Record<string, string>[];

  @Column("json")
  attribs: Record<string, unknown>;

  @Column("json", { nullable: true })
  tags: string[];

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  clicks: number;

  @Column({ default: 0 })
  bounces: number;

  @Column({ default: 0 })
  to_send: number;

  @Column({ default: 0 })
  sent: number;

  @Column({ default: 0 })
  max_subscriber_id: number;

  @Column({ default: 0 })
  last_subscriber_id: number;

  @Column({ default: false })
  archive: boolean;

  @Column("text", { nullable: true })
  archive_slug?: string;

  @Column("json")
  archive_meta: Record<string, unknown>;

  @Column("text", { nullable: true })
  traversal_attribute?: string;

  @Column({ nullable: true })
  template_id: number;

  @Column()
  smtp_config_id: number;

  @Column({ nullable: true })
  archive_template_id?: number;

  @Column({ default: false })
  is_deleted: boolean;

  @Column("datetime")
  @CreateDateColumn()
  created_at: Date;

  @Column("datetime")
  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Template)
  @JoinColumn({ name: "template_id", referencedColumnName: "id" })
  template?: Template;

  @ManyToOne(() => Template)
  @JoinColumn({ name: "archive_template_id", referencedColumnName: "id" })
  archiveTemplate?: Template;

  @ManyToOne(() => SMTPConfig)
  @JoinColumn({ name: "smtp_config_id", referencedColumnName: "id" })
  smtpConfig: SMTPConfig;

  @OneToMany(() => CampaignList, (campaignList) => campaignList.campaign)
  campaignLists: CampaignList[];
}
