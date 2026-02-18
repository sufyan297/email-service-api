import { AfterLoad, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'admins' })
export default class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  username: string

  @Column('varchar')
  password: string

  @Column('varchar')
  first_name: string

  @Column('varchar')
  last_name: string

  @Column('varchar')
  mobile: string

  @Column()
  is_active: boolean

  @Column()
  is_deleted: boolean

  @Column('datetime')
  @CreateDateColumn()
  created_at: Date

  @Column('datetime')
  @UpdateDateColumn()
  updated_at: Date

  @Column('datetime')
  deleted_at: Date

}