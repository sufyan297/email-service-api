import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
} from "typeorm";
import { TemplateType } from "../types/constants";

@Entity("templates")
export default class Template {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Generated("uuid")
  @Column("char", { length: 36, unique: true })
  uuid: string;

  @Column("varchar")
  name: string;

  @Column("enum", { enum: TemplateType })
  type: TemplateType;

  @Column("varchar", { nullable: true })
  subject?: string;

  @Column("text")
  body: string;

  @Column("text", { nullable: true })
  body_source?: string;

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
}
