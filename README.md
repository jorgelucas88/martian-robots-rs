# MRRC 1.0
Welcome to the Martian Robots Route Calculation 1.0

## Description
This microservice calculates routes of martian robots on the surface of mars.
The robots move along a squared map, rotating and moving vertically or horizontally.
The lower-left coordinates are the 0, 0 position, and the top-right position is the last available square. The squares starts from 0 to max-size (x and y);
Given an input file, if a robot crosses some of the map bounderies, it gets lost. After that, if a robot tries to cross the same boundary, the previous one leaves a "scent", preventing the next one to loses itself crossing the same point.

## Node version
Node v14

## Usage
This microservice can be run in two ways:
1. APIs: 
- POST /processRobotsMap uploading the robots map file
2. Command line:
- npm run robots-cli-file test/files/test1_input.txt

## File samples
File samples can be found here: <link>

Example of file:
5 3
1 1 E
RFRFRFRF
3 2 N
FRRFLLFFRRFLL
0 3 W
LLFFFRFLFL

Example of output:
1 1 E
3 3 N LOST
4 2 N


## Running the microservice:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

