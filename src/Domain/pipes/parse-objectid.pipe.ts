import { PipeTransform, NotFoundException } from "@nestjs/common";
import { isValidObjectId } from "mongoose";

class ParseObjectIdPipe implements PipeTransform {
  transform(value: string): string {
    if (!isValidObjectId(value)) throw new NotFoundException(`Resource ${value} not found`);
    return value;
  }
}

export const parseObjectId = new ParseObjectIdPipe();
