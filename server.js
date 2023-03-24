const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const app = express();

const db = require("./app/models");
const Role = db.role;
const User = db.user;

var corsOptions = {
    origin: "http://localhost:4200" //cors para frontend
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
    cookieSession({
        name: "bezkoder-session",
        secret: "COOKIE_SECRET", // should use as secret environment variable
        httpOnly: true
    })
);


db.sequelize.sync()
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });

// drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//     console.log('Drop and Resync Db');
//     initial();
// });

function initial() { //create 3 rows in db
    Role.create({
        id: 1,
        name: "user"
    });

    Role.create({
        id: 2,
        name: "moderator"
    });

    Role.create({
        id: 3,
        name: "admin"
    });

    User.create({
        id: 1,
        username: "admin",
        email: "admin@admin.com",
        password: "$2y$10$5CGKRFgnzih.ef5zg8Z85.cU2Q4FR.91kWKINnKpe24uQW4hiQWlS", //password
        role: "admin",
    });

    User.create({
        id: 2,
        username: "moderator",
        email: "moderator@moderator.com",
        password: "$2y$10$5CGKRFgnzih.ef5zg8Z85.cU2Q4FR.91kWKINnKpe24uQW4hiQWlS", //password
        role: "moderator",
    });

    User.create({
        id: 3,
        username: "guest",
        email: "guest@guest.com",
        password: "$2y$10$5CGKRFgnzih.ef5zg8Z85.cU2Q4FR.91kWKINnKpe24uQW4hiQWlS", //password
        role: "user",
    });
}

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to bezkoder application." });
});
//routes
require("./app/routes/turorial.routes")(app);
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/tag.routes')(app);
require('./app/routes/upload.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});