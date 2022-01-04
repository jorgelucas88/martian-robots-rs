export interface RobotsMap {
    mapSize: MapSize;
    robotInstructions: RobotInstruction[];
}

export interface MapSize {
    axisX: number;
    axisY: number;
}

export interface RobotInstruction {
    position: Position;
    instructions: string[];
}

export interface Position {
    x: number;
    y: number;
    orientation: string;
}
