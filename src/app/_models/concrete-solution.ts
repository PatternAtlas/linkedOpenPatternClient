export class ConcreteSolution {
    iri: string;
    description: string;
    artifactIri: string;

    constructor(iri: string, description?: string, artifactIri?: string) {
        this.iri = iri;
        this.description = description;
        this.artifactIri = artifactIri;
    }
}
