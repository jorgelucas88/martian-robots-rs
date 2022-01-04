export interface RobotsFile {
    lines: string[];
}
export const LINE_BREAK: any = /\r\n|\r|\n/; // handles CR, LF, and CRLF line endings, their mixed sequences, and keeps all the empty lines inbetween https://stackoverflow.com/questions/21895233/how-to-split-string-with-newline-n-in-node
export const POSITION_SEPARATOR: string = " "; // ex: 5 3 // ex: 1 1 E
export const MAP_SIZE_POSITION: number = 0;

