import {
  report,
  ruleMessages,
  whitespaceChecker
} from "../../utils"

export const ruleName = "media-feature-range-operator-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => `Expected single space after range operator`,
  rejectedAfter: () => `Unexpected space after range operator`,
})

const rangeOperatorRegex = /[^><](>=?|<=?|=)/g

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker(" ", expectation, messages)
  return (root, result) => {
    root.eachAtRule(atRule => {
      findMediaOperator(atRule, checkAfterOperator)
    })

    function checkAfterOperator(match, params, node) {
      checker.after(params, match.index + match[1].length, m =>
        report({
          message: m,
          node: node,
          result,
          ruleName,
        })
      )
    }
  }
}

export function findMediaOperator(atRule, cb) {
  if (atRule.name !== "media") { return }

  const params = atRule.params
  let match
  while ((match = rangeOperatorRegex.exec(params)) !== null) {
    cb(match, params, atRule)
  }
}