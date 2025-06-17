import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limitWords',
  standalone: true,
})
export class LimitWordsPipe implements PipeTransform {
  transform(value: string, size: string = "large", ellipsis: string = '...'): string {
    let displayLimit: number = 50
    let words: string[] = value.split(/\s+/);
    const charsPerWord = 12;

    if (!words) {
      return '';
    }

    let formattedWords = [];

    for (let word of words) {
      let splittedWords = this.sliceBigWord(word, charsPerWord);
      if (word.length > charsPerWord) {
        // console.log(splittedWords)
        if (size === 'small' || size === 'medium') {
          formattedWords.push(...splittedWords)
        } else {
          formattedWords.push(word)
        }
      } else {
        formattedWords.push(word)
      }
    }

    if (size === 'small') {
      displayLimit = 8
    } else if (size === 'medium') {
      displayLimit = 10
    } else if (size === 'large') {
      displayLimit = 15
    }

    return formattedWords.slice(0, displayLimit).join(' ') + ellipsis;
  }

  private sliceBigWord(word: string, maxLength: number): string[] {
    const result = [];
    for (let i = 0; i < word.length; i += maxLength) {
      result.push(word.slice(i, i + maxLength));
    }
    return result;
  }
}