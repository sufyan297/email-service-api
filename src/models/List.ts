import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "lists" })
export default class List {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar")
  name: string;

  @Column("varchar")
  optin_mode: string;

  @Column()
  is_private: boolean;

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
