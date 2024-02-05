export class RandomUtil {
  static getRandomItemFromArray(array: any[]): any {
    return array[Math.floor((Math.random() * array.length))];
  }
}
