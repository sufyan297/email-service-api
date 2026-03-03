import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("import_logs")
export default class ImportLog {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  import_job_id: number;

  @Column("text")
  message: string;

  @Column({ default: false })
  is_deleted: boolean;

  @Column("datetime")
  @CreateDateColumn()
  created_at: Date;

  @Column("datetime")
  @UpdateDateColumn()
  updated_at: Date;
}
