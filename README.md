# This is a Express.js backed for a Comic Reading App

Currently this application only allow one admin account

`This app runs on port 8000 by default. you can change that by changing the PORT variable in .env file`

This app uses prisma which you can change according to your needs in src/prisma/schema.prisma file

This app uses MySQL as database and Multer package to handle multipart/formdata

##### Please Check .env.example file and set the enviornment variables to start the app

# Project Set up

1. Clone the project into your local meachine

2. Run `npm install` This command will install necessary dependencies to your local meachine

`Note: If you encounter running any previous comman you need install node to your system`

3. Set up the mysql server

4. Set up the enviornment variables

5. Generate prisma client by running `prisma generate` in your Command line tool

6. Migrate the schema to db using `npx prisma migrate dev --name init`

7. Start the server by running `npm run dev`
