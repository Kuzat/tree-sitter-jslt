
module.exports = grammar({
    name: 'jslt',

    extras: $ => [
        " ",
        "\t",
        "\n",
        "\r",
        "\f",
        $.single_line_comment,
        /.*\r?\n/
    ],

    // word: $ => $.ident,

    rules: {
        source_document: $ => seq(
            repeat($.import_statement),
            repeat(choice($.let_statement, $.function_statement)),
            optional($.expression)
        ),

        expression: $ => prec.left(2, seq(
            $._or_expression,
            repeat(
                seq(
                    $.pipe_operator,
                    $._or_expression
                )
            )
        )),

        _or_expression: $ => prec.left(2, seq(
            $._and_expression,
            optional(seq($.or, $._or_expression))
        )),

        _and_expression: $ => prec.left(2, seq(
            $._comparative_expression,
            optional(seq($.and, $._and_expression))
        )),

        _comparative_expression: $ => prec.left(2, seq(
            $._additive_expression,
            optional(seq($.comparator, $._additive_expression))
        )),

        comparator: $ => choice(
            $.equals,
            $.unequals,
            $.bigoreq,
            $.bigger,
            $.smaller,
            $.smalloreq
        ),

        pipe_operator: $ => $.pipe,


        _additive_expression: $ => prec.left(2, seq(
            $._multiplicative_expression,
            optional(seq($.additive_operator, $._multiplicative_expression))
        )),

        additive_operator: $ => choice(
            $.plus,
            $.minus
        ),

        _multiplicative_expression: $ => prec.left(2, seq(
            $._base_expression,
            optional(seq($.multiplicative_operator, $._base_expression))
        )),

        multiplicative_operator: $ => choice(
            $.star,
            $.slash
        ),

        _base_expression: $ => choice(
            prec(2, $.null),
            $.integer,
            $.decimal,
            $.string,
            $.true,
            $.false,
            $.chainable,
            $.parenthesis,
            $.if_statement,
            $.array,
            choice(prec(2, $.object), $.object_comprehension)
        ),

        chainable: $ => prec.left(3, seq(
            prec.left(2, choice($.function_call, $.variable, seq($.dot, optional(choice($.ident, $.string))))),
            prec.left(1, optional($.chain_link))
        )),

        chain_link: $ => prec.left(2, seq(
            choice($.dot_key, $.array_slicing),
            optional($.chain_link)
        )),

        parenthesis: $ => seq(
            $.lparen,
            $.expression,
            $.rparen
        ),

        dot_key: $ => seq(
            $.dot,
            choice($.ident, $.string)
        ),

        array_slicing: $ => seq(
            $.lbracket,
            choice(
                seq($.expression, optional(seq($.colon, optional($.expression)))),
                seq($.colon, $.expression)
            ),
            $.rbracket
        ),

        array_element: $ => seq(
            $.expression,
            optional(seq($.comma, optional($.array_element)))
        ),

        array: $ => seq(
            $.lbracket,
            choice(
                seq(
                    $.for, $.lparen, $.expression, $.rparen, repeat($.let_statement), $.expression,
                    optional(seq($.if, $.lparen, $.expression, $.rparen))
                ),
                optional($.array_element)
            ),
            $.rbracket
        ),

        object: $ => seq(
            $.lcurly,
            repeat($.let_statement),
            optional(choice($.pair, $.matcher)),
            $.rcurly
        ),

        matcher: $ => seq(
            $.star,
            optional($.matcher_minus),
            $.colon,
            $.expression
        ),

        matcher_minus: $ => seq(
            $.minus,
            choice($.ident, $.string),
            repeat(seq($.comma, choice($.ident, $.string)))
        ),

        pair: $ => seq(
            $.expression, $.colon, $.expression,
            optional(seq($.comma, optional(choice($.pair, $.matcher))))
        ),

        object_comprehension: $ => seq(
            $.lcurly,
            $.for, $.lparen, $.expression, $.rparen,
            repeat($.let_statement),
            $.expression, $.colon, $.expression,
            optional(seq($.if, $.lparen, $.expression, $.rparen)),
            $.rcurly
        ),

        if_statement: $ => prec.left(2, seq(
            $.if, $.lparen, $.expression, $.rparen,
            repeat($.let_statement),
            $.expression,
            optional($.else_branch)
        )),

        else_branch: $ => seq(
            $.else,
            repeat($.let_statement),
            $.expression
        ),

        function_call: $ => seq(
            choice($.ident, $.pident),
            $.lparen,
            optional(seq($.expression, repeat(seq($.comma, $.expression)))),
            $.rparen
        ),

        let_statement: $ => seq(
            $.let, $.ident, $.assign, $.expression
        ),

        function_statement: $ => seq(
            $.def, $.ident, $.lparen,
            optional(seq($.ident, repeat(seq($.comma, $.ident)))),
            $.rparen,
            repeat($.let_statement),
            $.expression
        ),

        import_statement: $ => seq(
            $.import, $.string, $.as, $.ident
        ),

        single_line_comment: $ => /\/\/.*(\n|\r|\r\n)?/,

        null: $ => "null",
        integer: $ => /(-)?\d+/,
        decimal: $ => /(-)?\d+(\.\d+)|((\.\d+)?(e|E)(\+|-)?\d+)/,
        string: $ => choice(
            seq('"', '"'),
            seq('"', $.string_content, '"')
        ),
        string_content: $ => repeat1(choice(
            token.immediate(prec(1, /[^\\"\n]+/)),
            $.escape_sequence
        )),
        escape_sequence: $ => token.immediate(seq(
            '\\',
            /(\"|\\|\/|b|n|r|t|u)/
        )),
        lbracket: $ => "[",
        rbracket: $ => "]",
        comma: $ => ",",
        colon: $ => ":",
        lcurly: $ => "{",
        rcurly: $ => "}",
        true: $ => "true",
        false: $ => "false",
        or: $ => "or",
        and: $ => "and",
        dot: $ => ".",
        if: $ => "if",
        else: $ => "else",
        lparen: $ => "(",
        rparen: $ => ")",
        let: $ => "let",
        assign: $ => "=",
        equals: $ => "==",
        unequals: $ => "!=",
        bigoreq: $ => ">=",
        bigger: $ => ">",
        smaller: $ => "<",
        smalloreq: $ => "<=",
        plus: $ => "+",
        minus: $ => "-",
        star: $ => "*",
        slash: $ => "/",
        pipe: $ => "|",
        for: $ => "for",
        def: $ => "def",
        import: $ => "import",
        as: $ => "as",
        ident: $ => /[A-Za-z0-9_-]+/,
        pident: $ => seq($.ident, $.colon, $.ident),
        variable: $ => seq("$", $.ident)
    }
})
