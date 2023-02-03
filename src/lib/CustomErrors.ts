import { CustomError } from "ts-custom-error";
import { Ast } from "./Ast";

export class ParsingError extends CustomError {
  public constructor(
    public expression: string,
    public index: number,
    public reason:
      | "Expected )"
      | "Expected expression in ()"
      | "Expression Remaining"
      | "Generic"
      | "Expected expression after elvis (?:)"
      | "Expected ) for function call"
      | "Expected ) for method call"
      | "No right operand for &&"
      | "No right operand for ||"
      | "No right operand for >="
      | "No right operand for >"
      | "No right operand for <="
      | "No right operand for <"
      | "No right operand for !="
      | "No right operand for =="
      | "No right operand for *"
      | "No right operand for /"
      | "No right operand for %"
      | "No right operand for 'matches'"
      | "No right operand for 'between'"
      | "No left operand for &&"
      | "No left operand for ||"
      | "No left operand for >="
      | "No left operand for >"
      | "No left operand for <="
      | "No left operand for <"
      | "No left operand for !="
      | "No left operand for =="
      | "No left operand for *"
      | "No left operand for /"
      | "No left operand for %"
      | "Assignment not allowed"
      | "Expected property after ."
      | "Expected property after ?."
      | "Expression expected in []"
      | "Incomplete Ternary"
      | "Not an Operator"
      | "Missing Character &"
      | "Missing Character |"
      | "Non-terminating quoted string"
      | "Expected }"
      | "Expected ]"
      | "Expected ] for selection expression ?["
      | "Expected ] for selection expression ^["
      | "Expected ] for selection expression $["
      | "Expected ] for Projection expression ![",
    message: string = reason,
    cause?: Error
  ) {
    super(message, { cause });
  }
}

export class RuntimeError extends CustomError {
  public constructor(public ast: Ast, message?: string, cause?: Error) {
    super(message, { cause });
  }
}

export class UnexpectedError extends CustomError {
  public constructor(message?: string, cause?: Error) {
    super(message, { cause });
  }
}

export type TsSpelError = ParsingError | RuntimeError | UnexpectedError;
