import { Either, left, right } from "@core/either";
import { UseCaseImplementation } from "@core/use-case";
import { Work } from "@app/domain/work/enterprise/entities/work";
import { Injectable } from "@nestjs/common";
import { WorkRepository } from "../repositories/work-repository";



interface FindOneWorkInput {
    id: string;
}

type FindOneWorkOutput = Either<{ work: null }, { work: Work | null }>;


@Injectable()
export class FindOneWorkUseCase implements UseCaseImplementation<FindOneWorkInput, FindOneWorkOutput> {


    constructor(
        private readonly workRepository: WorkRepository
    ) { }

    async execute({ id }: FindOneWorkInput): Promise<FindOneWorkOutput> {


        const results = await this.workRepository.findOne(id);


        return results ? right({ work: results }) : left({ work: null })


    }


} 