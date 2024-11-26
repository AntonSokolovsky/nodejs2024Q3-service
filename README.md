# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone https://github.com/AntonSokolovsky/nodejs2024Q3-service.git
```

## Installing NPM modules

```
git checkout feat/logging_and_authentication
```

```
npm install
```

## Running application

create an .env file based on .env.example specifying the port

```
docker-compose up
```

## Testing

After application running open new terminal and enter:

To run all tests with authorization

```
npm run test:auth
```

To run the test of refresh token

```
npm run test:refresh
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
