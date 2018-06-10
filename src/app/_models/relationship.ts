export class Relationship {
    iri: string;
    type: string;
    additionalDescription: string;
    target: string;

    constructor(iri: string, type?: string, additionalDescription?: string, target?: string) {
        this.iri = iri;
        this.type = type;
        this.additionalDescription = additionalDescription;
        this.target = target;
    }
}
