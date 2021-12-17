function addNewPostInit(event) {
  const wrapperEl = document.querySelector('.new-post-wrapper');
  // create elements
  const savePostBtnEl = document.createElement('button');
  savePostBtnEl.setAttribute('id', 'save-post-btn');
  savePostBtnEl.innerHTML = 'save post';

  const titleInputEl = document.createElement('input');
  titleInputEl.setAttribute('type', 'text');
  titleInputEl.setAttribute('id', 'post-title');

  const titleLabelEl = document.createElement('label');
  titleLabelEl.setAttribute('for', 'post-title');
  titleLabelEl.innerHTML = 'Title:';

  const postInputEl = document.createElement('textarea');
  postInputEl.setAttribute('id', 'post-content');

  // append new elements
  wrapperEl.prepend(titleLabelEl, titleInputEl, postInputEl);

  // replace button
  wrapperEl.replaceChild(savePostBtnEl, event.target);

  // add event listener to new button
  savePostBtnEl.addEventListener('click', savePostHandler);
}

async function savePostHandler(event) {
  const title = document.getElementById('post-title').value.trim();
  const content = document.getElementById('post-content').value.trim();

  const response = await fetch('/api/posts', {
    method: 'POST',
    body: JSON.stringify({ title, content }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    document.location.reload();
  } else {
    alert(response.statusText);
  }
}

document
  .getElementById('new-post-btn')
  .addEventListener('click', addNewPostInit);
