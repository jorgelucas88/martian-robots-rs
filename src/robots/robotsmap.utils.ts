import { MAX_COORDINATE_VALUE, MAX_INSTRUCTIONS_STRING_LENGTH, VALID_INSTRUCTIONS,  } from '../constants';
import { RobotsMap, MapSize, RobotInstruction, Position } from './interfaces/robotmap.interface';
import { RobotsFile, LINE_BREAK, POSITION_SEPARATOR, MAP_SIZE_POSITION } from './interfaces/robotfile.interface';

export class RobotsUtils {
    public static getRobotMap(fileContents: string): RobotsMap {
        const robotsFile: RobotsFile = RobotsUtils.getRobotMapLines(fileContents);
        const mapSize: MapSize = RobotsUtils.getMapSize(robotsFile);
        const robotInstructions: RobotInstruction[] = RobotsUtils.getRobotInstructions(robotsFile);       
        return { mapSize: mapSize, robotInstructions: robotInstructions, exploredSurface: 0, lostRobots: 0 };
    }
    public static getRobotMapLines(fileContents: string): RobotsFile {
        const lines: string[] = fileContents.split(LINE_BREAK);
        return { lines: lines };
    }
    public static getMapSize(robotsFile: RobotsFile): MapSize {
        const mapSizeRaw: string = robotsFile.lines[MAP_SIZE_POSITION];
        const mapSizeSplit: number[] = mapSizeRaw.split(POSITION_SEPARATOR).map(m => parseInt(m));
        return { axisX: mapSizeSplit[0], axisY: mapSizeSplit[1] };
    }
    public static getRobotInstructions(robotsFile: RobotsFile): RobotInstruction[] {
        const robotsInstructions: RobotInstruction[] = [];
        let i: number = 0, j: number = 0;
        let position: Position = null;
        let instructions: string[] = null;
        robotsFile.lines.forEach(l => {
            if (i != 0) { // skipping 1st line
                if (position == null) {
                    position = RobotsUtils.getPosition(l);
                } else if (instructions == null) {
                    instructions = RobotsUtils.getSingleRobotInstructions(l);
                } 
                if (position && instructions) {
                    robotsInstructions.push({ position: position, instructions: instructions });
                    position = null;
                    instructions = null;
                }
            }
            i ++;
        });
        return robotsInstructions;
    }
    public static getPosition(fileLine: string): Position {
        const positionRaw: string[] = fileLine.split(POSITION_SEPARATOR);
        return { x: parseInt(positionRaw[0]), y: parseInt(positionRaw[1]), orientation: positionRaw[2], isLost: false, exploredSurface: 0 };
    }
    public static getSingleRobotInstructions(fileLine: string): string[] {
        return fileLine.split('');
    }
    public static calculateFinalPosition(initialPosition: Position, instructions: string[], mapSize: MapSize, scentedPositions: Position[]): Position {
        let finalPosition: Position = initialPosition;
        let auxExploredSurfacePosition: Position = initialPosition;
        instructions.forEach(i => {
            if (!finalPosition.isLost) {
                finalPosition = RobotsUtils.calculateNextPosition(finalPosition, i, mapSize, scentedPositions);
                if (finalPosition.x != auxExploredSurfacePosition.x || finalPosition.y != auxExploredSurfacePosition.y) {
                    finalPosition.exploredSurface = finalPosition.exploredSurface ? finalPosition.exploredSurface++ : 1;
                }
                auxExploredSurfacePosition = finalPosition;
            }
        });
        return finalPosition;
    }
    public static calculateNextPosition(position: Position, instruction: string, mapSize: MapSize, scentedPositions: Position[]): Position {
        switch (instruction) {
            case "R":
            case "L":
                position.orientation = RobotsUtils.rotate(position.orientation, instruction);
                break;
            case "F":
                const newPosition: Position = RobotsUtils.moveForward(position);
                if (newPosition.x > mapSize.axisX || newPosition.y > mapSize.axisY || newPosition.x < 0 || newPosition.y < 0) {
                    const isPositionScented: boolean = scentedPositions.find(f => f.x == position.x && f.y == position.y) != undefined;
                    position.isLost = !isPositionScented;
                } else {
                    position = newPosition;
                }
                break;
        }
        return position;
    }
    public static rotate(orientation: string, rotateTo: string): string {
        switch (orientation) {
            case "N":
                orientation = rotateTo == "L" ? "W" : "E";
                break;
            case "S":
                orientation = rotateTo == "L" ? "E" : "W";
                break;
            case "E":
                orientation = rotateTo == "L" ? "N" : "S";
                break;
            case "W":
                orientation = rotateTo == "L" ? "S" : "N";
                break;
            default:
                break;
        }
        return orientation;
    }
    public static moveForward(position: Position): Position {
        const newPosition: Position = Object.assign({}, position); // cloning original position in order to not change it
        switch (newPosition.orientation) {
            case "N":
                newPosition.y++;    
                break;
            case "S":
                newPosition.y--;
                break;
            case "E":
                newPosition.x++;
                break;
            case "W":
                newPosition.x--;
                break;
            default:
                break;
        }
        return newPosition;
    }
    public static allCordinatesAreValid(robotsMap: RobotsMap): boolean {
        let validCoordinates = true;

        robotsMap.robotInstructions.forEach(i => {
            validCoordinates = i.position.x <= robotsMap.mapSize.axisX && i.position.y <= robotsMap.mapSize.axisY;
        });
        
        return robotsMap.mapSize.axisX >= -1 && robotsMap.mapSize.axisX <= MAX_COORDINATE_VALUE && robotsMap.mapSize.axisY >= -1 && robotsMap.mapSize.axisY <= MAX_COORDINATE_VALUE && validCoordinates;
    }

    public static allInstructionsAreValid(robotsMap: RobotsMap): boolean {
        let validInstructions = true;

        robotsMap.robotInstructions.forEach(ri => {
            ri.instructions.forEach(i => {
                validInstructions = VALID_INSTRUCTIONS.includes(i);
            });
            validInstructions = validInstructions && ri.instructions.length <= 50;
        });

        return validInstructions;
    }
    
}