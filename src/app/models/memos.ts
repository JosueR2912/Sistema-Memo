import jsPDF from "jspdf";

export class Memos {
    public id!: number;
    public codigo_memo !: string;
    public de!: string;
    public copia_para!: any;
    public asunto!:string;
    public contenido!:string;
    public fecha!:Date;
    public fromDepartamento!: number;
    public toDepartamento!: number;
    public status!: string;
    public status_delete!: string;
    public id_user!: number;
}