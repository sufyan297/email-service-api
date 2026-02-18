import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import Template from "./Template";
import SMTP from "./SMTP";

@Entity("campaigns")
export default class Campaign {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar" })
  name?: string;

  @Column({ type: "varchar" })
  subject?: string;

  @Column({ type: "text" })
  body?: string;

  @Column({ type: "datetime" })
  send_at?: Date;

  @Column({ type: "varchar" })
  status: string;

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

  @ManyToOne(() => Template)
  @JoinColumn({ name: "template_id", referencedColumnName: "id" })
  template?: Template;

  @ManyToOne(() => SMTP)
  @JoinColumn({ name: "smtp_id", referencedColumnName: "id" })
  smtp?: SMTP;
}
