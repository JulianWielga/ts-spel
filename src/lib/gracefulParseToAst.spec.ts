import { Ast } from "./Ast";
import { parse } from "./ParseToAst";

/**
 * TODO below should actually throw because it's not graceful lol
 */
it("should gracefully parse with missing right operand", () => {
  expect(parse("1 -", true)).toEqual({
    type: "OpMinus",
    left: {
      type: "NumberLiteral",
      value: 1,
    },
    right: null,
    _isClosed: false,
  });
});

it("should gracefully parse incomplete paren and compound ending in .", () => {
  expect(parse("(foo?.bar.", true)).toEqual<Ast>({
    type: "CompoundExpression",
    expressionComponents: [
      {
        type: "PropertyReference",
        nullSafeNavigation: false,
        propertyName: "foo",
      },
      {
        type: "PropertyReference",
        nullSafeNavigation: true,
        propertyName: "bar",
      },
      {
        type: "PropertyReference",
        nullSafeNavigation: false,
        propertyName: "",
      },
    ],
  });
});

it("should gracefully parse incomplete selection expression", () => {
  expect(parse("foo.?[#this.", true)).toEqual<Ast>({
    type: "CompoundExpression",
    expressionComponents: [
      {
        type: "PropertyReference",
        nullSafeNavigation: false,
        propertyName: "foo",
      },
      {
        type: "SelectionAll",
        nullSafeNavigation: false,
        __unclosed: true,
        expression: {
          type: "CompoundExpression",
          expressionComponents: [
            {
              type: "VariableReference",
              variableName: "this",
            },
            {
              type: "PropertyReference",
              nullSafeNavigation: false,
              propertyName: "",
            },
          ],
        },
      },
    ],
  });
});

it("should gracefully parse unclosed string literals", () => {
  expect(parse("a == 'abc ", true)).toEqual<Ast>({
    type: "OpEQ",
    left: {
      type: "PropertyReference",
      nullSafeNavigation: false,
      propertyName: "a",
    },
    right: {
      type: "StringLiteral",
      value: "abc",
      __unclosed: true,
    },
    _isClosed: false,
  });
});

it("should gracefully parse an unclosed string literal in an unclosed function call", () => {
  expect(parse('foo("a', true)).toEqual<Ast>({
    type: "MethodReference",
    methodName: "foo",
    __unclosed: true,
    nullSafeNavigation: false,
    args: [
      {
        type: "StringLiteral",
        value: "a",
        __unclosed: true,
      },
    ],
  });
});

it("should gracefully parse unclosed method call, including empty trailing arguments after last comma", () => {
  expect(parse('foo("a",', true)).toEqual<Ast>({
    type: "MethodReference",
    methodName: "foo",
    __unclosed: true,
    nullSafeNavigation: false,
    args: [
      {
        type: "StringLiteral",
        value: "a",
      },
      null,
    ],
  });
});
it("should gracefully unclosed Inline Lists and Maps", () => {
  expect(parse("{{firstName: firstName", true)).toEqual<Ast>({
    type: "InlineList",
    elements: [
      {
        type: "InlineMap",
        start: 1,
        end: 22,
        elements: {
          firstName: {
            nullSafeNavigation: false,
            propertyName: "firstName",
            type: "PropertyReference",
            start: 12,
            end: 22,
          },
        },
        __unclosed: true,
      },
    ],
    __unclosed: true,
  });
});
it("should indicate if a boolean operator is closed or open if graceful", () => {
  const left = {
    type: "PropertyReference",
    propertyName: "a",
    nullSafeNavigation: false,
  } as const;
  const right = {
    type: "PropertyReference",
    propertyName: "b",
    nullSafeNavigation: false,
  } as const;

  expect(parse(`a ^ b`, true)).toEqual<Ast>({
    type: "OpPower",
    base: left,
    expression: right,
    _isClosed: false,
  });
  expect(parse(`(a ^ b)`, true)).toEqual<Ast>({
    type: "OpPower",
    base: left,
    expression: right,
    _isClosed: true,
  });

  expect(parse(`a ? b : b`, true)).toEqual<Ast>({
    type: "Ternary",
    expression: left,
    ifFalse: right,
    ifTrue: right,
    _isClosed: false,
  });
  expect(parse(`(a ? b : b)`, true)).toEqual<Ast>({
    type: "Ternary",
    expression: left,
    ifFalse: right,
    ifTrue: right,
    _isClosed: true,
  });

  expect(parse(`a ?: b`, true)).toEqual<Ast>({
    type: "Elvis",
    expression: left,
    ifFalse: right,
    _isClosed: false,
  });
  expect(parse(`(a ?: b)`, true)).toEqual<Ast>({
    type: "Elvis",
    expression: left,
    ifFalse: right,
    _isClosed: true,
  });

  /**
   * TODO: do this now for Ternary and Elvis
   */

  const operators = [
    ["||", "OpOr"],
    ["+", "OpPlus"],
    ["-", "OpMinus"],
    ["!=", "OpNE"],
    ["*", "OpMultiply"],
    ["/", "OpDivide"],
    ["%", "OpModulus"],
    ["matches", "OpMatches"],
    ["between", "OpBetween"],
    ["<", "OpLT"],
    ["<=", "OpLE"],
    [">", "OpGT"],
    [">=", "OpGE"],
    ["==", "OpEQ"],
    ["&&", "OpAnd"],
  ] as const;
  operators.forEach(([opStr, type]) => {
    expect(parse(`a ${opStr} b`, true)).toEqual<Ast>({
      type,
      left,
      right,
      _isClosed: false,
    });

    expect(parse(`(a ${opStr} b)`, true)).toEqual<Ast>({
      type,
      left,
      right,
      _isClosed: true,
    });
  });
});
it("should gracefully unclosed Inline Maps", () => {
  expect(
    parse(
      `#f().date.of().is.after({
        date: "foo",
        time: f.`,
      true
    )
  ).toEqual<Ast>({
    type: "CompoundExpression",
    expressionComponents: [
      {
        type: "FunctionReference",
        nullSafeNavigation: false,
        functionName: "f",
        args: [],
      },
      {
        type: "PropertyReference",
        propertyName: "date",
        nullSafeNavigation: false,
      },
      {
        type: "MethodReference",
        nullSafeNavigation: false,
        methodName: "of",
        args: [],
      },
      {
        type: "PropertyReference",
        propertyName: "is",
        nullSafeNavigation: false,
      },
      {
        type: "MethodReference",
        nullSafeNavigation: false,
        methodName: "after",
        args: [
          {
            type: "InlineMap",
            elements: {
              date: {
                type: "StringLiteral",
                value: "foo",
                start: 39,
                end: 45,
              },
              time: {
                start: 60,
                end: 63,
                type: "CompoundExpression",
                expressionComponents: [
                  {
                    nullSafeNavigation: false,
                    propertyName: "f",
                    type: "PropertyReference",
                  },
                  {
                    nullSafeNavigation: false,
                    propertyName: "",
                    type: "PropertyReference",
                  },
                ],
              },
            },
            __unclosed: true,
          },
        ],
        __unclosed: true,
      },
    ],
  });
});

it("should gracefully parse an unclosed map inside an unclosed list", () => {
  expect(parse("{{ f: ", true)).toEqual<Ast>({
    type: "InlineList",
    __unclosed: true,
    elements: [
      {
        type: "InlineMap",
        __unclosed: true,
        elements: {
          f: null,
        },
        start: 1,
        end: 3,
      },
    ],
  });

  expect(parse("{{ f: d", true)).toEqual<Ast>({
    type: "InlineList",
    __unclosed: true,
    elements: [
      {
        type: "InlineMap",
        __unclosed: true,
        elements: {
          f: {
            type: "PropertyReference",
            nullSafeNavigation: false,
            propertyName: "d",
            start: 5,
            end: 7,
          },
        },
        start: 1,
        end: 7,
      },
    ],
  });

  expect(parse("{{ f: d, ", true)).toEqual<Ast>({
    type: "InlineList",
    __unclosed: true,
    elements: [
      {
        type: "InlineMap",
        __unclosed: true,
        elements: {
          f: {
            type: "PropertyReference",
            nullSafeNavigation: false,
            propertyName: "d",
            start: 5,
            end: 7,
          },
          "": null as any,
        },
        start: 1,
        end: 9,
      },
    ],
  });
});
