


const API_BASE = "https://jsonplaceholder.typicode.com/posts";

// Utility: toast
function showToast(message, type = "success", timeout = 3500) {
  const id = "t" + Date.now();
  const toastHtml = `
    <div id="${id}" class="toast align-items-center text-bg-${type} border-0 mb-2" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>`;
  $("#toast-container").append(toastHtml);
  const el = document.getElementById(id);
  const bsToast = new bootstrap.Toast(el, { delay: timeout });
  bsToast.show();
  el.addEventListener('hidden.bs.toast', () => el.remove());
}

// Small helpers
function setLoading(show) {
  $("#table-loader").toggle(show);
  $("#table-wrap").toggle(!show);
}

function setSmallLoader(show) {
  $("#small-loader").toggle(show);
  $("#save-btn").prop("disabled", show);
  $("#reset-btn").prop("disabled", show);
}

// Validate create/update form fields
function formIsValid(titleSel, bodySel) {
  const title = $(titleSel).val().trim();
  const body = $(bodySel).val().trim();
  let ok = true;
  if (title.length < 3) { $(titleSel).addClass("is-invalid"); ok = false; } else { $(titleSel).removeClass("is-invalid"); }
  if (body.length < 5) { $(bodySel).addClass("is-invalid"); ok = false; } else { $(bodySel).removeClass("is-invalid"); }
  return ok;
}

// Render a single post row
function renderRow(post) {
  
  const shortBody = post.body.length > 100 ? post.body.slice(0, 100) + "…" : post.body;
  return `
    <tr data-id="${post.id}">
      <td>${post.id}</td>
      <td class="title-col">${escapeHtml(post.title)}</td>
      <td class="body-col">${escapeHtml(shortBody)}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-primary me-1 view-btn">View</button>
        <button class="btn btn-sm btn-outline-success me-1 edit-btn">Edit</button>
        <button class="btn btn-sm btn-outline-danger delete-btn">Delete</button>
      </td>
    </tr>
  `;
}

// Basic escaping
function escapeHtml(str) {
  if (!str && str !== 0) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

//  READ: load posts 
function loadPosts() {
  setLoading(true);
  $("#posts-tbody").empty();

  // GET first 20 posts to keep UI manageable
  $.get(API_BASE + "?_limit=20")
    .done(function (data) {
      data.forEach(post => {
        $("#posts-tbody").append(renderRow(post));
      });
      setLoading(false);
    })
    .fail(function () {
      setLoading(false);
      showToast("Failed to load posts. Check your network.", "danger");
    });
}

//  CREATE: new post 
function createPost(title, body) {
  setSmallLoader(true);
  $.ajax({
    url: API_BASE,
    method: "POST",
    data: JSON.stringify({ title, body, userId: 1 }),
    contentType: "application/json; charset=UTF-8"
  }).done(function (created) {
    // JSONPlaceholder returns id 101 (fake) — append to UI
    $("#posts-tbody").prepend(renderRow(created));
    showToast(`Post created (id ${created.id}).`, "success");
    $("#post-form")[0].reset();
  }).fail(function () {
    showToast("Failed to create post.", "danger");
  }).always(function () {
    setSmallLoader(false);
  });
}

//  UPDATE: update post 
function updatePost(id, title, body, onSuccess) {
  setSmallLoader(true);
  $.ajax({
    url: `${API_BASE}/${id}`,
    method: "PUT",
    data: JSON.stringify({ id: id, title, body, userId: 1 }),
    contentType: "application/json; charset=UTF-8"
  }).done(function (updated) {
    // Update row in table
    const row = $(`#posts-tbody tr[data-id="${id}"]`);
    row.find(".title-col").text(updated.title);
    // show truncated body
    const shortBody = updated.body.length > 100 ? updated.body.slice(0, 100) + "…" : updated.body;
    row.find(".body-col").text(shortBody);
    showToast(`Post ${id} updated.`, "success");
    if (typeof onSuccess === "function") onSuccess();
  }).fail(function () {
    showToast(`Failed to update post ${id}.`, "danger");
  }).always(function () {
    setSmallLoader(false);
  });
}

//  DELETE: delete post 
function deletePost(id, onSuccess) {
  // confirm before deleting
  if (!confirm("Are you sure you want to delete this post?")) return;
  setSmallLoader(true);
  $.ajax({
    url: `${API_BASE}/${id}`,
    method: "DELETE"
  }).done(function () {
    $(`#posts-tbody tr[data-id="${id}"]`).remove();
    showToast(`Post ${id} deleted.`, "warning");
    if (typeof onSuccess === "function") onSuccess();
  }).fail(function () {
    showToast(`Failed to delete post ${id}.`, "danger");
  }).always(function () {
    setSmallLoader(false);
  });
}

//  VIEW DETAILS (optional) 
function viewPostDetails(id) {
  setSmallLoader(true);
  $.get(`${API_BASE}/${id}`)
    .done(function (post) {
      const content = `<strong>Title:</strong> ${escapeHtml(post.title)}<hr/><pre>${escapeHtml(post.body)}</pre>`;
      const modal = new bootstrap.Modal(document.getElementById('editModal'));
      // reuse modal body and set values
      $("#modal-post-id").val(post.id);
      $("#modal-post-title").val(post.title).removeClass("is-invalid");
      $("#modal-post-body").val(post.body).removeClass("is-invalid");
      $(".modal-title").text(`View / Edit Post ${post.id}`);
      modal.show();
    })
    .fail(function () {
      showToast("Failed to fetch post details.", "danger");
    }).always(function () {
      setSmallLoader(false);
    });
}

//  DOM events bind
$(function () {
  loadPosts();

  
  $("#refresh-btn").click(function () {
    loadPosts();
  });

  // Create / Save from side form
  $("#post-form").on("submit", function (e) {
    e.preventDefault();
    const id = $("#post-id").val().trim();
    const title = $("#post-title").val().trim();
    const body = $("#post-body").val().trim();

    // client-side validation
    if (!formIsValid("#post-title", "#post-body")) {
      showToast("Fix the validation errors in the form.", "danger");
      return;
    }

    if (!id) {
      
      createPost(title, body);
    } else {
      updatePost(id, title, body, function () {
        // reset form state after update
        $("#post-id").val("");
        $("#form-title").text("Create Post");
        $("#save-btn").text("Create");
        $("#post-form")[0].reset();
      });
    }
  });

  // Reset form
  $("#reset-btn").click(function () {
    $("#post-id").val("");
    $("#form-title").text("Create Post");
    $("#save-btn").text("Create");
    $("#post-form")[0].reset();
    $("#post-title, #post-body").removeClass("is-invalid");
  });

  //  actions for dynamic rows
  $("#posts-tbody")
    .on("click", ".edit-btn", function () {
      const tr = $(this).closest("tr");
      const id = tr.attr("data-id");
      
      // Fetch full post
      setSmallLoader(true);
      $.get(`${API_BASE}/${id}`)
        .done(function (post) {
          $("#post-id").val(post.id);
          $("#post-title").val(post.title).removeClass("is-invalid");
          $("#post-body").val(post.body).removeClass("is-invalid");
          $("#form-title").text(`Edit Post ${post.id}`);
          $("#save-btn").text("Save changes");
          // scroll to form
          $('html, body').animate({ scrollTop: $("#post-form").offset().top - 70 }, 400);
        })
        .fail(function () {
          showToast("Failed to load post for editing.", "danger");
        }).always(function () {
          setSmallLoader(false);
        });
    })
    .on("click", ".view-btn", function () {
      const id = $(this).closest("tr").attr("data-id");
      viewPostDetails(id);
    })
    .on("click", ".delete-btn", function () {
      const id = $(this).closest("tr").attr("data-id");
      deletePost(id);
    });

  // Modal save (if using modal editing)
  $("#modal-edit-form").on("submit", function (e) {
    e.preventDefault();
    const id = $("#modal-post-id").val();
    const title = $("#modal-post-title").val().trim();
    const body = $("#modal-post-body").val().trim();

    // validation
    if (!formIsValid("#modal-post-title", "#modal-post-body")) {
      showToast("Fix modal validation errors.", "danger");
      return;
    }

    updatePost(id, title, body, function () {
      
      const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
      modal.hide();
    });
  });

  //  clear invalid class on input
  $(document).on("input", "#post-title, #post-body, #modal-post-title, #modal-post-body", function () {
    if ($(this).val().trim().length > 0) $(this).removeClass("is-invalid");
  });

});
