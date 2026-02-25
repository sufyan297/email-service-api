import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import Template from "./Template";
import SMTP from "./SMTP";
import CampaignList from "./CampaignList";
import DeliveryLog from "./DeliveryLog";
import MailQueue from "./MailQueue";

@Entity("campaigns")
export default class Campaign {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar")
  name?: string;

  @Column("varchar")
  subject?: string;

  @Column("text")
  body?: string;

  @Column("datetime")
  send_at?: Date;

  @Column("varchar")
  status: string;

  @Column("char")
  template_id: string;

  @Column("char")
  smtp_id: string;

  @Column()
  is_active: boolean;

  @Column()
  is_deleted: boolean;

  @Column("char")
  traversal_attribute: string;

  @Column("datetime")
  @CreateDateColumn()
  created_at: Date;

  @Column("datetime")
  @UpdateDateColumn()
  updated_at: Date;

  @Column("datetime")
  deleted_at: Date;

  @ManyToOne(() => Template)
  @JoinColumn({ name: "template_id", referencedColumnName: "id" })
  template?: Template;

  @ManyToOne(() => SMTP)
  @JoinColumn({ name: "smtp_id", referencedColumnName: "id" })
  smtp?: SMTP;

  @OneToMany(() => CampaignList, (campaignList) => campaignList.campaign)
  campaignLists: CampaignList[];

  @OneToMany(() => DeliveryLog, (deliveryLog) => deliveryLog.campaign)
  deliveryLogs: DeliveryLog[];

  @OneToMany(() => MailQueue, (mailQueue) => mailQueue.campaign)
  mailQueues: MailQueue[];
}
