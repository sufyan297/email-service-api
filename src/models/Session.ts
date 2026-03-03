import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("sessions")
export default class Session {
  @PrimaryColumn("varchar", { length: 255 })
  id: string;

  @Column("json")
  data: Record<string, unknown>;

  @Column({ default: false })
  is_deleted: boolean;

  @Column("datetime")
  @CreateDateColumn()
  created_at: Date;

  @Column("datetime")
  @UpdateDateColumn()
  updated_at: Date;
}
