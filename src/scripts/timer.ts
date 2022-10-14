const date = new Date(2022, 9, 11, 11, 30, 0, 0);

const getMs = (date: Date) => {
    const now = new Date();
    return now.getTime() - date.getTime();
};

function getTime(milliseconds: number) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24)
    let weeks = Math.floor(days / 7)
    let months = Math.floor(weeks / 4)
    let years = Math.floor(months / 12)

    seconds = seconds % 60;
    minutes = minutes % 60;
    hours = hours % 24;
    days = days % 7;
    weeks = weeks % 4;
    months = months % 12;

    return `${years} años ${months} meses ${weeks} semanas ${days} días ${hours} horas ${minutes} minutos ${seconds} segundos`;
}

window.addEventListener('load', () => {
    const element = document.querySelector('#timer')
    element!.innerHTML = getTime(getMs(date))
    setInterval(() => {
        element!.innerHTML = getTime(getMs(date))
    }, 1000)
})

export { }