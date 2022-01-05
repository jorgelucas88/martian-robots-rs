import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from '../../utils/files.service';
import { RobotsFile } from '../interfaces/robotfile.interface';
import { MapSize, Position, RobotInstruction, RobotsMap } from '../interfaces/robotmap.interface';
import { RobotsService } from '../robots.service';
import { RobotsUtils } from '../robotsmap.utils';

describe('RobotsUtils', () => {
  
  beforeEach(async () => {
    // avoiding undesired console logging along showing jest results
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "info").mockImplementation();
  });

  describe('RobotsUtils', () => {
    it('getRobotMap', async () => {
      const mapSize: MapSize = { axisX: 2, axisY: 2 };
      const robotsMap: RobotsMap = {
        mapSize: mapSize,
        robotInstructions: [
          { 
            position: { x: 0, y: 0, orientation: "N", isLost: false },
            instructions: ["L"]
          } 
        ]
      };
      const robotsFile: RobotsFile = { lines: ["2 2\n", "0 0 N\n", "L"]};
      const robotsFileString: string = "2 2\n0 0 N\nL";
      const robotInstruction: RobotInstruction = {
          position: {
            x: 1,
            y: 2,
            orientation: "N",
            isLost: false
        },
          instructions: ["L", "R"]
      };

      jest.spyOn(RobotsUtils, "getRobotMapLines").mockImplementationOnce((fileContents: string): RobotsFile => { return robotsFile; });
      jest.spyOn(RobotsUtils, "getMapSize").mockImplementationOnce((fileLines: RobotsFile): MapSize => { return mapSize; });
      jest.spyOn(RobotsUtils, "getRobotInstructions").mockImplementationOnce((fileLines: RobotsFile): RobotInstruction[] => { return [robotInstruction]; });

      try {
        const utilsResult: any = RobotsUtils.getRobotMap(robotsFileString);
        expect(RobotsUtils.getRobotMapLines).toBeCalled();
        expect(RobotsUtils.getMapSize).toBeCalled();
        expect(RobotsUtils.getRobotInstructions).toBeCalled();
      } catch(e) {
        expect(e).toBeUndefined();
      }
    });

    it('getRobotMapLines', async () => {
      const robotsFileString: string = "2 2\n0 0 N\nL";
      
      try {
        const utilsResult: any = RobotsUtils.getRobotMapLines(robotsFileString);
        expect(utilsResult).toStrictEqual({ lines: ["2 2", "0 0 N", "L"]});
      } catch(e) {
        expect(e).toBeUndefined();
      }
    });

    
    it('getMapSize', async () => {
      const robotsFile: RobotsFile = { lines: ["2 2\n", "0 0 N\n", "L"]};
      
      try {
        const utilsResult: any = RobotsUtils.getMapSize(robotsFile);
        expect(utilsResult).toStrictEqual({ axisX: 2, axisY: 2});
      } catch(e) {
        expect(e).toBeUndefined();
      }
    });

    it('getRobotInstructions', async () => {
      const robotsFile: RobotsFile = { lines: ["2 2", "0 0 N", "FR"]};
      const splittedRobotInstructions: string[] = ["F", "R"];
      
      jest.spyOn(RobotsUtils, "getSingleRobotInstructions").mockImplementationOnce((fileLine: string): string[] => { return splittedRobotInstructions; });

      try {
        const utilsResult: RobotInstruction[] = RobotsUtils.getRobotInstructions(robotsFile);
        expect(utilsResult).toStrictEqual([{ position: { x: 0, y: 0, orientation: "N", isLost: false}, instructions: splittedRobotInstructions}]);
      } catch(e) {
        expect(e).toBeUndefined();
      }
    });

    it('getSingleRobotInstructions', async () => {
      const fileLine: string = "LFLF";
      
      try {
        const utilsResult: string[] = RobotsUtils.getSingleRobotInstructions(fileLine);
        expect(utilsResult).toStrictEqual(["L", "F", "L", "F"]);
      } catch(e) {
        expect(e).toBeUndefined();
      }
    });

    it('calculateFinalPosition', async () => {
      const position: Position = {
        x: 1,
        y: 2,
        orientation: "N",
        isLost: false
      };
      const instructions: string[] = ["L", "R"];
      const mapSize: MapSize = { axisX: 2, axisY: 2 };
      const scentedPositions: Position[] = [position];

      jest.spyOn(RobotsUtils, "calculateNextPosition").mockImplementationOnce((position: Position, instruction: string, mapSize: MapSize, scentedPositions: Position[]): Position => { return position; });
      
      try {
        const utilsResult: Position = RobotsUtils.calculateFinalPosition(position, instructions, mapSize, scentedPositions);
        expect(utilsResult).toStrictEqual(position);
      } catch(e) {
        expect(e).toBeUndefined();
      }
    });

    it('rotate N to L', async () => {
      const from: string = "N";
      const rotateTo: string = "L";
      const result: string = "W";
      try {
        const utilsResult: string = RobotsUtils.rotate(from, rotateTo);
        expect(utilsResult).toStrictEqual(result);
      } catch(e) {
        expect(e).toBeUndefined();
      }
    });

    it('rotate S to L', async () => {
      const from: string = "S";
      const rotateTo: string = "L";
      const result: string = "E";
      try {
        const utilsResult: string = RobotsUtils.rotate(from, rotateTo);
        expect(utilsResult).toStrictEqual(result);
      } catch(e) {
        expect(e).toBeUndefined();
      }
    });

    it('rotate S to R', async () => {
      const from: string = "S";
      const rotateTo: string = "R";
      const result: string = "W";
      try {
        const utilsResult: string = RobotsUtils.rotate(from, rotateTo);
        expect(utilsResult).toStrictEqual(result);
      } catch(e) {
        expect(e).toBeUndefined();
      }
    });

    it('rotate E to L', async () => {
      const from: string = "E";
      const rotateTo: string = "L";
      const result: string = "N";
      try {
        const utilsResult: string = RobotsUtils.rotate(from, rotateTo);
        expect(utilsResult).toStrictEqual(result);
      } catch(e) {
        expect(e).toBeUndefined();
      }
    });

    it('rotate E to R', async () => {
      const from: string = "E";
      const rotateTo: string = "R";
      const result: string = "S";
      try {
        const utilsResult: string = RobotsUtils.rotate(from, rotateTo);
        expect(utilsResult).toStrictEqual(result);
      } catch(e) {
        expect(e).toBeUndefined();
      }
    });

    it('rotate W to L', async () => {
      const from: string = "W";
      const rotateTo: string = "L";
      const result: string = "S";
      try {
        const utilsResult: string = RobotsUtils.rotate(from, rotateTo);
        expect(utilsResult).toStrictEqual(result);
      } catch(e) {
        expect(e).toBeUndefined();
      }
    });
    
    it('rotate W to R', async () => {
      const from: string = "W";
      const rotateTo: string = "R";
      const result: string = "N";
      try {
        const utilsResult: string = RobotsUtils.rotate(from, rotateTo);
        expect(utilsResult).toStrictEqual(result);
      } catch(e) {
        expect(e).toBeUndefined();
      }
    });

    it('rotate A to B', async () => {
      const from: string = "A";
      const rotateTo: string = "B";
      const result: string = "A";
      try {
        const utilsResult: string = RobotsUtils.rotate(from, rotateTo);
        expect(utilsResult).toStrictEqual(result);
      } catch(e) {
        expect(e).toBeUndefined();
      }
    });

    it('move forward N', async () => {
      const orientation: string = "N"
      const from: Position = { 
        x: 1,
        y: 1,
        orientation: orientation,
        isLost: false 
      };
      const result: Position = { 
        x: 1,
        y: 2,
        orientation: orientation,
        isLost: false 
      };
      try {
        const utilsResult: Position = RobotsUtils.moveForward(from);
        expect(utilsResult).toStrictEqual(result);
      } catch(e) {
        expect(e).toBeUndefined();
      }
    });

    it('move forward S', async () => {
      const orientation: string = "S"
      const from: Position = { 
        x: 1,
        y: 1,
        orientation: orientation,
        isLost: false 
      };
      const result: Position = { 
        x: 1,
        y: 0,
        orientation: orientation,
        isLost: false 
      };
      try {
        const utilsResult: Position = RobotsUtils.moveForward(from);
        expect(utilsResult).toStrictEqual(result);
      } catch(e) {
        expect(e).toBeUndefined();
      }
    });

    it('move forward W', async () => {
      const orientation: string = "W"
      const from: Position = { 
        x: 1,
        y: 1,
        orientation: orientation,
        isLost: false 
      };
      const result: Position = { 
        x: 0,
        y: 1,
        orientation: orientation,
        isLost: false 
      };
      try {
        const utilsResult: Position = RobotsUtils.moveForward(from);
        expect(utilsResult).toStrictEqual(result);
      } catch(e) {
        expect(e).toBeUndefined();
      }
    });

    it('move forward E', async () => {
      const orientation: string = "E"
      const from: Position = { 
        x: 1,
        y: 1,
        orientation: orientation,
        isLost: false 
      };
      const result: Position = { 
        x: 2,
        y: 1,
        orientation: orientation,
        isLost: false 
      };
      try {
        const utilsResult: Position = RobotsUtils.moveForward(from);
        expect(utilsResult).toStrictEqual(result);
      } catch(e) {
        expect(e).toBeUndefined();
      }
    });

    it('move forward unknown position', async () => {
      const orientation: string = "A"
      const from: Position = { 
        x: 1,
        y: 1,
        orientation: orientation,
        isLost: false 
      };
      const result: Position = { 
        x: 1,
        y: 1,
        orientation: orientation,
        isLost: false 
      };
      try {
        const utilsResult: Position = RobotsUtils.moveForward(from);
        expect(utilsResult).toStrictEqual(result);
      } catch(e) {
        expect(e).toBeUndefined();
      }
    });

    it('allCordinatesAreValid success', async () => {
      const mapSize: MapSize = { axisX: 2, axisY: 2 };
      const robotsMap: RobotsMap = {
        mapSize: mapSize,
        robotInstructions: [
          { 
            position: { x: 0, y: 0, orientation: "N", isLost: false },
            instructions: ["L"]
          } 
        ]
      };

      try {
        const utilsResult: boolean = RobotsUtils.allCordinatesAreValid(robotsMap);
        expect(utilsResult).toStrictEqual(true);
      } catch(e) {
        expect(e).toBeUndefined();
      }
    });

    it('allCordinatesAreValid failure - robot spawn outside map', async () => {
      const mapSize: MapSize = { axisX: 2, axisY: 2 };
      const robotsMap: RobotsMap = {
        mapSize: mapSize,
        robotInstructions: [
          { 
            position: { x: 4, y: 3, orientation: "N", isLost: false },
            instructions: ["L"]
          } 
        ]
      };

      try {
        const utilsResult: boolean = RobotsUtils.allCordinatesAreValid(robotsMap);
        expect(utilsResult).toStrictEqual(false);
      } catch(e) {
        expect(e).toBeUndefined();
      }
    });
    
    it('allInstructionsAreValid success', async () => {
      const mapSize: MapSize = { axisX: 2, axisY: 2 };
      const robotsMap: RobotsMap = {
        mapSize: mapSize,
        robotInstructions: [
          { 
            position: { x: 0, y: 0, orientation: "N", isLost: false },
            instructions: ["L"]
          } 
        ]
      };

      try {
        const utilsResult: boolean = RobotsUtils.allInstructionsAreValid(robotsMap);
        expect(utilsResult).toStrictEqual(true);
      } catch(e) {
        expect(e).toBeUndefined();
      }
    });

    it('allInstructionsAreValid failure - invalid instruction', async () => {
      const mapSize: MapSize = { axisX: 2, axisY: 2 };
      const robotsMap: RobotsMap = {
        mapSize: mapSize,
        robotInstructions: [
          { 
            position: { x: 0, y: 0, orientation: "N", isLost: false },
            instructions: ["LA"]
          } 
        ]
      };

      try {
        const utilsResult: boolean = RobotsUtils.allInstructionsAreValid(robotsMap);
        expect(utilsResult).toStrictEqual(false);
      } catch(e) {
        expect(e).toBeUndefined();
      }
    });

    it('allInstructionsAreValid failure - invalid instruction', async () => {
      const mapSize: MapSize = { axisX: 2, axisY: 2 };
      const robotsMap: RobotsMap = {
        mapSize: mapSize,
        robotInstructions: [
          { 
            position: { x: 0, y: 0, orientation: "N", isLost: false },
            instructions: ["LA"]
          } 
        ]
      };

      try {
        const utilsResult: boolean = RobotsUtils.allInstructionsAreValid(robotsMap);
        expect(utilsResult).toStrictEqual(false);
      } catch(e) {
        expect(e).toBeUndefined();
      }
    });

    it('calculateNextPosition 1 2 N to F to a scented position', async () => {
      const position: Position = {
        x: 1,
        y: 2,
        orientation: "N",
        isLost: false
      };
      const instruction: string = "F";
      const scentedPositions: Position[] = [position];
      const mapSize: MapSize = { axisX: 2, axisY: 2 };

      const finalPosition: Position = {
        x: 1,
        y: 2,
        orientation: "N",
        isLost: false
      };
      try {
        const utilsResult: Position = RobotsUtils.calculateNextPosition(position, instruction, mapSize, scentedPositions);
        expect(utilsResult).toStrictEqual(finalPosition);
      } catch(e) {
        expect(e).toBeUndefined();
      }
    });

    it('calculateNextPosition 0 0 S to F (out of bounds negative unscented position)', async () => {
      const position: Position = {
        x: 0,
        y: 0,
        orientation: "S",
        isLost: false
      };
      const instruction: string = "F";
      const scentedPositions: Position[] = [];
      const mapSize: MapSize = { axisX: 2, axisY: 2 };

      const finalPosition: Position = {
        x: 0,
        y: 0,
        orientation: "S",
        isLost: true
      };
      try {
        const utilsResult: Position = RobotsUtils.calculateNextPosition(position, instruction, mapSize, scentedPositions);
        expect(utilsResult).toStrictEqual(finalPosition);
      } catch(e) {
        expect(e).toBeUndefined();
      }
    });

    it('calculateNextPosition 0 0 S to N', async () => {
      const position: Position = {
        x: 0,
        y: 0,
        orientation: "N",
        isLost: false
      };
      const instruction: string = "F";
      const scentedPositions: Position[] = [];
      const mapSize: MapSize = { axisX: 2, axisY: 2 };

      const finalPosition: Position = {
        x: 0,
        y: 1,
        orientation: "N",
        isLost: false
      };
      try {
        const utilsResult: Position = RobotsUtils.calculateNextPosition(position, instruction, mapSize, scentedPositions);
        expect(utilsResult).toStrictEqual(finalPosition);
      } catch(e) {
        expect(e).toBeUndefined();
      }
    });

  });
});
