/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable linebreak-style */
/* eslint-disable semi */
/* eslint-disable linebreak-style */
async function banner() {
    const result = await axios.get("https://raw.githubusercontent.com/karu724/BeeLauncherDistribution/main/banner.json");
    const data = result.data

    const banner1 = document.getElementById('banner1');
    const banner2 = document.getElementById('banner2');
    const banner3 = document.getElementById('banner3');
    const banner4 = document.getElementById('banner4');
    banner1.style.backgroundImage = `url("${data.banner1.img}")`
    banner2.style.backgroundImage = `url("${data.banner2.img}")`
    banner3.style.backgroundImage = `url("${data.banner3.img}")`
    banner4.style.backgroundImage = `url("${data.banner4.img}")`
    banner1.onclick = () => {
        shell.openExternal(`${data.banner1.url}`)
    }
    banner2.onclick = () => {
        shell.openExternal(`${data.banner2.url}`)
    }
    banner3.onclick = () => {
        shell.openExternal(`${data.banner3.url}`)
    }
    banner4.onclick = () => {
        shell.openExternal(`${data.banner4.url}`)
    }
}
banner();

