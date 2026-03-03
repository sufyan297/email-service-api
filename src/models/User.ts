import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { TwoFAType, UserStatus, UserType } from "../types/constants";

@Entity("users")
export default class User {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column("text")
  username: string;

  @Column({ default: true })
  password_login: boolean;

  @Column("text")
  password: string;

  @Column("text")
  email: string;

  @Column("text")
  name: string;

  @Column("text", { nullable: true })
  avatar?: string;

  @Column("enum", { enum: UserType, default: UserType.user })
  type: UserType;

  @Column("enum", { enum: UserStatus, default: UserStatus.disabled })
  status: UserStatus;

  @Column("enum", { enum: TwoFAType, default: TwoFAType.none })
  twofa_type: TwoFAType;

  @Column("text", { nullable: true })
  twofa_key?: string;

  @Column("datetime", { nullable: true })
  loggedin_at?: Date;

  @Column({ default: false })
  is_deleted: boolean;

  @Column("datetime")
  @CreateDateColumn()
  created_at: Date;

  @Column("datetime")
  @UpdateDateColumn()
  updated_at: Date;
}
