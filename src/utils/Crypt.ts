import bcrypt from 'bcrypt';

export class Crypt {
    private saltRounds: number;

    constructor(saltRounds: number) {
        this.saltRounds = saltRounds;
    }

    public hash(plainText: string): string {
        return bcrypt.hashSync(plainText, this.saltRounds);
    }

    public compare(plainText: string): boolean {
        return bcrypt.compareSync(plainText, this.hash(plainText));
    }

}