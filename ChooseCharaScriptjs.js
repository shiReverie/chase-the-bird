function showCharas() {
    document.getElementById('story').style.display = 'none';
    document.getElementById('chooseCharaH3').style.display = 'block';
    document.getElementById('charas').style.display = 'block';
}
function startGame(character) {
    let spritePath; let speed;
    let initialHealth = 3;
    let initialObstacles = 0; // Number of obstacles Smokey can destroy
    let healthRestoreInterval = null; // Interval for Dozy's health restoration
    switch (character) {
        case 'Chase': speed = 6;
            break;
        case 'Sylvie': speed = 5;
            initialHealth = 4;
            break;
        case 'Smokey': speed = 5;
            initialObstacles = 2; // Smokey can destroy 2 obstacles
            break;
        case 'Dozy': speed = 5;
            healthRestoreInterval = 20000; // Dozy restores 1 health every 20 seconds
            break;
        default: speed = 5;
    } window.location.href = `game.html?character=${character}&sprite=${encodeURIComponent(spritePath)}&speed=${speed}&health=${initialHealth}&obstacles=${initialObstacles}&restoreInterval=${healthRestoreInterval}`;
}