export interface RobotsMap {
    mapSize: MapSize;
    robotInstructions: RobotInstruction[];
    lostRobots: number;
    exploredSurface: number;
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
    isLost: boolean;
    exploredSurface: number;
}
