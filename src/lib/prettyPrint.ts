import { Ast } from "./Ast";

const getOrder = (ast: Ast): number => {
  switch (ast.type) {
    case "Ternary":
    case "Elvis":
      return 1;
    case "OpOr":
      return 2;
    case "OpAnd":
      return 3;
    case "OpGE":
    case "OpEQ":
    case "OpGT":
    case "OpLT":
    case "OpLE":
    case "OpMatches":
    case "OpBetween":
    case "OpNE":
      return 4;
    case "OpPlus":
    case "OpMinus":
      return 5;
    case "OpMultiply":
    case "OpModulus":
    case "OpDivide":
      return 6;
    case "OpPower":
      return 7;
    case "Negative":
    case "OpNot":
      return 8;
    default:
      return 9;
  }
};

const needsParen = (parent: Ast, child: Ast) => {
  return getOrder(parent) >= getOrder(child);
};

const prettyPrint = (ast: Ast) => {
  const maybeParen = (child: Ast) =>
    needsParen(ast, child) ? `(${prettyPrint(child)})` : prettyPrint(child);
  switch (ast.type) {
    case "BooleanLiteral": {
      return `${ast.value}`;
    }
    case "CompoundExpression": {
      return ast.expressionComponents.reduce((prev, curr) => {
        switch (curr.type) {
          case "MethodReference":
          case "PropertyReference":
          case "SelectionAll":
          case "SelectionFirst":
          case "SelectionLast":
          case "Projection":
            const { nullSafeNavigation } = curr;
            const nav = !prev ? "" : nullSafeNavigation ? "?." : ".";
            return `${prev}${nav}${prettyPrint(curr)}`;
          default:
            return `${prev}${prettyPrint(curr)}`;
        }
      }, "");
    }
    case "Elvis": {
      return `${maybeParen(ast.expression)} ?: ${maybeParen(ast.ifFalse)}`;
    }
    case "FunctionReference": {
      return `#${ast.functionName}(${ast.args.map(prettyPrint).join(", ")})`;
    }
    case "Indexer": {
      return `[${prettyPrint(ast.index)}]`;
    }
    case "InlineList": {
      return `{${ast.elements.map(prettyPrint).join(", ")}}`;
    }
    case "InlineMap": {
      return `{${Object.entries(ast.elements)
        .map(([k, v]) => {
          const key = /^([a-zA-Z_$][a-zA-Z0-9_$]*)/.test(k)
            ? k
            : `"${k.replace(`"`, `""`)}"`;
          return `${key}: ${prettyPrint(v)}`;
        })
        .join(",\n")}}`;
    }
    case "MethodReference": {
      return `${ast.methodName}(${ast.args.map(prettyPrint).join(", ")})`;
    }
    case "Negative": {
      return `-${maybeParen(ast.value)}`;
    }
    case "NullLiteral": {
      return "null";
    }
    case "NumberLiteral": {
      return `${ast.value}`;
    }
    case "OpAnd": {
      return `${maybeParen(ast.left)} && ${maybeParen(ast.right)}`;
    }
    case "OpBetween": {
      return `${maybeParen(ast.left)} between ${maybeParen(ast.right)}`;
    }
    case "OpDivide": {
      return `${maybeParen(ast.left)} / ${maybeParen(ast.right)}`;
    }
    case "OpEQ": {
      return `${maybeParen(ast.left)} == ${maybeParen(ast.right)}`;
    }
    case "OpGE": {
      return `${maybeParen(ast.left)} >= ${maybeParen(ast.right)}`;
    }
    case "OpGT": {
      return `${maybeParen(ast.left)} > ${maybeParen(ast.right)}`;
    }
    case "OpLE": {
      return `${maybeParen(ast.left)} <= ${maybeParen(ast.right)}`;
    }
    case "OpLT": {
      return `${maybeParen(ast.left)} < ${maybeParen(ast.right)}`;
    }
    case "OpMatches": {
      return `${maybeParen(ast.left)} matches ${maybeParen(ast.right)}`;
    }
    case "OpMinus": {
      return `${maybeParen(ast.left)} - ${maybeParen(ast.right)}`;
    }
    case "OpModulus": {
      return `${maybeParen(ast.left)} % ${maybeParen(ast.right)}`;
    }
    case "OpMultiply": {
      return `${maybeParen(ast.left)} * ${maybeParen(ast.right)}`;
    }
    case "OpNE": {
      return `${maybeParen(ast.left)} != ${maybeParen(ast.right)}`;
    }
    case "OpNot": {
      return `!${maybeParen(ast.expression)}`;
    }
    case "OpOr": {
      return `${maybeParen(ast.left)} || ${maybeParen(ast.right)}`;
    }
    case "OpPlus": {
      return `${maybeParen(ast.left)} + ${maybeParen(ast.right)}`;
    }
    case "OpPower": {
      return `${maybeParen(ast.base)}^${maybeParen(ast.expression)}`;
    }
    case "Projection": {
      return `![${prettyPrint(ast.expression)}]`;
    }
    case "PropertyReference": {
      return `${ast.propertyName}`;
    }
    case "SelectionAll": {
      return `?[${prettyPrint(ast.expression)}]`;
    }
    case "SelectionFirst": {
      return `^[${prettyPrint(ast.expression)}]`;
    }
    case "SelectionLast": {
      return `$[${prettyPrint(ast.expression)}]`;
    }
    case "StringLiteral": {
      const escape = (str: string) => str.replaceAll(`"`, `""`);
      return /\r|\n/.exec(ast.value)
        ? `"""${escape(ast.value)}"""`
        : `"${escape(ast.value)}"`;
    }
    case "Ternary": {
      return `${maybeParen(ast.expression)} ? ${maybeParen(
        ast.ifTrue
      )} : ${maybeParen(ast.ifFalse)}`;
    }
    case "VariableReference": {
      return `#${ast.variableName}`;
    }
  }
};

export default prettyPrint;
