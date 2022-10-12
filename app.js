const countSeconds = (date) => {
    const now = new Date();
    const diff = now - date;
    return Math.round(diff / 1000);
};
const countMinutes = (date) => {
    const now = new Date();
    const diff = now - date;
    return Math.round(diff / 1000 / 60);
};
const countHours = (date) => {
    const now = new Date();
    const diff = now - date;
    return Math.round(diff / 1000 / 60 / 60);
};
const countDays = (date) => {
    const now = new Date();
    const diff = now - date;
    return Math.round(diff / 1000 / 60 / 60 / 24);
};
const countWeeks = (date) => {
    const now = new Date();
    const diff = now - date;
    return Math.round(diff / 1000 / 60 / 60 / 24 / 7);
};
const countMonths = (date) => {
    const now = new Date();
    const diff = now - date;
    return Math.round(diff / 1000 / 60 / 60 / 24 / 7 / 4);
};
const countYears = (date) => {
    const now = new Date();
    const diff = now - date;
    return Math.round(diff / 1000 / 60 / 60 / 24 / 7 / 4 / 12);
};

const date = new Date(2022, 9, 11, 11, 30, 0, 0);

document.getElementById('segundos').innerHTML = countSeconds(date);
document.getElementById('minutos').innerHTML = countMinutes(date);
document.getElementById('horas').innerHTML = countHours(date);
document.getElementById('dias').innerHTML = countDays(date);
document.getElementById('semanas').innerHTML = countWeeks(date);
document.getElementById('meses').innerHTML = countMonths(date);
document.getElementById('anios').innerHTML = countYears(date);


setInterval(() => {
    document.getElementById('segundos').innerHTML = countSeconds(date);
}, 1000);

setInterval(() => {
    document.getElementById('minutos').innerHTML = countMinutes(date);
}, 1000 * 60);

setInterval(() => {
    document.getElementById('horas').innerHTML = countHours(date);
}, 1000 * 60 * 60);

setInterval(() => {
    document.getElementById('dias').innerHTML = countDays(date);
}, 1000 * 60 * 60 * 24);

setInterval(() => {
    document.getElementById('semanas').innerHTML = countWeeks(date);
}, 1000 * 60 * 60 * 24 * 7);

setInterval(() => {
    document.getElementById('meses').innerHTML = countMonths(date);
}, 1000 * 60 * 60 * 24 * 7 * 4);

setInterval(() => {
    document.getElementById('anios').innerHTML = countYears(date);
}, 1000 * 60 * 60 * 24 * 7 * 4 * 12);