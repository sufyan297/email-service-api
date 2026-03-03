import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("settings")
export default class Setting {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column("text")
  key: string;

  @Column("json")
  value: Record<string, unknown> | string | number | boolean | null;

  @Column({ default: false })
  is_deleted: boolean;

  @Column("datetime")
  @CreateDateColumn()
  created_at: Date;

  @Column("datetime")
  @UpdateDateColumn()
  updated_at: Date;
}
