import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
} from "typeorm";

@Entity("media")
export default class Media {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Generated("uuid")
  @Column("char", { length: 36, unique: true })
  uuid: string;

  @Column("text")
  filename: string;

  @Column("text")
  thumb: string;

  @Column("text")
  content_type: string;

  @Column("text")
  provider: string;

  @Column("json")
  meta: Record<string, unknown>;

  @Column({ default: false })
  is_deleted: boolean;

  @Column("datetime")
  @CreateDateColumn()
  created_at: Date;

  @Column("datetime")
  @UpdateDateColumn()
  updated_at: Date;
}
