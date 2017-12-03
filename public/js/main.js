$(document).ready(function() {
  $('.delete-post').on('click', function() {
    var id = $(this).data('id');
    var url = '/delete/' + id;

    if (confirm('Delete Post?')) {
      $.ajax({
        url: url,
        type: 'DELETE',
        success: function(result) {
          console.log('Deleting Post');
          window.location.href = '/';
        },
        error: function(err) {
          console.log(err);
        }
      });
    }
  });

  $('.edit-post').on('click', function() {
    $('#edit-form-title').val($(this).data('title'));
    $('#edit-form-post').val($(this).data('post'));
    $('#edit-form-source').val($(this).data('source'));
    $('#edit-form-id').val($(this).data('id'));

  });


}); // end jquery
