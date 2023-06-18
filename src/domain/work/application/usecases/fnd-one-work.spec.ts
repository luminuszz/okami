import { InMemoryWorkRepository } from "test/mocks/in-mermory-work-repository";
import { FindOneWorkUseCase } from "./fnd-one-work"
import { Category, Work } from "@domain/work/enterprise/entities/work";
import { CreateWorkUseCase } from "./create-work";



describe("FindOneWork", () => {

    let stu: FindOneWorkUseCase;
    let workRepository: InMemoryWorkRepository



    beforeEach(() => {
        workRepository = new InMemoryWorkRepository();
        stu = new FindOneWorkUseCase(workRepository);
    })



    it("should be able return a work", async () => {


        const createWork = new CreateWorkUseCase(workRepository);

        const { work } = await createWork.execute({
            category: Category.ANIME,
            chapter: 1,
            name: "One Piece",
            url: "https://onepiece.com",
        })





        const result = await stu.execute({ id: work.id })




        expect(result.isRight()).toBeTruthy();
        expect(result.value.work.name).toBe("One Piece")


    })

    it("should a null value if work not exsits", async () => {


        const createWork = new CreateWorkUseCase(workRepository);

        const { work } = await createWork.execute({
            category: Category.ANIME,
            chapter: 1,
            name: "One Piece",
            url: "https://onepiece.com",
        })





        const result = await stu.execute({ id: "fake id" })




        expect(result.isLeft()).toBeTruthy();
        expect(result.value.work).toBeNull()

    })

})