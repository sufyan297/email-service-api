import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import Campaign from "./Campaign";
import Subscriber from "./Subcriber";

@Entity("delivery_logs")
export default class DeliveryLog {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar" })
  event_type: string;

  @Column({ type: "datetime" })
  event_time: Date;

  @Column({ type: "json" })
  data?: Record<string, any>;

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
  subscriber: Subscriber;
}
