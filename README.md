# Kanban Pizza Game: ENGR302 (Engineering Project Management 2) Project
## Overview
This project is a Kanban pizza game, where the user can prepare pizzas. Each pizza is represented as a ticket which can be dragged across the Kanban board. The game has several stations: Orders, Preparation, Cooking and Cutting, Reviewing and Service (Service has not been implemented). This project was made for ENGR302 (Engineering Project Management 2), a third-year course at Victoria University of Wellington in 2024. We worked on this project in a group of 6 people. The game was implemented using HTML, JavaScript and Phaser (a framework for making games.)
## Run Instructions
It is recommended to run the code using Visual Studio code. The below instructions assume you are using Visual Studio Code, NPM (Node Packet Manager) and Windows 11. If you do not have Visual Studio Code and NPM, you will need to install these. You might be able to run the project using alternative tools.
- Type `git clone https://github.com/patrick920/Kanban-Pizza-Game-ENGR302.git` to clone the repository on the command line. This command will create a folder.
- Open the folder with Visual Studio Code. You can do this by right clicking on the folder and selecting `Show more options`, then select `Open with code`. This should open the files in Visual Studio Code.
- At the top of Visual Studio Code, select `Terminal` then `New Terminal`, which should open a terminal window in Visual Studio Code.
- In the terminal window which is opened, type `cd server` to change to the folder where the website can be run.
- Type `npm i` to set up the project. This will not work if NPM is not installed (you will need to install it.)
- Type `npm run dev` to start the development server. This will not open a browser tab as it is only the server.
- To run the client program, you need to install the `Live Server` extension by `Ritwick Dey` on Visual Studio code. Go to the left panel and click on the `server` folder to open it, then click to open the `public` folder. Then right click on `index.html` and select `Open with Live Server`. This will open a browser tab containing the Kanban Pizza Game which you can now use! Note that if the development server (started with `npm run dev`) is not running, or the `Live Server` server is not running, the Kanban pizza game website may not work.

## Improvements
- While we had time to implement the singleplayer functionality, we ran out of time to implement the main multiplayer functionality for the game.
- We successfully implemented stations, but they could have been more detailed. We did not have time to implement the "Service" station.
