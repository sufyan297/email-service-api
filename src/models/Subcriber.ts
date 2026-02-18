import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "subscribers" })
export default class Subscriber {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar")
  email: string;

  @Column("varchar")
  name: string;

  @Column({ type: "json" })
  attributes?: Record<string, any>;

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
