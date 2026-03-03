import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("import_jobs")
export default class ImportJob {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column("varchar")
  name: string;

  @Column("varchar")
  mode: string;

  @Column("varchar")
  delim: string;

  @Column("json")
  lists: number[];

  @Column("int")
  total: number;

  @Column("boolean")
  overwrite: boolean;

  @Column("int")
  imported: number;

  @Column("varchar")
  status: string;

  @Column({ default: false })
  is_deleted: boolean;

  @Column("datetime")
  @CreateDateColumn()
  created_at: Date;

  @Column("datetime")
  @UpdateDateColumn()
  updated_at: Date;
}
