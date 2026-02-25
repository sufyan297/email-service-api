import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import Campaign from "./Campaign";
import Subscriber from "./Subscriber";

@Entity("mail_queue")
export default class MailQueue {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("json")
  payload?: Record<string, any>;

  @Column("varchar")
  status: string;

  @Column("int")
  tries: number;

  @Column("char")
  campaign_id: string;

  @Column("char")
  subscriber_id: string;

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

  @ManyToOne(() => Campaign, { lazy: true })
  @JoinColumn({ name: "campaign_id", referencedColumnName: "id" })
  campaign: Promise<Campaign>;

  @ManyToOne(() => Subscriber, { lazy: true })
  @JoinColumn({ name: "subscriber_id", referencedColumnName: "id" })
  subscriber?: Promise<Subscriber>;
}
