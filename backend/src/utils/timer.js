const SessionController = require("../controllers/sessionController");

function loop() {
    SessionController.removeExpired();
}

module.exports.start = () => {
    setInterval(loop, 5000);
}