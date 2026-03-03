import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { BounceType } from "../types/constants";
import Subscriber from "./Subscriber";
import Campaign from "./Campaign";

@Entity("bounces")
export default class Bounce {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column("enum", { enum: BounceType })
  type: BounceType;

  @Column("text")
  source: string;

  @Column("json")
  meta: Record<string, unknown>;

  @Column("varchar")
  email: string;

  @Column()
  subscriber_id: number;

  @Column({ nullable: true })
  campaign_id?: number;

  @Column()
  message_id: number;

  @Column({ default: false })
  is_deleted: boolean;

  @Column("datetime")
  @CreateDateColumn()
  created_at: Date;

  @Column("datetime")
  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Subscriber, { lazy: true })
  @JoinColumn({ name: "subscriber_id", referencedColumnName: "id" })
  subscriber: Promise<Subscriber>;

  @ManyToOne(() => Campaign, { lazy: true })
  @JoinColumn({ name: "campaign_id", referencedColumnName: "id" })
  campaign: Promise<Campaign>;
}
