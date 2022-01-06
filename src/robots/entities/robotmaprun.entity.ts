import { DataTypes } from 'sequelize/dist';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ orderBy: { id: "DESC" }})
export class RobotMapRun {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    date: Date;

    @Column()
    input: string;

    @Column()
    output: string;

    @Column()
    exploredSurface: number;

    @Column()
    lostRobots: number;

}