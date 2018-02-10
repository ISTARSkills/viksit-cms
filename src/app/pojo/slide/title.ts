export class Title {

    text: string;
    fragmentOrder: number;
    transactionType: string;
    transactionDuration: number;
    constructor(text: string, fragmentOrder: number, transactionType: string, transactionDuration: number) {
        this.text = text;
        this.fragmentOrder = fragmentOrder;
        this.transactionType = transactionType;
        this.transactionDuration = transactionDuration;


    }
}