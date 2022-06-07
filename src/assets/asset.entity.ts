import { User } from 'src/users/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Asset extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: 'NFT' })
  type: string;

  @Column({default: 10})
  price: number;

  @Column()
  description: string;

  @Column()
  imageName: string;

  @Column()
  imagePath: string;

  @Column()
  imagePublicId: string;

  @Column()
  imageMimeType: string;

  @ManyToOne(() => User, {
    eager: true,
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  user: User;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
