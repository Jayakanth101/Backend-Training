import { Type as TransformType } from "class-transformer";
import { IsDate, IsInt, IsNotEmpty, IsString } from "class-validator";


export class CreateDiscussionDto {
    @IsInt()
    @IsNotEmpty()
    commentid: number;

    @IsInt()
    @IsNotEmpty()
    workitemid: number;

    @IsInt()
    @IsNotEmpty()
    creatorid: number;

    @IsString()
    message?: string;

    @IsNotEmpty()
    @TransformType(() => Date)
    @IsDate()
    createdat?: Date;

}
