# Lost and Found Anonymous Service

## Team Members
* Alexander N. Kessaris
* Joshua Seol
* Muhamed M. Rahman (Nayeem Rahman)
* Wei Jie Chua

## Project Proposal
Users will register for our service. They will register items they own and care about and our application will create unique codes for them in the form of printable QR codes, which they will stick on their items (e.g. cell phone). Once an item is lost and recovered, its QR code can be scanned and our application will be notified of the event and the recovering party. Our application will act as the trusted third party and coordinate the return of the item. We did not implement the real-life process of returning the item to its owner, just the processing of such events.

## Running the project locally:

1. Using the command line, clone the repo into the directory of your choise
  * $ git clone https://github.com/akessaris/lost-and-found.git
2. Install the required modules once in the cloned directory
  * $ npm install
  * If you do not have node installed:
    * If you have homebrew: $ brew install node
    * Otherwise, go to the website for installation
3. Install MongoDB
  * If you have homebrew, run the following: $ brew install mongodb
  * Otherwise, just download the [appropriate installer from their downloads page](http://www.mongodb.org/downloads?_ga=1.39460320.233151851.1414030989)
4. Run MongoDB (within the project folder in the commandline):
  * Run (within project folder): $ mongod
  * Open a new commandline tab and run: $ mongo
5. Run the application
  * Make sure that you have mongod and mongo running in separate windows in the command line
  * In a sep command line tab (still within the project folder), run: $ npm start
  * If there are any errors, make sure you've installed all the proper packages using: $ npm install

## Project Roles

* Alex - Server/Database
  * Handled app configuration, url routing, backend logic
  * Implement server setup and data models using Mongo
  * Setup production instance using Heroku

* Josh - QR Code Generation/Database
  * Implement QR Code Generation
  * Work on server deployment
  * Work on database implementation and indexing

* Nayeem - Authentication
  * Authentication done using [Passport](http://www.passportjs.org)
  * Automatically salts and hashes passwords

* Wei - Front End
  * All html files are in [views](views) directory
  * Integrate front end frameworks (like Bootstrap) for additional markup/design
