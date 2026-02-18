import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("smtps")
export default class SMTP {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar" })
  host: string;

  @Column({ type: "int" })
  port: number;

  @Column({ type: "varchar" })
  username: string;

  @Column({ type: "varchar" })
  password: string;

  @Column({ type: "varchar" })
  encryption: string;

  @Column({ type: "varchar" })
  from_email: string;

  @Column({ type: "varchar" })
  from_name?: string;

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
}
