rules: {
  'no-restricted-syntax': [
    'error',
    {
      selector: 'JSXElement[name=/^h[1-4]$/]',
      message: 'Use the Header component instead of native h1-h4 elements'
    }
  ]
}
