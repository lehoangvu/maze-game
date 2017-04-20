const defaultLevel = {
    mazeWidth: 8,
    mazeHeight: 13,
    targetScore: 10,
    id: 1
};
export default class Level {
    constructor() {
        this.levelData = defaultLevel;
        this.coefficient = 2;
    }
    next() {
        let newLevelData = {
            ...this.levelData,
            id: this.levelData.id+1,
            targetScore: this.levelData.targetScore * this.coefficient
        };
        this.levelData = newLevelData;
        return this.levelData;
    }
}