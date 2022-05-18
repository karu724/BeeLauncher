const app = require('electron')

document.getElementById('launcher_exit').onclick = (e) => {
    app.quit()
}