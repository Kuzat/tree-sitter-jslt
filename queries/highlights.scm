
(function_call) @function

(function_statement) @function

(variable) @variable 

(string) @string

[
 (integer)
 (decimal)
]@number

[
 (null)
 (true)
 (false)
] @constant.builtin

(escape_sequence) @escape

(single_line_comment) @comment

[
  (comma)
] @punctuation.delimiter

[
  (comparator)
  (pipe_operator)
  (additive_operator)
  (multiplicative_operator)
  (assign)
] @operator

[
  (lparen)
  (rparen)
  (lbracket)
  (rbracket)
  (lcurly)
  (rcurly)
] @punctuation.bracket

[
  (as)
  (let)
  (def)
  (if)
  (else)
  (import)
  (for)
] @keyword
