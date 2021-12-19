async function savePostHandler(event) {
  const post_id = document.location.toString().split('/')[
    document.location.toString().split('/').length - 1
  ];

  const title = document.getElementById('post-title').value.trim();
  const content = document.getElementById('post-content').value.trim();
  response = await fetch(`/api/posts/${post_id}`, {
    method: 'PUT',
    body: JSON.stringify({ title, content }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    document.location.replace('/dashboard/');
  } else {
    alert(response.statusText);
  }
}

document
  .getElementById('edit-post-form')
  .addEventListener('submit', savePostHandler);
