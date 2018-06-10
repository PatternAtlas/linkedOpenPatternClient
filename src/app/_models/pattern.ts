import { ConcreteSolution } from './concrete-solution';
import { Relationship } from './relationship';

export class Pattern {
    iri: string;
    dataTypeProperties: any[];
    relationships: Relationship[];
    concreteSolutions: ConcreteSolution[];

    constructor(
        iri: string,
        dataTypeProperties: any[] = [],
        relationships: Relationship[] = [],
        concreteSolutions: ConcreteSolution[] = []
    ) {
        this.iri = iri;
        this.dataTypeProperties = dataTypeProperties;
        this.relationships = relationships;
        this.concreteSolutions = concreteSolutions;
    }
}
