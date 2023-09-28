export class GridData {
    succeeded: boolean;
    data: Data[];
    pageNumber: number;
    pageSize: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    totalPages: number;
    totalRecords: number
    constructor() {
        this.succeeded = false;
        this.data = [];
        this.pageNumber = 0;
        this.pageSize = 0;
        this.isFirstPage = false;
        this.isLastPage = false;
        this.totalPages = 0;
        this.totalRecords = 0;
    }
}

export class Data {
    firma: string;
    grup: string;
    ad: string;
    soyad: string;
    eposta: string;
    telefon: string;
    il: string;
    ilce: string
    [key: string]: string;
    constructor() {
        this.firma = "";
        this.grup = "";
        this.ad = "";
        this.soyad = "";
        this.eposta = "";
        this.telefon = "";
        this.il = "";
        this.ilce = "";
    }
}

