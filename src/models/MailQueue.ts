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
import Subscriber from "./Subcriber";

@Entity("mail_queue")
export default class MailQueue {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "json" })
  payload?: Record<string, any>;

  @Column({ type: "varchar" })
  status: string;

  @Column({ type: "int" })
  tries: number;

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

  @ManyToOne(() => Campaign)
  @JoinColumn({ name: "campaign_id", referencedColumnName: "id" })
  campaign: Campaign;

  @ManyToOne(() => Subscriber)
  @JoinColumn({ name: "subscriber_id", referencedColumnName: "id" })
  subscriber?: Subscriber;
}
