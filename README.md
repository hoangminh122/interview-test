## Requirements

- Docker
- Docker Compose

## Setup

1. Clone this repository to your local machine:

   - git clone git@github.com:hoangminh122/interview-test.git
   - cd interview-test

2. Check file .env existed
3. start docker
   docker compose up -d
4. Testing
   - Ensure Docker and Docker Compose are installed and running before starting the containers.
   - You can access the app on http://localhost:4000 after running the containers.
   - Swagger UI can be used for testing and API exploration.

- view swagger: http://localhost:4000/api/swagger

4: if dev run code at local doing on run:

- please delete or command
  synchronize: true,
  dropSchema: true
  from \src\utils\configs\typeorm.config.ts
- npm run start:dev

5. Data for testing:

- userIdLoginFake: "e8bd526b-2a6b-4ac0-b9f5-c1a854e47162"

- body: {
  "value": 12,
  "date": "2024-12-18T22:55:38.374Z",
  "unit": "K",
  "userId": "e8bd526b-2a6b-4ac0-b9f5-c1a854e47162"
  }
