export enum SizeEnum {
    Small = 'small',
    Medium = 'medium',
    Large = 'large',
}

export class SizeService {

    static getSize(value: number): 'small' | 'medium' | 'large' {
        if (value <= 10) {
            return 'small';
        } else if (value <= 20) {
            return 'medium';
        } else {
            return 'large';
        }
    }
}