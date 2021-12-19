function addLineBreaks(content) {
  return content.replaceAll('\n', '<br>');
}

module.exports = { addLineBreaks };
