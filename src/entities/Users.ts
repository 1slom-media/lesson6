import { IsString} from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column,CreateDateColumn,UpdateDateColumn} from "typeorm";

@Entity({ name: "users" })
export class UsersEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar", length: 100 })
    @IsString()
    username: string

    @Column({ type: "varchar", length: 100 })
    @IsString()
    email: string

    @Column({ type: "varchar" })
    password: string;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updateAt: Date;
}