type ClinicAddress = {
    id: number;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zip: string;
};

export interface FormData {
    name: string;
    email: string;
    phone?: string;
    service: string;
    date: string;
    time: string;
    message: string;
    clinic: ClinicAddress;
    startDate: Date;
    endDate: Date;

}