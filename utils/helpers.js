function addLineBreaks(content) {
  return content.replaceAll('\n', '<br>');
}

function formatDate(date) {
  return `${new Date(date).getMonth() + 1}/${new Date(
    date
  ).getDate()}/${new Date(date).getFullYear()}`;
}

function formatPlural(word, amount) {
  if (amount !== 1) {
    return `${word}s`.toLowerCase();
  }

  return word.toLowerCase();
}

module.exports = { addLineBreaks, formatDate, formatPlural };
