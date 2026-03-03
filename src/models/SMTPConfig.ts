import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  OneToMany,
} from "typeorm";
import { SMTPConfigAuthProtocol, SMTPConfigTlsType } from "../types/constants";
import Campaign from "./Campaign";

@Entity("smtp_configs")
export default class SMTPConfig {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Generated("uuid")
  @Column("char", { length: 36, unique: true })
  uuid: string;

  @Column({ default: true })
  enabled: boolean;

  @Column("text", { nullable: true })
  name?: string;

  @Column("text")
  host: string;

  @Column("int")
  port: number;

  @Column("text", { nullable: true })
  hello_hostname?: string;

  @Column("enum", { enum: SMTPConfigAuthProtocol })
  auth_protocol: SMTPConfigAuthProtocol;

  @Column("text")
  username: string;

  @Column("text")
  password: string;

  @Column("json", { nullable: true })
  email_headers?: Record<string, string>[];

  @Column("int")
  max_conns: number;

  @Column("int")
  max_msg_retries: number;

  @Column("text")
  idle_timeout: string;

  @Column("text")
  wait_timeout: string;

  @Column("enum", { enum: SMTPConfigTlsType })
  tls_type: SMTPConfigTlsType;

  @Column({ default: false })
  tls_skip_verify: boolean;

  @Column({ default: false })
  is_default: boolean;

  @Column({ default: false })
  is_deleted: boolean;

  @Column("datetime")
  @CreateDateColumn()
  created_at: Date;

  @Column("datetime")
  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Campaign, (campaign) => campaign.smtpConfig)
  campaigns: Campaign[];
}
