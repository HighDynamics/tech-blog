async function addCommentHandler(event) {
  event.preventDefault();

  const comment_text = document
    .querySelector('textarea[name="comment-body"]')
    .value.trim();
  const post_id = window.location.toString().split('/')[
    window.location.toString().split('/').length - 1
  ];

  if (comment_text) {
    const response = await fetch('/api/comments', {
      method: 'POST',
      body: JSON.stringify({ comment_text, post_id }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.reload();
    } else {
      alert(response.statusText);
    }
  }
}

document
  .querySelector('.comment-form')
  .addEventListener('submit', addCommentHandler);

function editCommentInit(event) {
  event.preventDefault();

  const editButtonEl = event.target;

  const id = editButtonEl.dataset.comment_id;

  // create save button to replace edit button
  const saveButtonEl = document.createElement('button');
  saveButtonEl.setAttribute('class', 'save-comment-btn');
  saveButtonEl.dataset.comment_id = id;
  saveButtonEl.innerHTML = 'save comment';

  // store relevant elements
  const commentSectionEl = document.querySelector(
    `.comment[data-comment_id="${id}"]`
  );
  const commentTextEl = document.querySelector(
    `.text[data-comment_id="${id}"]`
  );
  const metaDivEl = commentSectionEl.querySelector('.meta');

  // get comment text
  const comment_text = commentTextEl.innerHTML.trim();

  // create input element to replace commentTextEl
  const inputEl = document.createElement('textarea');
  inputEl.value = comment_text;
  inputEl.dataset.comment_id = id;

  commentSectionEl.replaceChild(inputEl, commentTextEl);
  metaDivEl.replaceChild(saveButtonEl, editButtonEl);

  // add event listener on new button
  document
    .querySelector('.save-comment-btn', saveCommentHandler)
    .addEventListener('click', saveCommentHandler);
}

document
  .querySelector('.edit-comment-btn')
  .addEventListener('click', editCommentInit);

async function saveCommentHandler(event) {
  event.preventDefault();
  const buttonEl = event.target;

  const id = buttonEl.dataset.comment_id;

  const commentInputEl = document.querySelector(
    `textarea[data-comment_id="${id}"]`
  );

  const comment_text = commentInputEl.value.trim();

  if (comment_text) {
    const response = await fetch(`/api/comments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ comment_text }),
      headers: { 'Content-type': 'application/json' },
    });

    if (response.ok) {
      document.location.reload();
    } else {
      alert(response.statusText);
    }
  }
}
