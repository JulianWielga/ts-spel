export type Ast =
  | {
      type: "StringLiteral";
      value: string;
      __unclosed?: true;
    }
  | {
      type: "Ternary";
      expression: Ast;
      ifTrue: Ast;
      ifFalse: Ast;
      _isClosed?: boolean;
    }
  | {
      type: "VariableReference";
      variableName: string;
    }
  | {
      type: "SelectionFirst";
      nullSafeNavigation: boolean;
      expression: Ast;
      __unclosed?: true;
    }
  | {
      type: "SelectionLast";
      nullSafeNavigation: boolean;
      expression: Ast;
      __unclosed?: true;
    }
  | {
      type: "SelectionAll";
      nullSafeNavigation: boolean;
      expression: Ast;
      __unclosed?: true;
    }
  | {
      type: "PropertyReference";
      nullSafeNavigation: boolean;
      propertyName: string;
    }
  | {
      type: "Projection";
      nullSafeNavigation: boolean;
      expression: Ast;
      __unclosed?: true;
    }
  | {
      type: "OpPower";
      base: Ast;
      expression: Ast;
      _isClosed?: boolean;
    }
  | {
      type: "OpPlus";
      left: Ast;
      right: Ast;
      _isClosed?: boolean;
    }
  | {
      type: "OpOr";
      left: Ast;
      right: Ast;
      _isClosed?: boolean;
    }
  | {
      type: "OpNot";
      expression: Ast;
    }
  | {
      type: "OpNE";
      left: Ast;
      right: Ast;
      _isClosed?: boolean;
    }
  | {
      type: "OpMultiply";
      left: Ast;
      right: Ast;
      _isClosed?: boolean;
    }
  | {
      type: "OpModulus";
      left: Ast;
      right: Ast;
      _isClosed?: boolean;
    }
  | {
      type: "OpMinus";
      left: Ast;
      right: Ast;
      _isClosed?: boolean;
    }
  | {
      type: "OpMatches";
      left: Ast;
      right: Ast;
      _isClosed?: boolean;
    }
  | {
      type: "OpBetween";
      left: Ast;
      right: Ast;
      _isClosed?: boolean;
    }
  | {
      type: "OpLT";
      left: Ast;
      right: Ast;
      _isClosed?: boolean;
    }
  | {
      type: "OpLE";
      left: Ast;
      right: Ast;
      _isClosed?: boolean;
    }
  | {
      type: "OpGT";
      left: Ast;
      right: Ast;
      _isClosed?: boolean;
    }
  | {
      type: "OpGE";
      left: Ast;
      right: Ast;
      _isClosed?: boolean;
    }
  | {
      type: "OpEQ";
      left: Ast;
      right: Ast;
      _isClosed?: boolean;
    }
  | {
      type: "OpDivide";
      left: Ast;
      right: Ast;
      _isClosed?: boolean;
    }
  | {
      type: "OpAnd";
      left: Ast;
      right: Ast;
      _isClosed?: boolean;
    }
  | {
      type: "Negative";
      value: Ast;
    }
  | {
      type: "NumberLiteral";
      value: number;
    }
  | {
      type: "NullLiteral";
    }
  | {
      type: "MethodReference";
      nullSafeNavigation: boolean;
      methodName: string;
      args: (Ast | null)[]; // null if graceful
      __unclosed?: true;
    }
  | {
      type: "FunctionReference";
      nullSafeNavigation: boolean;
      functionName: string;
      args: Ast[];
      __unclosed?: true;
    }
  | {
      type: "InlineMap";
      elements: {
        [elem: string]: Ast & {start: number, end: number};
      };
      __unclosed?: true;
    }
  | {
      type: "InlineList";
      elements: (Ast & {start: number, end: number})[];
      __unclosed?: true;
    }
  | {
      type: "Indexer";
      nullSafeNavigation: boolean;
      index: Ast;
      __unclosed?: true;
    }
  | {
      type: "Elvis";
      expression: Ast;
      ifFalse: Ast;
      _isClosed?: boolean;
    }
  | {
      // Represents a dot-separated expression sequence, such as 'property1.property2.methodOne()'
      type: "CompoundExpression";
      expressionComponents: Ast[];
    }
  | {
      type: "BooleanLiteral";
      value: boolean;
    };
